interface ContactPayload {
  name?: string;
  email?: string;
  company?: string;
  subject?: string;
  message?: string;
  /** Honeypot. Hidden from humans, so any value means a bot filled the form. */
  website?: string;
}

/** A submission that passed validation — every real field present, honeypot dropped. */
type ContactData = Required<Omit<ContactPayload, "website">>;

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resendFromEmail = Deno.env.get("RESEND_FROM_EMAIL");
const internalEmail = "Info@linqueresourcing.com";

const jsonHeaders = { "Content-Type": "application/json" };

/**
 * Origins allowed to read this function's responses. Override with a
 * comma-separated ALLOWED_ORIGINS secret to add preview or staging domains.
 * Note this only constrains browsers — it does not stop direct requests.
 */
const allowedOrigins = (
  Deno.env.get("ALLOWED_ORIGINS") ??
  "https://linqueresourcing.com,https://www.linqueresourcing.com,http://localhost:5173,http://localhost:8080"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsHeaders = (origin: string | null) => {
  const headers: Record<string, string> = {
    Vary: "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (origin && allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
};

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

/**
 * Per-instance sliding window keyed on client IP. Edge functions run as
 * several isolates, so this caps the rate each one will accept rather than
 * enforcing a single global number.
 */
const recentSubmissions = new Map<string, number[]>();

const clientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("cf-connecting-ip") ||
  "unknown";

const isRateLimited = (ip: string) => {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  for (const [key, stamps] of recentSubmissions) {
    const live = stamps.filter((stamp) => stamp > cutoff);
    if (live.length === 0) recentSubmissions.delete(key);
    else recentSubmissions.set(key, live);
  }

  const stamps = recentSubmissions.get(ip) ?? [];
  if (stamps.length >= RATE_LIMIT_MAX) return true;

  recentSubmissions.set(ip, [...stamps, now]);
  return false;
};

const VOWELS = new Set(["a", "e", "i", "o", "u", "y"]);

/**
 * Scores how much a field looks machine-generated. The spam we see fills
 * fields with tokens like "AHsOHlgAvlbkziuLbkFxYaI" — pronounceable-looking
 * but with case flips and consonant runs no real name or subject has.
 */
const gibberishScore = (value: string) => {
  let score = 0;

  if (/https?:\/\/|www\.|<a\s|\[url/i.test(value)) score += 3;

  for (const word of value.split(/\s+/).filter((w) => w.length >= 8)) {
    const letters = word.replace(/[^A-Za-z]/g, "");
    if (letters.length < 8) continue;

    let caseFlips = 0;
    let consonantRun = 0;
    let longestConsonantRun = 0;
    let vowelCount = 0;

    for (let i = 0; i < letters.length; i += 1) {
      const char = letters[i];
      const lower = char.toLowerCase();

      if (i > 0 && letters[i - 1] === letters[i - 1].toLowerCase() && char === char.toUpperCase()) {
        caseFlips += 1;
      }

      if (VOWELS.has(lower)) {
        vowelCount += 1;
        consonantRun = 0;
      } else {
        consonantRun += 1;
        longestConsonantRun = Math.max(longestConsonantRun, consonantRun);
      }
    }

    if (caseFlips >= 3) score += 1;
    if (longestConsonantRun >= 5) score += 1;
    if (vowelCount / letters.length < 0.25) score += 1;
  }

  return score;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const sendEmail = async (payload: Record<string, unknown>) => {
  if (!resendApiKey) throw new Error("RESEND_API_KEY is not configured.");
  if (!resendFromEmail) throw new Error("RESEND_FROM_EMAIL is not configured.");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({ from: resendFromEmail, ...payload }),
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof body === "object" && body && "message" in body && typeof body.message === "string"
        ? body.message
        : `Resend returned ${response.status}.`;
    throw new Error(message);
  }

  return (body as { id: string }).id;
};

const buildInternalEmail = (data: ContactData) => {
  const text = [
    `New contact form submission from ${data.name} at ${data.company}.`,
    "",
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    `Company: ${data.company}`,
    `Subject: ${data.subject}`,
    "",
    "Message:",
    data.message,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #172119; line-height: 1.6;">
      <h1 style="margin-bottom: 8px;">New contact form submission</h1>
      <p style="margin-top: 0;">
        <strong>${escapeHtml(data.name)}</strong> from <strong>${escapeHtml(data.company)}</strong> reached out via the website.
      </p>
      <div style="padding: 16px; border: 1px solid #d7ded5; border-radius: 12px; background: #f8faf7; margin-bottom: 20px;">
        <p style="margin: 0 0 6px;"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p style="margin: 0 0 6px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
        <p style="margin: 0 0 6px;"><strong>Company:</strong> ${escapeHtml(data.company)}</p>
        <p style="margin: 0;"><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
      </div>
      <h2 style="margin-bottom: 8px;">Message</h2>
      <p style="white-space: pre-wrap; margin-top: 0;">${escapeHtml(data.message)}</p>
    </div>
  `;

  return { text, html };
};

const buildConfirmationEmail = (data: ContactData) => {
  const text = [
    `Dear ${data.name},`,
    "",
    "Thank you for reaching out to Linque Resourcing. We have received your message and appreciate you taking the time to connect with us.",
    "",
    "Our team will review your inquiry and get back to you within one business day. In the meantime, if you have any urgent questions, please feel free to call us at +1 (713) 379-6630.",
    "",
    "We look forward to speaking with you.",
    "",
    "Warm regards,",
    "The Linque Resourcing Team",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #172119; line-height: 1.6; max-width: 600px;">
      <p style="margin-top: 0;">Dear ${escapeHtml(data.name)},</p>
      <p>Thank you for reaching out to Linque Resourcing. We have received your message and appreciate you taking the time to connect with us.</p>
      <p>Our team will review your inquiry and get back to you within one business day. In the meantime, if you have any urgent questions, please feel free to call us at <a href="tel:+17133796630">+1 (713) 379-6630</a>.</p>
      <p>We look forward to speaking with you.</p>
      <p style="margin-bottom: 0;">Warm regards,</p>
      <p style="margin-top: 4px;"><strong>The Linque Resourcing Team</strong></p>
    </div>
  `;

  return { text, html };
};

Deno.serve(async (request) => {
  const cors = corsHeaders(request.headers.get("origin"));
  const responseHeaders = { ...jsonHeaders, ...cors };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers: responseHeaders });
  }

  try {
    const raw = (await request.json()) as ContactPayload;

    const name = raw.name?.trim() ?? "";
    const email = raw.email?.trim() ?? "";
    const company = raw.company?.trim() ?? "";
    const subject = raw.subject?.trim() ?? "";
    const message = raw.message?.trim() ?? "";
    const honeypot = raw.website?.trim() ?? "";

    // Report success to suspected bots so they don't retry or adapt, but send
    // nothing. Anything that reaches a `return` here costs zero outbound email.
    const silentlyDiscard = (reason: string) => {
      console.warn(`[contact-notifications] discarded submission (${reason})`, { name, email, subject });
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: responseHeaders });
    };

    if (honeypot) return silentlyDiscard("honeypot");

    if (!name || !email || !company || !subject || !message) {
      return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400, headers: responseHeaders });
    }

    const spamScore = gibberishScore(name) + gibberishScore(company) + gibberishScore(subject);
    if (spamScore >= 3) return silentlyDiscard(`content heuristics, score ${spamScore}`);

    if (isRateLimited(clientIp(request))) {
      return new Response(
        JSON.stringify({ error: "Too many messages from this network. Please try again later or email info@linqueresourcing.com." }),
        { status: 429, headers: responseHeaders },
      );
    }

    const data: ContactData = { name, email, company, subject, message };
    const internal = buildInternalEmail(data);
    const confirmation = buildConfirmationEmail(data);

    const errors: string[] = [];

    try {
      await sendEmail({
        to: [internalEmail],
        subject: `New enquiry from ${name} — ${subject}`,
        html: internal.html,
        text: internal.text,
        reply_to: [email],
      });
    } catch (err) {
      errors.push(`Internal notification: ${err instanceof Error ? err.message : "Unknown error"}`);
    }

    try {
      await sendEmail({
        to: [email],
        subject: "We received your message — Linque Resourcing",
        html: confirmation.html,
        text: confirmation.text,
      });
    } catch (err) {
      errors.push(`Sender confirmation: ${err instanceof Error ? err.message : "Unknown error"}`);
    }

    if (errors.length === 2) {
      return new Response(JSON.stringify({ error: errors.join(" | ") }), {
        status: 500,
        headers: responseHeaders,
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[contact-notifications]", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected error." }),
      { status: 500, headers: responseHeaders },
    );
  }
});

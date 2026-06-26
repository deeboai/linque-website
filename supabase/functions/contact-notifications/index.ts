interface ContactPayload {
  name?: string;
  email?: string;
  company?: string;
  subject?: string;
  message?: string;
}

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resendFromEmail = Deno.env.get("RESEND_FROM_EMAIL");
const internalEmail = "Info@linqueresourcing.com";

const jsonHeaders = { "Content-Type": "application/json" };

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

const buildInternalEmail = (data: Required<ContactPayload>) => {
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

const buildConfirmationEmail = (data: Required<ContactPayload>) => {
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
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers: jsonHeaders });
  }

  try {
    const raw = (await request.json()) as ContactPayload;

    const name = raw.name?.trim() ?? "";
    const email = raw.email?.trim() ?? "";
    const company = raw.company?.trim() ?? "";
    const subject = raw.subject?.trim() ?? "";
    const message = raw.message?.trim() ?? "";

    if (!name || !email || !company || !subject || !message) {
      return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400, headers: jsonHeaders });
    }

    const data: Required<ContactPayload> = { name, email, company, subject, message };
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
        headers: { ...jsonHeaders, "Access-Control-Allow-Origin": "*" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...jsonHeaders, "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    console.error("[contact-notifications]", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected error." }),
      { status: 500, headers: { ...jsonHeaders, "Access-Control-Allow-Origin": "*" } },
    );
  }
});

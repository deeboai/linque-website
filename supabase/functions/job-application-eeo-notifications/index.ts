import { createClient } from "npm:@supabase/supabase-js@2";

type NotificationStatus = "pending" | "sent" | "failed";

interface NotificationWebhookPayload {
  applicationId?: string;
}

interface JobApplicationEeoRecord {
  application_id: string;
  race_ethnicity: string;
  gender: string;
  veteran_status: string;
  disability_status: string;
  notification_status: NotificationStatus;
  notification_error?: string | null;
  notification_attempted_at?: string | null;
  notification_email_id?: string | null;
  created_at: string;
}

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resendFromEmail = Deno.env.get("RESEND_FROM_EMAIL");
const webhookSecret =
  Deno.env.get("JOB_APPLICATION_EEO_WEBHOOK_SECRET") ?? Deno.env.get("JOB_APPLICATION_WEBHOOK_SECRET");
const eeoNotificationEmail = "Info@linqueresourcing.com";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
  (() => {
    const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
    if (!secretKeys) return undefined;

    try {
      const parsed = JSON.parse(secretKeys) as Record<string, string>;
      return parsed.default;
    } catch {
      return undefined;
    }
  })();

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Supabase admin credentials are not available in the Edge Function environment.");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const jsonHeaders = { "Content-Type": "application/json" };

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const sendEmail = async (payload: Record<string, unknown>, idempotencyKey: string) => {
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!resendFromEmail) {
    throw new Error("RESEND_FROM_EMAIL is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from: resendFromEmail,
      ...payload,
    }),
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof body === "object" && body && "message" in body && typeof body.message === "string"
        ? body.message
        : `Resend returned ${response.status}.`;
    throw new Error(message);
  }

  if (!body || typeof body !== "object" || !("id" in body) || typeof body.id !== "string") {
    throw new Error("Resend did not return an email id.");
  }

  return body.id;
};

const loadEeoRecord = async (applicationId: string) => {
  const { data, error } = await supabaseAdmin
    .from("job_application_eeo")
    .select("*")
    .eq("application_id", applicationId)
    .maybeSingle();
  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(`EEO response ${applicationId} was not found.`);
  }

  return data as JobApplicationEeoRecord;
};

const updateNotificationState = async (applicationId: string, updates: Record<string, unknown>) => {
  const { error } = await supabaseAdmin
    .from("job_application_eeo")
    .update(updates)
    .eq("application_id", applicationId);
  if (error) {
    throw error;
  }
};

const buildEeoEmail = (record: JobApplicationEeoRecord) => {
  const text = [
    "A new EEO response was submitted.",
    "",
    `Application id: ${record.application_id}`,
    `Race: ${record.race_ethnicity}`,
    `Gender: ${record.gender}`,
    `Veteran status: ${record.veteran_status}`,
    `Disability status: ${record.disability_status}`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #172119; line-height: 1.6;">
      <h1 style="margin-bottom: 8px;">New EEO response</h1>
      <p style="margin-top: 0;">A separate EEO questionnaire response was submitted.</p>
      <div style="padding: 16px; border: 1px solid #d7ded5; border-radius: 12px; background: #f8faf7;">
        <p style="margin: 0 0 6px;"><strong>Application id:</strong> ${escapeHtml(record.application_id)}</p>
        <p style="margin: 0 0 6px;"><strong>Race:</strong> ${escapeHtml(record.race_ethnicity)}</p>
        <p style="margin: 0 0 6px;"><strong>Gender:</strong> ${escapeHtml(record.gender)}</p>
        <p style="margin: 0 0 6px;"><strong>Veteran status:</strong> ${escapeHtml(record.veteran_status)}</p>
        <p style="margin: 0;"><strong>Disability status:</strong> ${escapeHtml(record.disability_status)}</p>
      </div>
    </div>
  `;

  return { text, html };
};

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers: jsonHeaders });
  }

  if (!webhookSecret || request.headers.get("x-webhook-secret") !== webhookSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers: jsonHeaders });
  }

  try {
    const payload = (await request.json()) as NotificationWebhookPayload;
    const applicationId = payload.applicationId?.trim();
    if (!applicationId) {
      return new Response(JSON.stringify({ error: "applicationId is required." }), { status: 400, headers: jsonHeaders });
    }

    const eeoRecord = await loadEeoRecord(applicationId);
    if (eeoRecord.notification_status === "sent" && eeoRecord.notification_email_id) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), { status: 200, headers: jsonHeaders });
    }

    const attemptedAt = new Date().toISOString();
    const emailBody = buildEeoEmail(eeoRecord);

    try {
      const emailId = await sendEmail(
        {
          to: [eeoNotificationEmail],
          subject: `New EEO response for application ${eeoRecord.application_id}`,
          html: emailBody.html,
          text: emailBody.text,
        },
        `job-application-eeo-${eeoRecord.application_id}`,
      );

      await updateNotificationState(applicationId, {
        notification_status: "sent",
        notification_error: null,
        notification_attempted_at: attemptedAt,
        notification_email_id: emailId,
      });

      return new Response(JSON.stringify({ ok: true, notificationEmailId: emailId }), {
        status: 200,
        headers: jsonHeaders,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      await updateNotificationState(applicationId, {
        notification_status: "failed",
        notification_error: message,
        notification_attempted_at: attemptedAt,
      });
      return new Response(JSON.stringify({ error: message }), { status: 500, headers: jsonHeaders });
    }
  } catch (error) {
    console.error("[job-application-eeo-notifications]", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected error." }),
      { status: 500, headers: jsonHeaders },
    );
  }
});

import { createClient } from "npm:@supabase/supabase-js@2";

type NotificationStatus = "pending" | "sent" | "partial" | "failed";

interface NotificationWebhookPayload {
  applicationId?: string;
}

interface JobApplicationRecord {
  id: string;
  job_id: string;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  desired_pay: string;
  work_authorization: string;
  available_start_date: string;
  highest_education: string;
  why_interested: string;
  background_check_consent: boolean;
  future_role_interest: boolean;
  professional_references: Array<{
    name?: string;
    company?: string;
    phone?: string;
    email?: string;
  }>;
  screening_answers: Array<{
    questionLabel?: string;
    answer?: string;
  }>;
  resume_bucket: string;
  resume_path: string;
  resume_file_name: string;
  notification_status: NotificationStatus;
  internal_notification_sent_at?: string | null;
  applicant_confirmation_sent_at?: string | null;
}

interface JobRecord {
  id: string;
  apply_email?: string | null;
}

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resendFromEmail = Deno.env.get("RESEND_FROM_EMAIL");
const webhookSecret = Deno.env.get("JOB_APPLICATION_WEBHOOK_SECRET");
const defaultNotificationEmail = Deno.env.get("APPLICATION_DEFAULT_NOTIFICATION_EMAIL") ?? "";
const applicationAdminUrl = Deno.env.get("APPLICATION_ADMIN_URL") ?? "https://linqueresourcing.com/admin";

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

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const parseRecipientList = (value?: string | null) =>
  (value ?? "")
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);

const buildReferencesText = (application: JobApplicationRecord) => {
  if (application.professional_references.length === 0) {
    return "No professional references were provided.";
  }

  return application.professional_references
    .map((reference, index) =>
      [
        `${index + 1}. ${reference.name || "Unnamed reference"}`,
        `   Company: ${reference.company || "Not provided"}`,
        `   Phone: ${reference.phone || "Not provided"}`,
        `   Email: ${reference.email || "Not provided"}`,
      ].join("\n"),
    )
    .join("\n\n");
};

const buildReferencesHtml = (application: JobApplicationRecord) => {
  if (application.professional_references.length === 0) {
    return "<p>No professional references were provided.</p>";
  }

  return application.professional_references
    .map(
      (reference, index) => `
        <div style="margin-bottom: 12px; padding: 12px; border: 1px solid #d7ded5; border-radius: 10px;">
          <p style="margin: 0 0 6px; font-weight: 700;">${index + 1}. ${escapeHtml(reference.name || "Unnamed reference")}</p>
          <p style="margin: 0;">Company: ${escapeHtml(reference.company || "Not provided")}</p>
          <p style="margin: 0;">Phone: ${escapeHtml(reference.phone || "Not provided")}</p>
          <p style="margin: 0;">Email: ${escapeHtml(reference.email || "Not provided")}</p>
        </div>
      `,
    )
    .join("");
};

const buildScreeningAnswersText = (application: JobApplicationRecord) => {
  if (application.screening_answers.length === 0) {
    return "No screening answers were provided.";
  }

  return application.screening_answers
    .map((answer, index) => `${index + 1}. ${answer.questionLabel || "Question"}\n   ${answer.answer || "No response provided"}`)
    .join("\n\n");
};

const buildScreeningAnswersHtml = (application: JobApplicationRecord) => {
  if (application.screening_answers.length === 0) {
    return "<p>No screening answers were provided.</p>";
  }

  return application.screening_answers
    .map(
      (answer, index) => `
        <div style="margin-bottom: 12px; padding: 12px; border: 1px solid #d7ded5; border-radius: 10px;">
          <p style="margin: 0 0 6px; font-weight: 700;">${index + 1}. ${escapeHtml(answer.questionLabel || "Question")}</p>
          <p style="margin: 0;">${escapeHtml(answer.answer || "No response provided")}</p>
        </div>
      `,
    )
    .join("");
};

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

const updateNotificationState = async (applicationId: string, updates: Record<string, unknown>) => {
  const { error } = await supabaseAdmin.from("job_applications").update(updates).eq("id", applicationId);
  if (error) {
    throw error;
  }
};

const loadApplication = async (applicationId: string) => {
  const { data, error } = await supabaseAdmin.from("job_applications").select("*").eq("id", applicationId).maybeSingle();
  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(`Application ${applicationId} was not found.`);
  }

  return data as JobApplicationRecord;
};

const loadJob = async (jobId: string) => {
  const { data, error } = await supabaseAdmin.from("jobs").select("id, apply_email").eq("id", jobId).maybeSingle();
  if (error) {
    throw error;
  }

  return (data as JobRecord | null) ?? null;
};

const createResumeLink = async (application: JobApplicationRecord) => {
  // The private resume bucket requires a signed URL so reviewers can open the file directly from the notification email.
  const { data, error } = await supabaseAdmin.storage
    .from(application.resume_bucket)
    .createSignedUrl(application.resume_path, 60 * 60 * 24 * 7, {
      download: application.resume_file_name,
    });

  if (error) {
    console.error("[job-application-notifications] Unable to create signed resume URL", error);
    return null;
  }

  return data.signedUrl;
};

const buildInternalEmail = (application: JobApplicationRecord, resumeUrl: string | null) => {
  const applicantSummary = [
    `Role: ${application.job_title}`,
    `Applicant: ${application.full_name}`,
    `Email: ${application.email}`,
    `Phone: ${application.phone}`,
    `Address: ${application.address}`,
    `Desired pay: ${application.desired_pay}`,
    `Work authorization: ${application.work_authorization}`,
    `Available start date: ${application.available_start_date}`,
    `Education: ${application.highest_education}`,
    `Background screening consent: ${application.background_check_consent ? "Yes" : "No"}`,
    `Open to future roles: ${application.future_role_interest ? "Yes" : "No"}`,
  ].join("\n");

  const text = [
    `A new application was submitted for ${application.job_title}.`,
    "",
    applicantSummary,
    "",
    "Why this role",
    application.why_interested,
    "",
    "Screening answers",
    buildScreeningAnswersText(application),
    "",
    "Professional references",
    buildReferencesText(application),
    "",
    `Admin dashboard: ${applicationAdminUrl}`,
    resumeUrl ? `Resume download: ${resumeUrl}` : "Resume download: Open the admin dashboard to download the file.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #172119; line-height: 1.6;">
      <h1 style="margin-bottom: 8px;">New job application</h1>
      <p style="margin-top: 0;">A new application was submitted for <strong>${escapeHtml(application.job_title)}</strong>.</p>
      <div style="padding: 16px; border: 1px solid #d7ded5; border-radius: 12px; background: #f8faf7; margin-bottom: 20px;">
        <p style="margin: 0 0 6px;"><strong>Applicant:</strong> ${escapeHtml(application.full_name)}</p>
        <p style="margin: 0 0 6px;"><strong>Email:</strong> ${escapeHtml(application.email)}</p>
        <p style="margin: 0 0 6px;"><strong>Phone:</strong> ${escapeHtml(application.phone)}</p>
        <p style="margin: 0 0 6px;"><strong>Address:</strong> ${escapeHtml(application.address)}</p>
        <p style="margin: 0 0 6px;"><strong>Desired pay:</strong> ${escapeHtml(application.desired_pay)}</p>
        <p style="margin: 0 0 6px;"><strong>Work authorization:</strong> ${escapeHtml(application.work_authorization)}</p>
        <p style="margin: 0 0 6px;"><strong>Available start date:</strong> ${escapeHtml(application.available_start_date)}</p>
        <p style="margin: 0 0 6px;"><strong>Education:</strong> ${escapeHtml(application.highest_education)}</p>
        <p style="margin: 0 0 6px;"><strong>Background screening consent:</strong> ${application.background_check_consent ? "Yes" : "No"}</p>
        <p style="margin: 0;"><strong>Open to future roles:</strong> ${application.future_role_interest ? "Yes" : "No"}</p>
      </div>
      <h2 style="margin-bottom: 8px;">Why this role</h2>
      <p style="margin-top: 0;">${escapeHtml(application.why_interested)}</p>
      <h2 style="margin-bottom: 8px;">Screening answers</h2>
      ${buildScreeningAnswersHtml(application)}
      <h2 style="margin-bottom: 8px;">Professional references</h2>
      ${buildReferencesHtml(application)}
      <p style="margin-top: 24px;"><a href="${escapeHtml(applicationAdminUrl)}">Open the admin dashboard</a></p>
      ${
        resumeUrl
          ? `<p><a href="${escapeHtml(resumeUrl)}">Download the resume</a> (link expires in 7 days)</p>`
          : "<p>Download the resume from the admin dashboard.</p>"
      }
    </div>
  `;

  return { text, html };
};

const buildApplicantEmail = (application: JobApplicationRecord) => {
  const text = [
    "Dear Applicant,",
    "",
    `Thank you for your interest in the ${application.job_title} position at Linque Resourcing.`,
    "",
    "Your application is important to us, we will review your skills and experience against the needs of the position and other applicants.",
    "",
    "Once we have reviewed your details, we will respond to let you know the status of your application.",
    "",
    "Linque Resourcing Recruitment Team",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #172119; line-height: 1.6; max-width: 600px;">
      <p style="margin-top: 0;">Dear Applicant,</p>
      <p>Thank you for your interest in the <strong>${escapeHtml(application.job_title)}</strong> position at Linque Resourcing.</p>
      <p>Your application is important to us, we will review your skills and experience against the needs of the position and other applicants.</p>
      <p>Once we have reviewed your details, we will respond to let you know the status of your application.</p>
      <p style="margin-bottom: 0;">Linque Resourcing Recruitment Team</p>
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

    const application = await loadApplication(applicationId);
    if (
      application.notification_status === "sent" &&
      application.internal_notification_sent_at &&
      application.applicant_confirmation_sent_at
    ) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), { status: 200, headers: jsonHeaders });
    }

    const job = await loadJob(application.job_id);
    const internalRecipients = parseRecipientList(job?.apply_email || defaultNotificationEmail);
    if (internalRecipients.length === 0) {
      const errorMessage = "No internal notification email is configured for this role.";
      await updateNotificationState(applicationId, {
        notification_status: "failed",
        notification_error: errorMessage,
        notification_attempted_at: new Date().toISOString(),
      });
      return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: jsonHeaders });
    }

    const resumeUrl = await createResumeLink(application);
    const attemptedAt = new Date().toISOString();
    const internalEmail = buildInternalEmail(application, resumeUrl);
    const applicantEmail = buildApplicantEmail(application);

    let internalNotificationEmailId: string | null = null;
    let applicantConfirmationEmailId: string | null = null;
    let internalNotificationSentAt: string | null = null;
    let applicantConfirmationSentAt: string | null = null;
    const errors: string[] = [];

    try {
      internalNotificationEmailId = await sendEmail(
        {
          to: internalRecipients,
          subject: `New application: ${application.full_name} for ${application.job_title}`,
          html: internalEmail.html,
          text: internalEmail.text,
          reply_to: [application.email],
        },
        `job-application-internal-${application.id}`,
      );
      internalNotificationSentAt = attemptedAt;
    } catch (error) {
      errors.push(`Internal notification: ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    try {
      applicantConfirmationEmailId = await sendEmail(
        {
          to: [application.email],
          subject: `We received your application for ${application.job_title}`,
          html: applicantEmail.html,
          text: applicantEmail.text,
          reply_to: [internalRecipients[0]],
        },
        `job-application-applicant-${application.id}`,
      );
      applicantConfirmationSentAt = attemptedAt;
    } catch (error) {
      errors.push(`Applicant confirmation: ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    const notificationStatus: NotificationStatus =
      errors.length === 0 ? "sent" : internalNotificationSentAt || applicantConfirmationSentAt ? "partial" : "failed";

    await updateNotificationState(applicationId, {
      notification_status: notificationStatus,
      notification_error: errors.length > 0 ? errors.join(" | ") : null,
      notification_attempted_at: attemptedAt,
      internal_notification_sent_at: internalNotificationSentAt,
      applicant_confirmation_sent_at: applicantConfirmationSentAt,
      internal_notification_email_id: internalNotificationEmailId,
      applicant_confirmation_email_id: applicantConfirmationEmailId,
    });

    if (notificationStatus === "failed") {
      return new Response(JSON.stringify({ error: errors.join(" | ") }), { status: 500, headers: jsonHeaders });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        notificationStatus,
        internalNotificationEmailId,
        applicantConfirmationEmailId,
      }),
      { status: 200, headers: jsonHeaders },
    );
  } catch (error) {
    console.error("[job-application-notifications]", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected error." }),
      { status: 500, headers: jsonHeaders },
    );
  }
});

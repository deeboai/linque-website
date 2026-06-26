// EEO notification emails have been retired. EEO data is now surfaced as
// de-identified aggregate counts per job in the admin dashboard instead of
// forwarding individual responses to a compliance inbox.
//
// This handler is kept as a no-op so the DB trigger webhook calls continue
// to succeed without requiring a schema change to the live database.
// When the trigger is removed from the database this file can be deleted.

import { createClient } from "npm:@supabase/supabase-js@2";

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
  auth: { persistSession: false, autoRefreshToken: false },
});

const webhookSecret =
  Deno.env.get("JOB_APPLICATION_EEO_WEBHOOK_SECRET") ?? Deno.env.get("JOB_APPLICATION_WEBHOOK_SECRET");

const jsonHeaders = { "Content-Type": "application/json" };

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers: jsonHeaders });
  }

  if (!webhookSecret || request.headers.get("x-webhook-secret") !== webhookSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized." }), { status: 401, headers: jsonHeaders });
  }

  try {
    const payload = (await request.json()) as { applicationId?: string };
    const applicationId = payload.applicationId?.trim();
    if (!applicationId) {
      return new Response(JSON.stringify({ error: "applicationId is required." }), { status: 400, headers: jsonHeaders });
    }

    // Mark the record as handled so the DB doesn't log stale webhook failures.
    // No email is sent — EEO data is now displayed as aggregate counts in the admin dashboard.
    await supabaseAdmin
      .from("job_application_eeo")
      .update({
        notification_status: "sent",
        notification_attempted_at: new Date().toISOString(),
      })
      .eq("application_id", applicationId);

    return new Response(JSON.stringify({ ok: true, retired: true }), { status: 200, headers: jsonHeaders });
  } catch (error) {
    console.error("[job-application-eeo-notifications]", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected error." }),
      { status: 500, headers: jsonHeaders },
    );
  }
});

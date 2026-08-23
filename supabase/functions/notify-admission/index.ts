import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const esc=(v:string="")=>v.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m] as string));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { applicationId } = await req.json();
    if (!applicationId) throw new Error("applicationId is required");

    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    const fromEmail = Deno.env.get("FROM_EMAIL");
    const adminDashboardUrl = Deno.env.get("ADMIN_DASHBOARD_URL") || "";

    const supabase = createClient(url, serviceKey);
    const { data: app, error } = await supabase
      .from("admission_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (error || !app) throw error || new Error("Application not found");

    // Prevent repeated email sends for the same application.
    if (app.email_status === "sent" && app.email_sent_at) {
      return new Response(JSON.stringify({ ok: true, alreadySent: true }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // Only notify for a recent application submission.
    const ageMs = Date.now() - new Date(app.created_at).getTime();
    if (ageMs > 1000 * 60 * 60 * 24) {
      throw new Error("Notification window has expired for this application");
    }

    if (!resendKey || !adminEmail || !fromEmail) {
      await supabase.from("admission_applications").update({
        email_status: "not_configured",
        email_error: "Email provider secrets are not configured",
      }).eq("id", applicationId);
      return new Response(JSON.stringify({ ok: true, emailConfigured: false }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const adminHtml = `
      <h2>New Keffi Premier Academy Admission Application</h2>
      <p><strong>Reference:</strong> ${esc(app.reference_number)}</p>
      <p><strong>Student:</strong> ${esc(app.student_first_name + " " + app.student_last_name)}</p>
      <p><strong>Class:</strong> ${esc(app.applying_for_class)}</p>
      <p><strong>Parent/Guardian:</strong> ${esc(app.parent_name)}</p>
      <p><strong>Phone:</strong> ${esc(app.parent_phone)}</p>
      <p>For privacy and security, review the full application inside the KPA Admin Dashboard.</p>
      ${adminDashboardUrl ? `<p><a href="${esc(adminDashboardUrl)}">Open KPA Admin Dashboard</a></p>` : ""}
    `;

    const parentHtml = `
      <h2>Application Received — Keffi Premier Academy</h2>
      <p>Thank you for submitting an admission application to Keffi Premier Academy.</p>
      <p><strong>Application reference:</strong> ${esc(app.reference_number)}</p>
      <p><strong>Student:</strong> ${esc(app.student_first_name + " " + app.student_last_name)}</p>
      <p>Please keep your reference number for future communication with the School.</p>
      <p>The Admissions Team will contact you if further information or next steps are required.</p>
    `;

    const send = async (to:string, subject:string, html:string, recipientType:string) => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: fromEmail, to: [to], subject, html }),
      });
      const payload = await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(JSON.stringify(payload));
      await supabase.from("notification_log").insert({
        application_id: applicationId,
        channel: "email",
        recipient_type: recipientType,
        recipient: to,
        status: "sent",
        provider_message_id: payload?.id || null,
      });
      return payload;
    };

    try {
      await Promise.all([
        send(adminEmail, `New KPA Admission Application — ${app.reference_number}`, adminHtml, "admin"),
        send(app.parent_email, `KPA Application Received — ${app.reference_number}`, parentHtml, "parent"),
      ]);
      await supabase.from("admission_applications").update({
        email_status: "sent",
        email_sent_at: new Date().toISOString(),
        email_error: null,
      }).eq("id", applicationId);
    } catch (mailError) {
      const msg = String(mailError);
      await supabase.from("notification_log").insert({
        application_id: applicationId,
        channel: "email",
        recipient_type: "system",
        status: "failed",
        error: msg,
      });
      await supabase.from("admission_applications").update({
        email_status: "failed",
        email_error: msg.slice(0, 1000),
      }).eq("id", applicationId);
      throw mailError;
    }

    return new Response(JSON.stringify({ ok: true, emailConfigured: true }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization") || "";

    const callerClient = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
    const { data: { user }, error: userErr } = await callerClient.auth.getUser();
    if (userErr || !user) throw new Error("Unauthorized");

    const serviceClient = createClient(url, service);
    const { data: profile } = await serviceClient.from("admin_users")
      .select("role,is_active")
      .eq("user_id", user.id)
      .single();
    if (!profile?.is_active || profile.role !== "super_admin") throw new Error("Super Admin access required");

    const body = await req.json();
    const action = body.action;

    if (action === "create") {
      const email = String(body.email || "").trim().toLowerCase();
      const displayName = String(body.displayName || "").trim();
      const role = String(body.role || "viewer");
      if (!email || !displayName) throw new Error("Email and display name are required");
      if (!["super_admin","school_admin","editor","admissions","viewer"].includes(role)) throw new Error("Invalid role");

      const tempPassword = crypto.randomUUID() + "Aa1!";
      const { data: created, error: createErr } = await serviceClient.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { display_name: displayName, must_reset_password: true },
      });
      if (createErr || !created.user) throw createErr || new Error("Could not create user");

      const { error: profileErr } = await serviceClient.from("admin_users").insert({
        user_id: created.user.id,
        display_name: displayName,
        role,
        is_active: true,
      });
      if (profileErr) throw profileErr;

      await serviceClient.from("audit_log").insert({
        actor_user_id: user.id,
        actor_role: profile.role,
        action: "create_admin_user",
        entity_type: "admin_user",
        entity_id: created.user.id,
        details: { email, displayName, role },
      });

      return Response.json({ ok: true, userId: created.user.id, temporaryPassword: tempPassword }, { headers: CORS });
    }

    if (action === "set_active") {
      const userId = String(body.userId || "");
      const isActive = Boolean(body.isActive);
      if (!userId) throw new Error("userId is required");
      if (userId === user.id && !isActive) throw new Error("You cannot deactivate your own Super Admin account");
      const { error } = await serviceClient.from("admin_users").update({ is_active: isActive }).eq("user_id", userId);
      if (error) throw error;
      return Response.json({ ok: true }, { headers: CORS });
    }

    if (action === "set_role") {
      const userId = String(body.userId || "");
      const role = String(body.role || "viewer");
      if (!["super_admin","school_admin","editor","admissions","viewer"].includes(role)) throw new Error("Invalid role");
      if (userId === user.id && role !== "super_admin") throw new Error("You cannot remove your own Super Admin role");
      const { error } = await serviceClient.from("admin_users").update({ role }).eq("user_id", userId);
      if (error) throw error;
      return Response.json({ ok: true }, { headers: CORS });
    }

    throw new Error("Unsupported action");
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});

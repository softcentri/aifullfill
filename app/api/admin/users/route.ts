import { NextResponse } from "next/server";
import { verifyAdmin } from "@/utils/supabase/admin-auth";

export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  const { supabase } = auth;

  try {
    // 1. ดึงโปรไฟล์ทั้งหมด
    const { data: profiles, error: pErr } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (pErr) throw pErr;

    // 2. ดึง Subscriptions ทั้งหมด
    const { data: subscriptions, error: sErr } = await supabase
      .from("user_subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    // 3. ดึง API Keys & Devices ทั้งหมด
    const { data: apiKeys, error: kErr } = await supabase
      .from("user_api_keys")
      .select("*")
      .order("created_at", { ascending: false });

    // รวมข้อมูลเป็นรายการ User ครบวงจร
    const users = (profiles || []).map((p: any) => {
      const sub = (subscriptions || []).find((s: any) => s.user_id === p.user_id);
      const key = (apiKeys || []).find((k: any) => k.user_id === p.user_id);
      const devices = Array.isArray(key?.devices) ? key.devices : [];

      return {
        id: p.id,
        user_id: p.user_id,
        email: p.email,
        full_name: p.full_name || "ไม่มีชื่อ",
        avatar_url: p.avatar_url,
        role: p.role,
        created_at: p.created_at,
        subscription: sub
          ? {
              id: sub.id,
              tier: sub.tier,
              status: sub.status,
              interval: sub.interval,
              current_period_end: sub.current_period_end,
            }
          : null,
        apiKey: key
          ? {
              id: key.id,
              prefix: key.key_prefix,
              name: key.name,
              max_devices: key.max_devices ?? 2,
              devices_count: devices.length,
              devices: devices,
              allowed_tools: key.allowed_tools,
              is_active: key.is_active,
              last_used_at: key.last_used_at,
            }
          : null,
      };
    });

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error("Admin Users GET Error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch users" }, { status: 500 });
  }
}

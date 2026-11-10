import { NextResponse } from "next/server";
import { verifyAdmin } from "@/utils/supabase/admin-auth";

export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  const { supabase } = auth;

  try {
    // 1. จำนวนผู้ใช้ทั้งหมด
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // 2. จำนวนสมาชิกที่ Active Subscriptions
    const { count: activeSubs } = await supabase
      .from("user_subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .gt("current_period_end", new Date().toISOString());

    // 3. จำนวนสมาชิก Premium / Buffet
    const { count: premiumSubs } = await supabase
      .from("user_subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .eq("tier", "premium")
      .gt("current_period_end", new Date().toISOString());

    // 4. จำนวนคอร์สทั้งหมด
    const { count: totalCourses } = await supabase
      .from("courses")
      .select("*", { count: "exact", head: true });

    // 5. จำนวน API Keys & รวมจำนวนเครื่องที่ผูกไว้
    const { data: keys } = await supabase
      .from("user_api_keys")
      .select("devices");

    let totalConnectedDevices = 0;
    (keys || []).forEach((k: any) => {
      if (Array.isArray(k.devices)) {
        totalConnectedDevices += k.devices.length;
      }
    });

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        activeSubscriptions: activeSubs || 0,
        premiumSubscriptions: premiumSubs || 0,
        totalCourses: totalCourses || 0,
        totalConnectedDevices: totalConnectedDevices,
        activeApiKeys: (keys || []).length,
      },
    });
  } catch (err: any) {
    console.error("Admin Stats GET Error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch stats" }, { status: 500 });
  }
}

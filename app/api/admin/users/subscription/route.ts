import { NextResponse } from "next/server";
import { verifyAdmin } from "@/utils/supabase/admin-auth";

export async function POST(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  const { supabase } = auth;

  try {
    const body = await request.json();
    const { targetUserId, tier, status, interval, monthsValid } = body;

    if (!targetUserId || !tier) {
      return NextResponse.json({ error: "ต้องระบุ targetUserId และ tier" }, { status: 400 });
    }

    // กำหนดวันหมดอายุ
    let periodEnd = new Date();
    if (interval === "lifetime" || monthsValid === "lifetime" || monthsValid >= 999) {
      periodEnd = new Date("2099-12-31T23:59:59Z");
    } else {
      const months = parseInt(monthsValid || "1", 10);
      periodEnd.setMonth(periodEnd.getMonth() + months);
    }

    // ตรวจสอบว่ามี subscription เดิมอยู่แล้วหรือไม่
    const { data: existingSub } = await supabase
      .from("user_subscriptions")
      .select("id")
      .eq("user_id", targetUserId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (existingSub) {
      const { error: updateErr } = await supabase
        .from("user_subscriptions")
        .update({
          tier: tier,
          status: status || "active",
          interval: interval || "monthly",
          current_period_end: periodEnd.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSub.id);

      if (updateErr) throw updateErr;
    } else {
      const { error: insertErr } = await supabase
        .from("user_subscriptions")
        .insert({
          user_id: targetUserId,
          tier: tier,
          status: status || "active",
          interval: interval || "monthly",
          current_period_end: periodEnd.toISOString(),
        });

      if (insertErr) throw insertErr;
    }

    return NextResponse.json({
      success: true,
      message: `อัปเดตสิทธิ์แพ็กเกจ ${tier} สำเร็จ (หมดอายุ: ${periodEnd.toLocaleDateString("th-TH")})`,
    });
  } catch (err: any) {
    console.error("Admin Update Subscription Error:", err);
    return NextResponse.json({ error: err.message || "Failed to update subscription" }, { status: 500 });
  }
}

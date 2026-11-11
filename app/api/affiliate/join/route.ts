import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนสมัครเป็นพาร์ทเนอร์" }, { status: 401 });
  }

  try {
    // 1. ตรวจสอบว่าเคยสมัครแล้วหรือไม่
    const { data: existingAffiliate } = await supabase
      .from("affiliates")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingAffiliate) {
      return NextResponse.json({ 
        success: true, 
        message: "คุณมีบัญชีพาร์ทเนอร์อยู่แล้ว", 
        affiliate: existingAffiliate 
      });
    }

    // 2. เช็กสถานะ Subscription เพื่อกำหนด Tier และ % ค่าคอม
    const { data: sub } = await supabase
      .from("user_subscriptions")
      .select("tier, interval, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    let tier = "standard";
    let commissionRate = 0.10; // 10%

    if (sub) {
      if (sub.interval === "lifetime") {
        tier = "lifetime";
        commissionRate = 0.25; // 25% สูงสุด
      } else if (sub.tier === "premium") {
        tier = "premium";
        commissionRate = 0.15; // 15%
      }
    }

    // 3. สุ่มรหัสแนะนำ 6 ตัวอักษรที่ไม่ซ้ำ
    const randomCode = "AIF" + Math.random().toString(36).substring(2, 6).toUpperCase();

    // 4. บันทึกเข้าตาราง affiliates
    const { data: newAffiliate, error } = await supabase
      .from("affiliates")
      .insert({
        user_id: user.id,
        affiliate_code: randomCode,
        custom_coupon_code: randomCode,
        tier,
        commission_rate: commissionRate,
        total_earned: 0,
        current_balance: 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "ยินดีต้อนรับสู่โปรแกรมพาร์ทเนอร์ aifullfill!",
      affiliate: newAffiliate,
    });
  } catch (err: any) {
    console.error("Affiliate Join Error:", err);
    return NextResponse.json({ error: err.message || "Failed to join affiliate program" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. ดึงข้อมูลพาร์ทเนอร์
    const { data: affiliate, error } = await supabase
      .from("affiliates")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!affiliate) {
      return NextResponse.json({ isAffiliate: false });
    }

    // 2. ดึงจำนวนคนที่สมัครผ่านลิงก์
    const { count: referralCount } = await supabase
      .from("affiliate_referrals")
      .select("*", { count: "exact", head: true })
      .eq("affiliate_id", affiliate.id);

    // 3. ดึงประวัติค่าคอมมิชชั่นล่าสุด
    const { data: commissions } = await supabase
      .from("affiliate_commissions")
      .select("*")
      .eq("affiliate_id", affiliate.id)
      .order("created_at", { ascending: false })
      .limit(20);

    // 4. ดึงประวัติการถอนเงิน
    const { data: payouts } = await supabase
      .from("affiliate_payouts")
      .select("*")
      .eq("affiliate_id", affiliate.id)
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      isAffiliate: true,
      affiliate,
      referralCount: referralCount || 0,
      commissions: commissions || [],
      payouts: payouts || [],
    });
  } catch (err: any) {
    console.error("Affiliate Me GET Error:", err);
    return NextResponse.json({ error: err.message || "Failed to load affiliate data" }, { status: 500 });
  }
}

// POST: อัปเดตข้อมูลบัญชีธนาคาร หรือ คูปองส่วนลด
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { bank_name, bank_account_number, bank_account_name, custom_coupon_code } = body;

    const updatePayload: any = {
      bank_name: bank_name || null,
      bank_account_number: bank_account_number || null,
      bank_account_name: bank_account_name || null,
      updated_at: new Date().toISOString(),
    };

    if (custom_coupon_code) {
      const cleanCode = custom_coupon_code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (cleanCode.length >= 3) {
        updatePayload.custom_coupon_code = cleanCode;
      }
    }

    const { data: updated, error } = await supabase
      .from("affiliates")
      .update(updatePayload)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "อัปเดตข้อมูลบัญชีพาร์ทเนอร์สำเร็จ",
      affiliate: updated,
    });
  } catch (err: any) {
    console.error("Affiliate Me Update Error:", err);
    return NextResponse.json({ error: err.message || "Failed to update affiliate" }, { status: 500 });
  }
}

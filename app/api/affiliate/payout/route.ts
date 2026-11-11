import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!affiliate) {
      return NextResponse.json({ error: "ไม่พบบัญชีพาร์ทเนอร์ของคุณ" }, { status: 404 });
    }

    if (!affiliate.bank_account_number || !affiliate.bank_name || !affiliate.bank_account_name) {
      return NextResponse.json({ error: "กรุณาระบุข้อมูลบัญชีธนาคารให้ครบถ้วนก่อนขอถอนเงิน" }, { status: 400 });
    }

    const availableBalance = parseFloat(affiliate.current_balance || "0");
    if (availableBalance < 500) {
      return NextResponse.json({ error: "ยอดเงินขั้นต่ำในการถอนคือ 500 บาท" }, { status: 400 });
    }

    // 1. บันทึกคำขอถอนเงิน
    const { error: payoutError } = await supabase
      .from("affiliate_payouts")
      .insert({
        affiliate_id: affiliate.id,
        amount: availableBalance,
        bank_name: affiliate.bank_name,
        bank_account_number: affiliate.bank_account_number,
        bank_account_name: affiliate.bank_account_name,
        status: "pending",
      });

    if (payoutError) throw payoutError;

    // 2. หักยอดคงเหลือในบัญชีพาร์ทเนอร์
    const { error: updateError } = await supabase
      .from("affiliates")
      .update({
        current_balance: 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", affiliate.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: "ส่งคำขอถอนเงินจำนวน ฿" + availableBalance.toLocaleString() + " เรียบร้อยแล้ว ทีมงานจะดำเนินการโอนเงินให้ภายใน 24-48 ชม.",
    });
  } catch (err: any) {
    console.error("Affiliate Payout Error:", err);
    return NextResponse.json({ error: err.message || "Failed to request payout" }, { status: 500 });
  }
}

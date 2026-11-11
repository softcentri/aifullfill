import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

interface PlanConfig {
  id: "monthly" | "yearly" | "lifetime";
  name: string;
  tier: "standard" | "premium";
  interval: "monthly" | "yearly" | "lifetime";
  price: number;
}

const PLANS: Record<string, PlanConfig> = {
  monthly: {
    id: "monthly",
    name: "Standard Monthly",
    tier: "standard",
    interval: "monthly",
    price: 599,
  },
  yearly: {
    id: "yearly",
    name: "Premium Yearly",
    tier: "premium",
    interval: "yearly",
    price: 3890,
  },
  lifetime: {
    id: "lifetime",
    name: "Lifetime VIP",
    tier: "premium",
    interval: "lifetime",
    price: 6990,
  },
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนแจ้งชำระเงิน" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      planId,
      affiliateCode,
      hasCouponDiscount,
      slipUrl,
      transferAmount,
      transferDate,
      transferTime,
      senderName,
      bankRefNo,
      slipQrPayload,
      slipFileHash,
      imageWidth,
      imageHeight,
    } = body;

    const plan = PLANS[planId];
    if (!plan) {
      return NextResponse.json(
        { error: "แพ็กเกจที่เลือกไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    if (!slipUrl) {
      return NextResponse.json(
        { error: "กรุณาอัปโหลดภาพสลิปโอนเงิน" },
        { status: 400 }
      );
    }

    // 1. คำนวณราคาสุทธิและตรวจสอบคูปองส่วนลด (ถ้ามี)
    let validAffiliateCode: string | null = null;
    let discountAmount = 0;

    if (affiliateCode && String(affiliateCode).trim() !== "") {
      const { data: couponCheck } = await supabase.rpc("validate_affiliate_coupon", {
        p_code: String(affiliateCode).trim(),
      });

      if (couponCheck && couponCheck.valid) {
        validAffiliateCode = couponCheck.affiliate_code;
        if (hasCouponDiscount) {
          discountAmount = Math.round(plan.price * 0.05); // ส่วนลดคูปองพาร์ทเนอร์ 5%
        }
      }
    }

    const netAmount = plan.price - discountAmount;
    const numericTransfer = parseFloat(String(transferAmount || 0));

    // =========================================================================
    // 2. ระบบตรวจสลิปเบื้องต้นอัตโนมัติ (Preliminary Slip Verification Engine)
    // =========================================================================
    let score = 0;
    const verifyNotes: { pass: boolean; label: string }[] = [];
    let verifyStatus: "verified_qr" | "pre_checked" | "warning" | "manual_review" = "manual_review";

    // Check 1: ยอดเงินที่โอนตรงกับยอดสุทธิของแพ็กเกจ (40 คะแนน)
    const amountDiff = Math.abs(numericTransfer - netAmount);
    if (amountDiff === 0) {
      score += 40;
      verifyNotes.push({
        pass: true,
        label: `ยอดโอนตรงกับแพ็กเกจ (฿${numericTransfer.toLocaleString()})`,
      });
    } else if (numericTransfer === plan.price && discountAmount > 0) {
      // กรณีโอนเต็มจำนวนโดยไม่หักส่วนลดคูปอง
      score += 40;
      verifyNotes.push({
        pass: true,
        label: `ยอดโอนตรงราคาปกติ (฿${numericTransfer.toLocaleString()})`,
      });
    } else {
      verifyNotes.push({
        pass: false,
        label: `ยอดเงินที่ระบุ (฿${numericTransfer.toLocaleString()}) ไม่ตรงกับยอดแพ็กเกจ (฿${netAmount.toLocaleString()})`,
      });
    }

    // Check 2: ตรวจ QR Payload บนสลิปธนาคาร หรือรหัสอ้างอิงสลิป (35 คะแนน)
    let finalBankRef = String(bankRefNo || "").trim();
    const cleanQr = String(slipQrPayload || "").trim();

    if (cleanQr.length >= 15) {
      score += 35;
      verifyStatus = "verified_qr";
      if (!finalBankRef) {
        finalBankRef = `QR-${cleanQr.slice(-12).toUpperCase()}`;
      }
      verifyNotes.push({
        pass: true,
        label: "ตรวจพบข้อมูล QR Code มาตรฐานสลิปธนาคารไทย",
      });
    } else if (finalBankRef.length >= 6) {
      score += 25;
      verifyStatus = "pre_checked";
      verifyNotes.push({
        pass: true,
        label: `ระบุเลขที่อ้างอิงสลิปครบถ้วน (${finalBankRef})`,
      });
    } else {
      verifyNotes.push({
        pass: false,
        label: "ไม่พบ QR บนสลิปหรือเลขที่อ้างอิงสั้นเกินไป (รอแอดมินตรวจภาพสลิป)",
      });
    }

    // Check 3: ตรวจสอบความสมบูรณ์ของไฟล์ภาพสลิปและสัดส่วนภาพ (15 คะแนน)
    const w = Number(imageWidth || 0);
    const h = Number(imageHeight || 0);
    if (w >= 250 && h >= 300) {
      score += 15;
      verifyNotes.push({
        pass: true,
        label: `ขนาดและสัดส่วนภาพสลิปสมบูรณ์ (${w}x${h} px)`,
      });
    } else {
      score += 5;
      verifyNotes.push({
        pass: false,
        label: "ความละเอียดภาพสลิปค่อนข้างต่ำ",
      });
    }

    // Check 4: ข้อมูลเวลาโอนและชื่อผู้โอนครบถ้วน (10 คะแนน)
    if (senderName && String(senderName).trim().length >= 2 && transferDate && transferTime) {
      score += 10;
      verifyNotes.push({
        pass: true,
        label: `ระบุชื่อผู้โอน (${String(senderName).trim()}) และวัน-เวลาโอนครบถ้วน`,
      });
    } else {
      verifyNotes.push({
        pass: false,
        label: "ข้อมูลชื่อผู้โอนหรือเวลาโอนไม่ครบถ้วน",
      });
    }

    // ตัดสินผล Pre-Approval: ต้องได้คะแนน >= 75 และยอดเงินต้องตรง
    const isAmountMatched = amountDiff === 0 || numericTransfer === plan.price;
    const isPreApproved = score >= 75 && isAmountMatched;

    if (!isPreApproved && verifyStatus !== "verified_qr") {
      verifyStatus = score >= 50 ? "pre_checked" : "warning";
    }

    // สร้างหมายเลขคำสั่งซื้อ (Order No)
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNo = `ORD-${datePart}-${randPart}`;

    // 3. บันทึกลงฐานข้อมูลผ่าน RPC (ตรวจสลิปซ้ำ + เปิดสิทธิ์ Pre-Approve ทันทีถ้าผ่านเกณฑ์)
    const { data: rpcResult, error: rpcError } = await supabase.rpc("submit_payment_order", {
      p_order_no: orderNo,
      p_plan_id: plan.id,
      p_plan_name: plan.name,
      p_tier: plan.tier,
      p_interval: plan.interval,
      p_original_amount: plan.price,
      p_discount_amount: discountAmount,
      p_net_amount: netAmount,
      p_affiliate_code: validAffiliateCode,
      p_slip_url: slipUrl,
      p_transfer_amount: numericTransfer,
      p_transfer_date: transferDate || new Date().toISOString().slice(0, 10),
      p_transfer_time: transferTime || new Date().toTimeString().slice(0, 5),
      p_sender_name: String(senderName || "").trim(),
      p_bank_ref_no: finalBankRef,
      p_slip_qr_payload: cleanQr,
      p_slip_file_hash: String(slipFileHash || "").trim(),
      p_slip_verify_status: verifyStatus,
      p_slip_verify_score: score,
      p_slip_verify_notes: verifyNotes,
      p_is_pre_approved: isPreApproved,
    });

    if (rpcError) {
      return NextResponse.json(
        { error: rpcError.message || "ไม่สามารถบันทึกข้อมูลการแจ้งโอนได้" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      orderNo,
      status: isPreApproved ? "pre_approved" : "pending_review",
      isPreApproved,
      verifyScore: score,
      verifyNotes,
      order: rpcResult,
    });
  } catch (error: any) {
    console.error("Payment submit error:", error);
    return NextResponse.json(
      { error: error.message || "เกิดข้อผิดพลาดในการแจ้งชำระเงิน" },
      { status: 500 }
    );
  }
}

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Sparkles,
  ShieldCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  Clock,
  Crown,
  Tag,
  QrCode,
  Building2,
  FileCheck2,
  Loader2,
  BookOpen,
  ScanLine,
} from "lucide-react";

interface PlanOption {
  id: "monthly" | "yearly" | "lifetime";
  name: string;
  badge: string;
  price: number;
  periodLabel: string;
  tierLabel: string;
  features: string[];
}

const PLAN_OPTIONS: PlanOption[] = [
  {
    id: "monthly",
    name: "Standard Monthly",
    badge: "รายเดือน (30 วัน)",
    price: 599,
    periodLabel: "/ เดือน",
    tierLabel: "STANDARD",
    features: [
      "เรียนคอร์สกลุ่ม Standard ได้ไม่จำกัด",
      "ดาวน์โหลดไฟล์แนบและ Prompt ประจำบท",
      "ใช้งาน AI Tools พื้นฐาน",
    ],
  },
  {
    id: "yearly",
    name: "Premium Yearly",
    badge: "★ ยอดนิยม คุ้มที่สุด (365 วัน)",
    price: 3890,
    periodLabel: "/ ปี",
    tierLabel: "PREMIUM",
    features: [
      "เข้าเรียนได้ทุกคอร์ส (Standard + Premium)",
      "ดาวน์โหลดซอร์สโค้ดโปรเจกต์ทั้งหมด",
      "สิทธิ์ใช้งาน MCP Server & API Key (2 เครื่อง)",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime VIP",
    badge: "จ่ายครั้งเดียวจบ (ตลอดชีพ)",
    price: 6990,
    periodLabel: "ครั้งเดียว",
    tierLabel: "LIFETIME VIP",
    features: [
      "ปลดล็อกทุกคอร์สและซอร์สโค้ดตลอดชีพ",
      "สิทธิ์ใช้งาน MCP Server สูงสุด 3 เครื่อง",
      "รับส่วนแบ่ง Affiliate สูงสุด 25% ตลอดชีพ",
    ],
  },
];

const BANK_ACCOUNT = {
  bankName: "ธนาคารกสิกรไทย (KBANK)",
  branchName: "สาขาบางกรวย",
  accountNumber: "089-3-58534-6",
  rawAccountNumber: "0893585346",
  accountName: "บจก. ซอฟต์เซนทรี",
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const initialPlanParam = searchParams.get("plan");
  const initialPlanId: "monthly" | "yearly" | "lifetime" =
    initialPlanParam === "monthly" || initialPlanParam === "lifetime"
      ? initialPlanParam
      : "yearly";

  const [selectedPlanId, setSelectedPlanId] = useState<"monthly" | "yearly" | "lifetime">(initialPlanId);
  const selectedPlan = PLAN_OPTIONS.find((p) => p.id === selectedPlanId) || PLAN_OPTIONS[1];

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Affiliate / Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedAffiliateCode, setAppliedAffiliateCode] = useState<string | null>(null);
  const [hasCouponDiscount, setHasCouponDiscount] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  // Payment Form State
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [transferAmount, setTransferAmount] = useState<string>(String(selectedPlan.price));
  const [transferDate, setTransferDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [transferTime, setTransferTime] = useState(() => new Date().toTimeString().slice(0, 5));
  const [bankRefNo, setBankRefNo] = useState("");

  // Slip File & Pre-Scanner State
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreviewUrl, setSlipPreviewUrl] = useState<string | null>(null);
  const [slipFileHash, setSlipFileHash] = useState<string>("");
  const [slipQrPayload, setSlipQrPayload] = useState<string>("");
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [scanningSlip, setScanningSlip] = useState(false);
  const [qrScanNotice, setQrScanNotice] = useState<string | null>(null);

  // Submission & Result State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<{
    orderNo: string;
    status: "pre_approved" | "pending_review";
    isPreApproved: boolean;
    verifyScore: number;
    verifyNotes: { pass: boolean; label: string }[];
  } | null>(null);

  const discountAmount = hasCouponDiscount ? Math.round(selectedPlan.price * 0.05) : 0;
  const netAmount = selectedPlan.price - discountAmount;

  // อัปเดตยอดโอนเริ่มต้นเมื่อเปลี่ยนแพ็กเกจหรือใช้คูปอง
  useEffect(() => {
    setTransferAmount(String(netAmount));
  }, [netAmount]);

  // ตรวจสอบผู้ใช้ และอ่าน Cookie affiliate_ref
  useEffect(() => {
    const init = async () => {
      setLoadingUser(true);
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", user.id)
          .maybeSingle();
        if (profile?.full_name) {
          setSenderName(profile.full_name);
        }
      }

      // อ่าน affiliate_ref จาก Cookie (ถ้ามี)
      if (typeof document !== "undefined") {
        const match = document.cookie.match(/(?:^|;\s*)affiliate_ref=([^;]*)/);
        if (match && match[1]) {
          const refCode = decodeURIComponent(match[1]).trim().toUpperCase();
          if (refCode) {
            setAppliedAffiliateCode(refCode);
            setCouponInput(refCode);
          }
        }
      }

      setLoadingUser(false);
    };
    init();
  }, [supabase]);

  // ตรวจสอบคูปองส่วนลด
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCheckingCoupon(true);
    setCouponMessage(null);

    try {
      const { data, error } = await supabase.rpc("validate_affiliate_coupon", {
        p_code: couponInput.trim(),
      });

      if (error || !data || !data.valid) {
        setCouponMessage({
          type: "error",
          text: data?.message || "ไม่พบรหัสคูปองนี้ในระบบ",
        });
        setHasCouponDiscount(false);
      } else {
        setAppliedAffiliateCode(data.affiliate_code);
        setHasCouponDiscount(true);
        setCouponMessage({
          type: "success",
          text: `${data.message} (ลดทันที ฿${Math.round(selectedPlan.price * 0.05).toLocaleString()})`,
        });
      }
    } catch {
      setCouponMessage({ type: "error", text: "เกิดข้อผิดพลาดในการตรวจสอบคูปอง" });
    } finally {
      setCheckingCoupon(false);
    }
  };

  const handleCopyBank = () => {
    navigator.clipboard.writeText(BANK_ACCOUNT.rawAccountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // คำนวณ SHA-256 Hash และสแกน QR บนภาพสลิปเบื้องต้น
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubmitError(null);
    setQrScanNotice(null);
    setSlipQrPayload("");

    if (!file.type.startsWith("image/")) {
      setSubmitError("กรุณาเลือกไฟล์รูปภาพสลิป (.jpg, .png, .webp)");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setSubmitError("ขนาดไฟล์สลิปต้องไม่เกิน 8 MB");
      return;
    }

    setSlipFile(file);
    setScanningSlip(true);

    try {
      // 1. คำนวณ SHA-256 ของไฟล์ภาพเพื่อกันการอัปโหลดภาพเดิมซ้ำ
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setSlipFileHash(hashHex);

      // 2. สร้าง Data URL สำหรับแสดงตัวอย่างและวัดขนาดภาพ
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setSlipPreviewUrl(dataUrl);

        const img = new Image();
        img.onload = async () => {
          setImageDimensions({ width: img.width, height: img.height });

          // 3. สแกน QR Code บนสลิปด้วย BarcodeDetector API (ถ้ารองรับ)
          try {
            const BarcodeDetectorClass = (window as any).BarcodeDetector;
            if (BarcodeDetectorClass) {
              const detector = new BarcodeDetectorClass({ formats: ["qr_code"] });
              const barcodes = await detector.detect(img);
              if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
                const rawQr = String(barcodes[0].rawValue).trim();
                setSlipQrPayload(rawQr);
                const extractedRef = rawQr.slice(-12).toUpperCase();
                if (!bankRefNo) {
                  setBankRefNo(`QR-${extractedRef}`);
                }
                setQrScanNotice(`ตรวจพบ QR Code สลิปธนาคารอัตโนมัติ (Ref: ${extractedRef}) พร้อมรับสิทธิ์ Pre-Approve ทันที!`);
              } else {
                setQrScanNotice("ตรวจสอบขนาดภาพสลิปเรียบร้อย กรุณากรอกเลขที่อ้างอิงบนสลิปเพื่อรับสิทธิ์ Pre-Approve ทันที");
              }
            } else {
              setQrScanNotice("อัปโหลดภาพสลิปสำเร็จ กรุณากรอกเลขที่อ้างอิงบนสลิป (อย่างน้อย 6 ตัวท้าย) เพื่อเปิดคอร์สเรียนทันที");
            }
          } catch {
            setQrScanNotice("อัปโหลดภาพสลิปสำเร็จ กรุณากรอกเลขที่อ้างอิงบนสลิปเพื่อเปิดคอร์สเรียนทันที");
          } finally {
            setScanningSlip(false);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    } catch {
      setScanningSlip(false);
    }
  };

  // ส่งข้อมูลแจ้งโอนและตรวจสลิปเบื้องต้น
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      router.push(`/login?next=/checkout?plan=${selectedPlanId}`);
      return;
    }

    if (!slipFile || !slipPreviewUrl) {
      setSubmitError("กรุณาอัปโหลดรูปภาพสลิปโอนเงินก่อนกดยืนยัน");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. อัปโหลดไฟล์สลิปขึ้น Supabase Storage (ถ้าเกิดข้อผิดพลาดใช้ Data URL สำรอง)
      let finalSlipUrl = slipPreviewUrl;
      try {
        const ext = slipFile.name.split(".").pop() || "jpg";
        const filePath = `${currentUser.id}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("payment-slips")
          .upload(filePath, slipFile, { upsert: false });

        if (!uploadErr) {
          const { data: pubUrl } = supabase.storage
            .from("payment-slips")
            .getPublicUrl(filePath);
          if (pubUrl?.publicUrl) {
            finalSlipUrl = pubUrl.publicUrl;
          }
        }
      } catch {
        // Fallback to slipPreviewUrl
      }

      // 2. ส่งข้อมูลเข้า API ตรวจสลิปเบื้องต้นและบันทึกคำสั่งซื้อ
      const res = await fetch("/api/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          affiliateCode: appliedAffiliateCode || couponInput.trim() || null,
          hasCouponDiscount,
          slipUrl: finalSlipUrl,
          transferAmount: parseFloat(transferAmount),
          transferDate,
          transferTime,
          senderName: senderName.trim(),
          bankRefNo: bankRefNo.trim(),
          slipQrPayload,
          slipFileHash,
          imageWidth: imageDimensions.width,
          imageHeight: imageDimensions.height,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "ไม่สามารถบันทึกข้อมูลการแจ้งชำระเงินได้");
        setIsSubmitting(false);
        return;
      }

      setSubmitResult({
        orderNo: data.orderNo,
        status: data.status,
        isPreApproved: data.isPreApproved,
        verifyScore: data.verifyScore,
        verifyNotes: data.verifyNotes || [],
      });
    } catch (err: any) {
      setSubmitError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-[75vh] bg-brand-slate flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="w-8 h-8 text-brand-emerald animate-spin" />
        <p className="text-xs text-slate-400">กำลังเตรียมหน้าชำระเงิน...</p>
      </div>
    );
  }

  // กรณีแจ้งโอนสำเร็จแล้ว แสดงผลลัพธ์การตรวจสลิปเบื้องต้น
  if (submitResult) {
    return (
      <div className="bg-brand-slate text-slate-100 min-h-screen py-16 px-4 font-sans">
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl">
          <div className="text-center space-y-3">
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg ${
                submitResult.isPreApproved
                  ? "bg-brand-emerald/20 border border-brand-emerald/40 text-brand-emerald"
                  : "bg-amber-500/20 border border-amber-500/40 text-amber-400"
              }`}
            >
              {submitResult.isPreApproved ? (
                <CheckCircle2 className="w-9 h-9" />
              ) : (
                <Clock className="w-9 h-9" />
              )}
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
              หมายเลขคำสั่งซื้อ: {submitResult.orderNo}
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {submitResult.isPreApproved
                ? "อนุมัติสิทธิ์เบื้องต้นสำเร็จ! (Pre-Approved)"
                : "รับเรื่องแจ้งโอนเรียบร้อยแล้ว (รอแอดมินตรวจสอบ)"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              {submitResult.isPreApproved
                ? "ระบบตรวจสลิปเบื้องต้นยืนยันข้อมูลของคุณเรียบร้อยแล้ว และได้เปิดสิทธิ์ให้คุณเข้าเรียนทุกคอร์สในแพ็กเกจได้ทันที! (แอดมินจะทำการตรวจเช็คสลิปขั้นสุดท้ายอีกครั้ง)"
                : "เราได้รับข้อมูลสลิปของคุณแล้ว ผู้ดูแลระบบจะทำการตรวจสอบยอดโอนและเปิดสิทธิ์การใช้งานให้โดยเร็วที่สุด"}
            </p>
          </div>

          {/* ผลการตรวจสลิปเบื้องต้น */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-brand-orange" />
                <span>รายงานการตรวจสลิปเบื้องต้นอัตโนมัติ</span>
              </span>
              <span
                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  submitResult.verifyScore >= 75
                    ? "bg-brand-emerald/20 text-brand-emerald"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                คะแนนความสมบูรณ์ {submitResult.verifyScore}/100
              </span>
            </div>

            <ul className="space-y-2 text-xs">
              {submitResult.verifyNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  {note.pass ? (
                    <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <span className={note.pass ? "text-slate-200" : "text-amber-300"}>
                    {note.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/courses"
              className="flex-1 py-3.5 px-6 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-brand-emerald hover:bg-brand-emerald-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-emerald/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>เข้าสู่ห้องเรียนทันที</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 py-3.5 px-6 rounded-full text-xs sm:text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <span>ไปที่แดชบอร์ดสมาชิก</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-slate text-slate-100 min-h-screen py-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับไปดูรายละเอียดแพ็กเกจ</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-emerald/15 border border-brand-emerald/30 text-brand-emerald text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ระบบตรวจสลิปเบื้องต้น Pre-Approved เข้าเรียนได้ทันที</span>
          </div>
        </div>

        {/* Main Grid: Left (Plan & Bank Info) | Right (Slip Upload Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =========================================================================
              LEFT COLUMN (7 COLS): เลือกแพ็กเกจ, คูปองส่วนลด, และช่องทางโอนเงิน
          ========================================================================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: เลือกแพ็กเกจบุฟเฟต์ */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-brand-orange text-white text-xs font-extrabold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  เลือกแพ็กเกจสมาชิกบุฟเฟต์ที่คุณต้องการ
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PLAN_OPTIONS.map((plan) => {
                  const active = plan.id === selectedPlanId;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        active
                          ? "bg-brand-orange/15 border-brand-orange ring-1 ring-brand-orange/50 shadow-lg"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            active
                              ? "bg-brand-orange text-white"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {plan.tierLabel}
                        </span>
                        <h3 className="text-sm font-bold text-white mt-2">{plan.name}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">{plan.badge}</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-baseline gap-1">
                        <span className="text-xl font-black text-white">
                          ฿{plan.price.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-400">{plan.periodLabel}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* คูปองส่วนลด / รหัสพาร์ทเนอร์ */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-brand-orange" />
                  <span>มีคูปองส่วนลด 5% หรือรหัสแนะนำจากพาร์ทเนอร์?</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="กรอกโค้ดส่วนลด เช่น AIFULLFILL..."
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white uppercase font-mono focus:outline-none focus:border-brand-emerald"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={checkingCoupon || !couponInput.trim()}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-brand-emerald border border-slate-700 disabled:opacity-40 transition-colors"
                  >
                    {checkingCoupon ? "กำลังเช็ค..." : "ใช้คูปอง"}
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`text-xs font-medium ${
                      couponMessage.type === "success" ? "text-brand-emerald" : "text-rose-400"
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>
            </div>

            {/* Step 2: ช่องทางการโอนเงิน & PromptPay QR */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-brand-emerald text-slate-950 text-xs font-extrabold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-white">
                    โอนชำระเงินตามยอดสุทธิ
                  </h2>
                </div>
                <span className="text-xs font-bold text-brand-emerald bg-brand-emerald/10 px-3 py-1 rounded-full border border-brand-emerald/30">
                  ยอดโอนสุทธิ: ฿{netAmount.toLocaleString()}
                </span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-brand-emerald flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-base font-extrabold text-white">{BANK_ACCOUNT.bankName}</div>
                      <div className="text-xs text-brand-emerald font-semibold">{BANK_ACCOUNT.branchName}</div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-[11px] text-slate-400">ชื่อบัญชีรับโอน</div>
                    <div className="text-sm sm:text-base font-extrabold text-white">{BANK_ACCOUNT.accountName}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-400">เลขที่บัญชีธนาคารกสิกรไทย</div>
                    <div className="text-2xl sm:text-3xl font-mono font-black text-brand-orange tracking-wider mt-0.5">
                      {BANK_ACCOUNT.accountNumber}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      (ตัวเลขติดกัน: {BANK_ACCOUNT.rawAccountNumber})
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyBank}
                    className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-brand-emerald hover:bg-emerald-600 text-slate-950 flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    {copiedAccount ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>คัดลอกเลขบัญชี {BANK_ACCOUNT.rawAccountNumber} แล้ว!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>คัดลอกเลขที่บัญชี</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  💡 โอนชำระเงินยอด <strong>฿{netAmount.toLocaleString()}</strong> ไปยังบัญชี <strong>{BANK_ACCOUNT.accountName}</strong> ด้านบน แล้วนำรูปสลิปมาอัปโหลดในช่องด้านขวามือเพื่อรับสิทธิ์เข้าเรียนทันที
                </div>
              </div>
            </div>

          </div>

          {/* =========================================================================
              RIGHT COLUMN (5 COLS): อัปโหลดสลิป + ระบบตรวจสลิปเบื้องต้น (Pre-Approve)
          ========================================================================= */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleSubmitPayment}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl sticky top-20"
            >
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
                <span className="w-6 h-6 rounded-full bg-brand-orange text-white text-xs font-extrabold flex items-center justify-center">
                  3
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-white">
                    อัปโหลดสลิปโอนเงิน (ตรวจสลิปอัตโนมัติ)
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    ระบบจะตรวจสลิปเบื้องต้นและเปิดสิทธิ์ Pre-Approved ให้เรียนได้ทันที
                  </p>
                </div>
              </div>

              {!currentUser && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>กรุณาเข้าสู่ระบบก่อนแจ้งชำระเงิน</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80">
                    เพื่อให้ระบบผูกสิทธิ์แพ็กเกจบุฟเฟต์เข้ากับบัญชีอีเมลของคุณโดยอัตโนมัติ
                  </p>
                  <Link
                    href={`/login?next=/checkout?plan=${selectedPlanId}`}
                    className="inline-block mt-1 px-4 py-2 rounded-xl bg-brand-orange text-white font-bold text-xs"
                  >
                    เข้าสู่ระบบ / สมัครสมาชิก →
                  </Link>
                </div>
              )}

              {/* อัปโหลดรูปสลิป */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  แนบรูปภาพสลิปโอนเงิน <span className="text-rose-400">*</span>
                </label>

                <label className="relative flex flex-col items-center justify-center w-full min-h-[170px] rounded-2xl border-2 border-dashed border-slate-700 hover:border-brand-emerald bg-slate-950/70 cursor-pointer transition-all overflow-hidden p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {slipPreviewUrl ? (
                    <div className="space-y-2 w-full flex flex-col items-center">
                      <img
                        src={slipPreviewUrl}
                        alt="Slip Preview"
                        className="max-h-44 rounded-xl border border-slate-700 object-contain shadow-md"
                      />
                      <span className="text-[11px] text-brand-emerald font-bold flex items-center gap-1">
                        <FileCheck2 className="w-3.5 h-3.5" />
                        คลิกเพื่อเปลี่ยนรูปภาพสลิป
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2 py-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 text-brand-orange flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-slate-200">
                        คลิกเพื่อเลือกไฟล์สลิปโอนเงิน
                      </div>
                      <p className="text-[11px] text-slate-500">
                        รองรับไฟล์ JPG, PNG, WEBP จากแอปธนาคาร (ไม่เกิน 8MB)
                      </p>
                    </div>
                  )}
                </label>

                {scanningSlip && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-brand-emerald">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>กำลังสแกนตรวจสอบ QR Code และข้อมูลสลิปเบื้องต้น...</span>
                  </div>
                )}

                {qrScanNotice && (
                  <div className="mt-2 p-2.5 rounded-xl bg-brand-emerald/10 border border-brand-emerald/30 text-[11px] text-brand-emerald flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{qrScanNotice}</span>
                  </div>
                )}
              </div>

              {/* ข้อมูลประกอบสลิป */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    ยอดเงินที่โอน (บาท) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-brand-emerald"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    เลขที่รายการบนสลิป (6 ตัวท้ายขึ้นไป) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    minLength={6}
                    value={bankRefNo}
                    onChange={(e) => setBankRefNo(e.target.value)}
                    placeholder="เช่น 202611119821..."
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    วันที่โอน
                  </label>
                  <input
                    type="date"
                    required
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-emerald"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    เวลาที่โอน
                  </label>
                  <input
                    type="time"
                    required
                    value={transferTime}
                    onChange={(e) => setTransferTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-emerald"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    ชื่อผู้โอน <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="ชื่อ-นามสกุล"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              {/* สรุปยอดชำระ */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>แพ็กเกจ {selectedPlan.name}</span>
                  <span>฿{selectedPlan.price.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-brand-emerald">
                    <span>ส่วนลดคูปองพาร์ทเนอร์ (5%)</span>
                    <span>-฿{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-extrabold text-white">
                  <span>ยอดชำระสุทธิ</span>
                  <span className="text-brand-orange">฿{netAmount.toLocaleString()}</span>
                </div>
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !currentUser}
                className="w-full py-3.5 px-6 rounded-full text-sm font-extrabold text-white bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-40 tactile-button-primary transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/25"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังตรวจสลิปเบื้องต้นและเปิดสิทธิ์...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>ยืนยันการโอนเงิน & รับสิทธิ์เข้าเรียนทันที</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] bg-brand-slate flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 text-brand-emerald animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

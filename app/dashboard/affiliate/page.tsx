"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Wallet,
  DollarSign,
  Users,
  Copy,
  Check,
  Share2,
  Tag,
  ArrowUpRight,
  ShieldCheck,
  Building,
  CreditCard,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Edit,
  X,
  Crown
} from "lucide-react";

interface AffiliateData {
  id: string;
  user_id: string;
  affiliate_code: string;
  custom_coupon_code: string;
  tier: "standard" | "premium" | "lifetime";
  commission_rate: number;
  total_earned: number;
  current_balance: number;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  is_active: boolean;
  created_at: string;
}

interface CommissionItem {
  id: string;
  order_id: string;
  plan_name: string;
  order_amount: number;
  commission_rate: number;
  commission_amount: number;
  status: "pending" | "approved" | "paid";
  created_at: string;
}

interface PayoutItem {
  id: string;
  amount: number;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  status: "pending" | "approved" | "rejected";
  slip_url?: string;
  created_at: string;
  processed_at?: string;
}

export default function AffiliateDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [commissions, setCommissions] = useState<CommissionItem[]>([]);
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);

  // Modals & Forms
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankFormData, setBankFormData] = useState({
    bank_name: "กสิกรไทย (KBANK)",
    bank_account_number: "",
    bank_account_name: "",
  });
  const [isSavingBank, setIsSavingBank] = useState(false);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [isSavingCoupon, setIsSavingCoupon] = useState(false);

  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const fetchAffiliateData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/affiliate/me");
      if (res.ok) {
        const data = await res.json();
        if (!data.isAffiliate) {
          router.push("/aff");
          return;
        }
        setAffiliate(data.affiliate);
        setReferralCount(data.referralCount || 0);
        setCommissions(data.commissions || []);
        setPayouts(data.payouts || []);

        setBankFormData({
          bank_name: data.affiliate.bank_name || "กสิกรไทย (KBANK)",
          bank_account_number: data.affiliate.bank_account_number || "",
          bank_account_name: data.affiliate.bank_account_name || "",
        });
        setCouponCodeInput(data.affiliate.custom_coupon_code || data.affiliate.affiliate_code);
      } else {
        router.push("/aff");
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "ไม่สามารถโหลดข้อมูลพาร์ทเนอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  const handleCopyLink = () => {
    if (!affiliate) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://aifullfill.com";
    const refLink = `${origin}/?ref=${affiliate.affiliate_code}`;
    navigator.clipboard.writeText(refLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCoupon = () => {
    if (!affiliate) return;
    const code = affiliate.custom_coupon_code || affiliate.affiliate_code;
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBank(true);
    try {
      const res = await fetch("/api/affiliate/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bankFormData),
      });
      const data = await res.json();
      if (res.ok) {
        showAlert("success", "บันทึกข้อมูลบัญชีธนาคารเรียบร้อยแล้ว");
        setIsBankModalOpen(false);
        fetchAffiliateData();
      } else {
        showAlert("error", data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      showAlert("error", "ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setIsSavingBank(false);
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCoupon(true);
    try {
      const res = await fetch("/api/affiliate/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_coupon_code: couponCodeInput }),
      });
      const data = await res.json();
      if (res.ok) {
        showAlert("success", "อัปเดตรหัสคูปองส่วนตัวเรียบร้อยแล้ว");
        setIsCouponModalOpen(false);
        fetchAffiliateData();
      } else {
        showAlert("error", data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      showAlert("error", "ไม่สามารถบันทึกคูปองได้");
    } finally {
      setIsSavingCoupon(false);
    }
  };

  const handleRequestPayout = async () => {
    setIsRequestingPayout(true);
    try {
      const res = await fetch("/api/affiliate/payout", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        showAlert("success", data.message);
        setIsPayoutModalOpen(false);
        fetchAffiliateData();
      } else {
        showAlert("error", data.error || "ไม่สามารถขอถอนเงินได้");
      }
    } catch (err) {
      showAlert("error", "เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsRequestingPayout(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-slate flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-emerald" />
        <p className="text-xs text-slate-400">กำลังเชื่อมต่อแดชบอร์ดพาร์ทเนอร์...</p>
      </div>
    );
  }

  if (!affiliate) return null;

  const originUrl = typeof window !== "undefined" ? window.location.origin : "https://aifullfill.com";
  const refLink = `${originUrl}/?ref=${affiliate.affiliate_code}`;
  const couponCode = affiliate.custom_coupon_code || affiliate.affiliate_code;
  const commissionPercentage = Math.round(affiliate.commission_rate * 100);
  const canWithdraw = parseFloat(affiliate.current_balance as any) >= 500;

  return (
    <div className="min-h-screen bg-brand-slate text-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับไปแดชบอร์ดหลัก</span>
          </Link>

          <Link
            href="/aff"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs text-brand-emerald hover:underline"
          >
            <span>ดูหน้าข้อเสนอพาร์ทเนอร์</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Alert Notification */}
        {alert && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between text-xs font-semibold border animate-in fade-in ${
              alert.type === "success"
                ? "bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30"
                : "bg-rose-500/10 text-rose-400 border-rose-500/30"
            }`}
          >
            <div className="flex items-center gap-2">
              {alert.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{alert.message}</span>
            </div>
            <button onClick={() => setAlert(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header Ribbon */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 tactile-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                REF: {affiliate.affiliate_code}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs font-extrabold px-3 py-0.5 rounded-full ${
                affiliate.tier === "lifetime"
                  ? "bg-brand-orange/15 text-brand-orange border border-brand-orange/30"
                  : affiliate.tier === "premium"
                  ? "bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30"
                  : "bg-slate-800 text-slate-300 border border-slate-700"
              }`}>
                <Crown className="w-3.5 h-3.5" />
                ระดับ {affiliate.tier.toUpperCase()} ({commissionPercentage}% คอมมิชชั่น)
              </span>
              <span className="text-xs text-brand-emerald flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" /> พาร์ทเนอร์เปิดใช้งานอยู่
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              แดชบอร์ดพาร์ทเนอร์ (Affiliate Center)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-normal">
              แชร์ลิงก์หรือคูปองส่วนลดของคุณ ทุกยอดชำระและยอดต่ออายุของลูกค้าจะคำนวณเป็นค่าคอมมิชชั่นเข้ากระเป๋าคุณอัตโนมัติ
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsPayoutModalOpen(true)}
              disabled={!canWithdraw}
              className={`w-full md:w-auto px-6 py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                canWithdraw
                  ? "bg-brand-orange hover:bg-brand-orange-hover text-white tactile-button-primary"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>ขอถอนเงิน (ขั้นต่ำ ฿500)</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Available Balance */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 tactile-card space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>ยอดเงินที่ถอนได้</span>
              <Wallet className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white pt-1">
              ฿{parseFloat(affiliate.current_balance as any).toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              {canWithdraw ? "✓ พร้อมกดถอนได้ทันที" : "สะสมครบ ฿500 จึงจะกดถอนได้"}
            </div>
          </div>

          {/* Card 2: Total Earned */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 tactile-card space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>รายได้สะสมทั้งหมด</span>
              <DollarSign className="w-4 h-4 text-brand-emerald" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-brand-emerald pt-1">
              ฿{parseFloat(affiliate.total_earned as any).toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              รวมทุกรอบบิลที่เคยได้รับ
            </div>
          </div>

          {/* Card 3: Total Referrals */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 tactile-card space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>คนที่สมัครผ่านลิงก์</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white pt-1">
              {referralCount} คน
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              ผูกกับบัญชีคุณถาวรตลอดชีพ
            </div>
          </div>

          {/* Card 4: Commission Rate */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 tactile-card space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>อัตราค่าคอมมิชชั่น</span>
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-brand-orange pt-1">
              {commissionPercentage}%
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              อิงตามระดับ {affiliate.tier.toUpperCase()}
            </div>
          </div>

        </div>

        {/* 2 Tools Section: Referral Link & Coupon Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Tool 1: Referral Link */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 tactile-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <span className="font-bold text-sm text-white">ลิงก์แนะนำของคุณ (Referral Link)</span>
              </div>
              <span className="text-[10px] text-brand-emerald font-semibold bg-brand-emerald/10 border border-brand-emerald/20 px-2 py-0.5 rounded-full">
                จำคุกกี้ 30 วัน
              </span>
            </div>

            <p className="text-xs text-slate-400">
              นำลิงก์นี้ไปแปะในโพสต์ วิดีโอ หรือแชท คนที่คลิกจะถูกบันทึกรหัสคุณไว้ เมื่อสมัครสมาชิกจะผูกกับคุณถาวร
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-slate-200 truncate">{refLink}</span>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-emerald text-slate-950 hover:bg-emerald-600 transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>คัดลอกแล้ว</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy ลิงก์</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://line.me/R/msg/text/?${encodeURIComponent("เรียน AI และ Vibe Coding สร้างระบบจริงได้ที่ aifullfill: " + refLink)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold text-center transition-colors"
              >
                แชร์ลง LINE
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(refLink)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold text-center transition-colors"
              >
                แชร์ลง Facebook
              </a>
            </div>
          </div>

          {/* Tool 2: Coupon Code */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 tactile-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brand-orange/10 text-brand-orange flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span className="font-bold text-sm text-white">คูปองส่วนลดของคุณ (Coupon Code)</span>
              </div>
              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="text-[11px] text-brand-orange hover:underline flex items-center gap-1"
              >
                <Edit className="w-3 h-3" /> ตั้งชื่อคูปองเอง
              </button>
            </div>

            <p className="text-xs text-slate-400">
              ผู้เรียนสามารถพิมพ์โค้ดนี้ในช่องคูปองตอนชำระเงินเพื่อรับส่วนลด และคุณจะได้รับค่าคอมมิชชั่นตามสัดส่วน
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <span className="text-sm font-mono font-extrabold text-brand-orange tracking-wider">{couponCode}</span>
              <button
                onClick={handleCopyCoupon}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                {copiedCoupon ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-brand-emerald" />
                    <span className="text-brand-emerald">คัดลอกแล้ว</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy โค้ด</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400">
              💡 คูปองนี้ใช้ได้แม้กับผู้ที่มีบัญชีอยู่แล้วที่ไม่ได้กดผ่านลิงก์
            </div>
          </div>

        </div>

        {/* Bank Account Settings Box */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 tactile-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Building className="w-5 h-5 text-brand-emerald" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">บัญชีธนาคารสำหรับรับเงินโอน</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {affiliate.bank_account_number ? (
                  <span>
                    {affiliate.bank_name} • เลขที่บัญชี: <strong className="text-white font-mono">{affiliate.bank_account_number}</strong> ({affiliate.bank_account_name})
                  </span>
                ) : (
                  <span className="text-amber-400">⚠️ ยังไม่ได้ระบุบัญชีธนาคาร (กรุณาระบุเพื่อรับเงินค่าคอมมิชชั่น)</span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBankModalOpen(true)}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {affiliate.bank_account_number ? "แก้ไขบัญชีธนาคาร" : "เพิ่มบัญชีธนาคาร"}
          </button>
        </div>

        {/* Commissions History Table */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden tactile-card">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-brand-emerald" />
              <span>ประวัติค่าคอมมิชชั่นล่าสุด ({commissions.length})</span>
            </h3>
          </div>

          {commissions.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <DollarSign className="w-10 h-10 mx-auto mb-2 text-slate-600 stroke-[1.5]" />
              <p className="text-sm font-semibold text-slate-400">ยังไม่มีรายการค่าคอมมิชชั่น</p>
              <p className="text-xs text-slate-600 mt-1">เมื่อมีคนสมัครผ่านลิงก์หรือใช้คูปองของคุณ รายการจะปรากฏที่นี่ทันที</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60 uppercase">
                    <th className="py-3 px-6">วันที่</th>
                    <th className="py-3 px-6">แพ็กเกจ</th>
                    <th className="py-3 px-6 text-right">ยอดซื้อ</th>
                    <th className="py-3 px-6 text-center">% คอม</th>
                    <th className="py-3 px-6 text-right">เงินที่คุณได้รับ</th>
                    <th className="py-3 px-6 text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {commissions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-6 font-mono text-slate-400">
                        {new Date(item.created_at).toLocaleDateString("th-TH")}
                      </td>
                      <td className="py-3.5 px-6 font-medium text-white">{item.plan_name}</td>
                      <td className="py-3.5 px-6 text-right font-mono text-slate-300">
                        ฿{parseFloat(item.order_amount as any).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono text-brand-orange font-bold">
                        {Math.round(item.commission_rate * 100)}%
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono font-bold text-brand-emerald text-sm">
                        +฿{parseFloat(item.commission_amount as any).toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                          {item.status === "approved" ? "อนุมัติแล้ว" : item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* =========================================================================
          BANK ACCOUNT MODAL
      ========================================================================= */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl tactile-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-brand-emerald" />
                <span>ระบุบัญชีธนาคารสำหรับรับเงิน</span>
              </h3>
              <button onClick={() => setIsBankModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBank} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ธนาคาร</label>
                <select
                  value={bankFormData.bank_name}
                  onChange={(e) => setBankFormData({ ...bankFormData, bank_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-emerald"
                >
                  <option value="กสิกรไทย (KBANK)">กสิกรไทย (KBANK)</option>
                  <option value="ไทยพาณิชย์ (SCB)">ไทยพาณิชย์ (SCB)</option>
                  <option value="กรุงเทพ (BBL)">กรุงเทพ (BBL)</option>
                  <option value="กรุงไทย (KTB)">กรุงไทย (KTB)</option>
                  <option value="กรุงศรีอยุธยา (BAY)">กรุงศรีอยุธยา (BAY)</option>
                  <option value="ทหารไทยธนชาต (TTB)">ทหารไทยธนชาต (TTB)</option>
                  <option value="ออมสิน (GSB)">ออมสิน (GSB)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">เลขที่บัญชี</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น 123-4-56789-0"
                  value={bankFormData.bank_account_number}
                  onChange={(e) => setBankFormData({ ...bankFormData, bank_account_number: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ชื่อบัญชี (ตรงกับชื่อจริง)</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น นาย สมชาย ใจดี"
                  value={bankFormData.bank_account_name}
                  onChange={(e) => setBankFormData({ ...bankFormData, bank_account_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-slate-300 hover:bg-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSavingBank}
                  className="px-6 py-2 rounded-full text-xs font-bold text-white bg-brand-emerald hover:bg-emerald-600 tactile-button-primary disabled:opacity-50"
                >
                  {isSavingBank ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          CUSTOM COUPON CODE MODAL
      ========================================================================= */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl tactile-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand-orange" />
                <span>ตั้งชื่อคูปองส่วนลดเอง</span>
              </h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  รหัสคูปองส่วนตัว (ตัวอักษรภาษาอังกฤษและตัวเลข)
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น AUN2026 หรือ COACHAI"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono font-bold text-brand-orange tracking-widest focus:outline-none focus:border-brand-emerald"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">ความยาว 3-12 ตัวอักษร</span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-slate-300 hover:bg-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSavingCoupon}
                  className="px-6 py-2 rounded-full text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover tactile-button-primary disabled:opacity-50"
                >
                  {isSavingCoupon ? "กำลังบันทึก..." : "บันทึกคูปอง"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          PAYOUT REQUEST CONFIRMATION MODAL
      ========================================================================= */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl tactile-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-brand-orange" />
                <span>ยืนยันการขอถอนเงินค่าคอมมิชชั่น</span>
              </h3>
              <button onClick={() => setIsPayoutModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">ยอดเงินที่จะถอน:</span>
                <span className="text-base font-extrabold text-brand-orange font-mono">
                  ฿{parseFloat(affiliate.current_balance as any).toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">โอนเข้าธนาคาร:</span>
                <span className="font-semibold text-white">{affiliate.bank_name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">เลขที่บัญชี:</span>
                <span className="font-mono text-white">{affiliate.bank_account_number || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ชื่อบัญชี:</span>
                <span className="font-semibold text-white">{affiliate.bank_account_name || "-"}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              เมื่อกดยืนยัน ยอดเงินจะถูกตัดและส่งคำขอไปยังฝ่ายบัญชี ทีมงานจะดำเนินการโอนเงินและส่งสลิปหลักฐานภายใน 24-48 ชั่วโมง
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPayoutModalOpen(false)}
                className="px-4 py-2 rounded-full text-xs text-slate-300 hover:bg-slate-800"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleRequestPayout}
                disabled={isRequestingPayout}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover tactile-button-primary disabled:opacity-50"
              >
                {isRequestingPayout ? "กำลังส่งคำขอ..." : "ยืนยันการถอนเงิน"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

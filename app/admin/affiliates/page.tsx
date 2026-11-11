"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building,
  CreditCard,
  Check,
  X,
  Loader2,
  Percent,
} from "lucide-react";

interface Affiliate {
  id: string;
  user_id: string;
  code: string;
  custom_coupon: string | null;
  commission_rate: number;
  total_earnings: number;
  unpaid_balance: number;
  paid_balance: number;
  bank_name: string | null;
  bank_account_no: string | null;
  bank_account_name: string | null;
  is_active: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

interface Payout {
  id: string;
  affiliate_id: string;
  amount: number;
  status: "pending" | "approved" | "paid" | "rejected";
  bank_info: {
    bank: string;
    account_no: string;
    account_name: string;
  };
  notes: string | null;
  slip_url: string | null;
  created_at: string;
  processed_at: string | null;
  affiliates?: {
    code: string;
    profiles?: {
      full_name: string;
      email: string;
    };
  };
}

export default function AdminAffiliatesPage() {
  const [activeTab, setActiveTab] = useState<"payouts" | "affiliates" | "commissions">("payouts");
  const [isLoading, setIsLoading] = useState(true);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal / Action state
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [actionSlipUrl, setActionSlipUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/affiliates");
      if (res.ok) {
        const data = await res.json();
        setAffiliates(data.affiliates || []);
        setPayouts(data.payouts || []);
        setCommissions(data.commissions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdatePayoutStatus = async (payoutId: string, status: "paid" | "rejected") => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/affiliates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payout_id: payoutId,
          status,
          notes: actionNotes,
          slip_url: actionSlipUrl,
        }),
      });
      if (res.ok) {
        setSelectedPayout(null);
        setActionNotes("");
        setActionSlipUrl("");
        await fetchData();
      } else {
        const error = await res.json();
        alert("เกิดข้อผิดพลาด: " + (error.error || "ไม่สามารถอัปเดตได้"));
      }
    } catch (err: any) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats
  const totalPaid = payouts
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPending = payouts
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const totalAffiliates = affiliates.length;

  const filteredPayouts = payouts.filter((p) => {
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const partnerName = p.affiliates?.profiles?.full_name?.toLowerCase() || "";
    const partnerEmail = p.affiliates?.profiles?.email?.toLowerCase() || "";
    const code = p.affiliates?.code?.toLowerCase() || "";
    return matchesStatus && (partnerName.includes(query) || partnerEmail.includes(query) || code.includes(query));
  });

  const filteredAffiliates = affiliates.filter((a) => {
    const query = searchQuery.toLowerCase();
    const name = a.profiles?.full_name?.toLowerCase() || "";
    const email = a.profiles?.email?.toLowerCase() || "";
    const code = a.code?.toLowerCase() || "";
    return name.includes(query) || email.includes(query) || code.includes(query);
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 mb-3">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Affiliate Revenue & Payout Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            จัดการระบบพาร์ทเนอร์ & เบิกถอนคอมมิชชัน
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            ตรวจสอบยอดขายจาก Referral, อนุมัติการโอนเงินเข้าบัญชีพาร์ทเนอร์ และจัดการอัตราส่วนแบ่ง
          </p>
        </div>

        {/* Quick Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab("payouts")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "payouts"
                ? "bg-brand-emerald text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            คำขอเบิกเงิน ({payouts.filter((p) => p.status === "pending").length})
          </button>
          <button
            onClick={() => setActiveTab("affiliates")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "affiliates"
                ? "bg-brand-emerald text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            รายชื่อพาร์ทเนอร์ ({affiliates.length})
          </button>
          <button
            onClick={() => setActiveTab("commissions")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "commissions"
                ? "bg-brand-emerald text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ประวัติคอมมิชชัน ({commissions.length})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>รอโอนเงิน (Pending)</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">
            ฿{totalPending.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {payouts.filter((p) => p.status === "pending").length} รายการรอการดำเนินการ
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>จ่ายคอมมิชชันแล้ว (Total Paid)</span>
            <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-brand-emerald mt-2">
            ฿{totalPaid.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {payouts.filter((p) => p.status === "paid").length} รายการโอนเรียบร้อย
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>จำนวนพาร์ทเนอร์ทั้งหมด</span>
            <Users className="w-4 h-4 text-brand-orange" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {totalAffiliates} <span className="text-base font-normal text-slate-400">คน</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            พาร์ทเนอร์ที่เปิดใช้งานรหัสแนะนำ
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, อีเมล หรือรหัส Referral..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 text-sm text-white placeholder-slate-400 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-emerald"
          />
        </div>

        {activeTab === "payouts" && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-400">สถานะ:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 text-xs font-semibold text-white px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-emerald"
            >
              <option value="all">ทั้งหมด</option>
              <option value="pending">รอโอน (Pending)</option>
              <option value="paid">จ่ายแล้ว (Paid)</option>
              <option value="rejected">ปฏิเสธ (Rejected)</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: PAYOUTS */}
      {activeTab === "payouts" && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">วันที่ขอเบิก</th>
                  <th className="py-3 px-4">พาร์ทเนอร์</th>
                  <th className="py-3 px-4">ยอดเงิน</th>
                  <th className="py-3 px-4">บัญชีปลายทาง</th>
                  <th className="py-3 px-4">สถานะ</th>
                  <th className="py-3 px-4 text-right">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-emerald" />
                      กำลังโหลดข้อมูลคำขอเบิกเงิน...
                    </td>
                  </tr>
                ) : filteredPayouts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      ไม่พบคำขอเบิกเงินในรายการ
                    </td>
                  </tr>
                ) : (
                  filteredPayouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {new Date(payout.created_at).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white text-xs sm:text-sm">
                          {payout.affiliates?.profiles?.full_name || "ไม่ระบุชื่อ"}
                        </div>
                        <div className="text-xs text-slate-400">
                          {payout.affiliates?.profiles?.email} (รหัส: {payout.affiliates?.code})
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-base text-brand-emerald">
                          ฿{Number(payout.amount).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-semibold text-slate-200">
                          {payout.bank_info?.bank || "-"}
                        </div>
                        <div className="text-slate-400">
                          {payout.bank_info?.account_no} ({payout.bank_info?.account_name})
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {payout.status === "pending" && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            รอโอนเงิน
                          </span>
                        )}
                        {payout.status === "paid" && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                            โอนแล้ว
                          </span>
                        )}
                        {payout.status === "rejected" && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            ปฏิเสธ
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {payout.status === "pending" ? (
                          <button
                            onClick={() => {
                              setSelectedPayout(payout);
                              setActionNotes("");
                              setActionSlipUrl("");
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-emerald text-slate-950 hover:bg-brand-emerald/90 transition-all"
                          >
                            จัดการการโอน
                          </button>
                        ) : (
                          <span className="text-xs text-slate-500">
                            {payout.processed_at
                              ? new Date(payout.processed_at).toLocaleDateString("th-TH", {
                                  day: "numeric",
                                  month: "short",
                                })
                              : "-"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AFFILIATES */}
      {activeTab === "affiliates" && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">พาร์ทเนอร์</th>
                  <th className="py-3 px-4">รหัส / คูปอง</th>
                  <th className="py-3 px-4">ส่วนแบ่ง (%)</th>
                  <th className="py-3 px-4">รายได้สะสม</th>
                  <th className="py-3 px-4">ยอดค้างจ่าย</th>
                  <th className="py-3 px-4">บัญชีรับเงิน</th>
                  <th className="py-3 px-4">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      กำลังโหลดข้อมูลพาร์ทเนอร์...
                    </td>
                  </tr>
                ) : filteredAffiliates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      ไม่พบข้อมูลพาร์ทเนอร์
                    </td>
                  </tr>
                ) : (
                  filteredAffiliates.map((aff) => (
                    <tr key={aff.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white text-xs sm:text-sm">
                          {aff.profiles?.full_name || "ไม่ระบุชื่อ"}
                        </div>
                        <div className="text-xs text-slate-400">{aff.profiles?.email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono">
                        <div className="text-brand-orange font-bold">?ref={aff.code}</div>
                        {aff.custom_coupon && (
                          <div className="text-slate-400">คูปอง: {aff.custom_coupon}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white text-xs">
                        {Math.round(aff.commission_rate * 100)}%
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200 text-xs">
                        ฿{Number(aff.total_earnings || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-brand-emerald text-xs">
                        ฿{Number(aff.unpaid_balance || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {aff.bank_name ? (
                          <>
                            <div className="text-slate-200 font-medium">{aff.bank_name}</div>
                            <div>{aff.bank_account_no}</div>
                          </>
                        ) : (
                          <span className="text-slate-600">ยังไม่ระบุ</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {aff.is_active ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Suspended
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: COMMISSIONS LOG */}
      {activeTab === "commissions" && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">วันที่ทำรายการ</th>
                  <th className="py-3 px-4">รหัสพาร์ทเนอร์</th>
                  <th className="py-3 px-4">ยอดซื้อของลูกค้า</th>
                  <th className="py-3 px-4">อัตราส่วนแบ่ง</th>
                  <th className="py-3 px-4">ค่าคอมมิชชัน</th>
                  <th className="py-3 px-4">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      กำลังโหลดประวัติคอมมิชชัน...
                    </td>
                  </tr>
                ) : commissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      ยังไม่มีรายการสร้างคอมมิชชัน
                    </td>
                  </tr>
                ) : (
                  commissions.map((comm) => (
                    <tr key={comm.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {new Date(comm.created_at).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-brand-orange">
                        {comm.affiliates?.code || "-"}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-300">
                        ฿{Number(comm.order_amount).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-bold text-white">
                        {Math.round(comm.rate * 100)}%
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-sm text-brand-emerald">
                        +฿{Number(comm.commission_amount).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                          {comm.status || "approved"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAYOUT ACTION MODAL */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-emerald/20 text-brand-emerald flex items-center justify-center font-bold">
                  ฿
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">ยืนยันการโอนเงินพาร์ทเนอร์</h3>
                  <p className="text-xs text-slate-400">
                    รหัสคำขอ: {selectedPayout.id.slice(0, 8)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPayout(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Transfer Details Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">ยอดเงินที่ต้องโอน:</span>
                <span className="text-xl font-extrabold text-brand-emerald">
                  ฿{Number(selectedPayout.amount).toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">ธนาคาร:</span>
                  <span className="font-semibold text-white">
                    {selectedPayout.bank_info?.bank}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">เลขที่บัญชี:</span>
                  <span className="font-mono font-bold text-brand-orange">
                    {selectedPayout.bank_info?.account_no}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ชื่อบัญชี:</span>
                  <span className="font-semibold text-white">
                    {selectedPayout.bank_info?.account_name}
                  </span>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  หมายเหตุ / เลขอ้างอิงสลิปโอนเงิน (Optional)
                </label>
                <input
                  type="text"
                  placeholder="เช่น เลขอ้างอิง K-Plus 20261111XXXX"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ลิงก์ไฟล์สลิป (URL) (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={actionSlipUrl}
                  onChange={(e) => setActionSlipUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={isSubmitting}
                onClick={() => handleUpdatePayoutStatus(selectedPayout.id, "rejected")}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                ปฏิเสธคำขอ (คืนยอด)
              </button>
              <button
                disabled={isSubmitting}
                onClick={() => handleUpdatePayoutStatus(selectedPayout.id, "paid")}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-brand-emerald hover:bg-brand-emerald/90 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-brand-emerald/20"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                ยืนยันการโอนเงินเรียบร้อย
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

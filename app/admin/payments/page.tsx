"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Eye,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  DollarSign,
  Tag,
  X,
  Loader2,
  ScanLine,
  ExternalLink,
} from "lucide-react";

interface VerifyNote {
  pass: boolean;
  label: string;
}

interface PaymentOrder {
  id: string;
  order_no: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  tier: "standard" | "premium";
  interval: "monthly" | "yearly" | "lifetime";
  original_amount: number;
  discount_amount: number;
  net_amount: number;
  affiliate_code: string | null;
  slip_url: string;
  transfer_amount: number;
  transfer_date: string;
  transfer_time: string;
  sender_name: string;
  bank_ref_no: string | null;
  slip_verify_status: string;
  slip_verify_score: number;
  slip_verify_notes: VerifyNote[];
  status: "pre_approved" | "pending_review" | "approved" | "rejected";
  admin_note: string | null;
  created_at: string;
  reviewed_at: string | null;
  profiles?: {
    full_name: string | null;
    email: string;
  };
}

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<PaymentOrder | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payments");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Error fetching payment orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReview = async (orderId: string, action: "approved" | "rejected", note?: string) => {
    const confirmText =
      action === "approved"
        ? "ยืนยันการอนุมัติสลิปนี้? (ระบบจะยืนยันสิทธิ์สมาชิกถาวรและคิดค่าคอมมิชชั่นให้ Affiliate ทันที)"
        : "ยืนยันการปฏิเสธสลิปนี้? (หากผู้เรียนได้รับสิทธิ์ Pre-Approved ระบบจะระงับสิทธิ์เข้าคอร์สทันที)";

    if (!confirm(confirmText)) return;

    setProcessingId(orderId);
    setAlertMsg(null);

    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          action,
          adminNote: note ?? adminNoteInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAlertMsg({ type: "error", text: data.error || "เกิดข้อผิดพลาดในการอัปเดตสถานะ" });
      } else {
        setAlertMsg({ type: "success", text: data.message });
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, status: action, admin_note: note ?? adminNoteInput, reviewed_at: new Date().toISOString() }
              : o
          )
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      }
    } catch (err: any) {
      setAlertMsg({ type: "error", text: err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ" });
    } finally {
      setProcessingId(null);
    }
  };

  const preApprovedCount = orders.filter((o) => o.status === "pre_approved").length;
  const pendingReviewCount = orders.filter((o) => o.status === "pending_review").length;
  const approvedOrders = orders.filter((o) => o.status === "approved");
  const totalApprovedRevenue = approvedOrders.reduce((acc, o) => acc + Number(o.net_amount || 0), 0);

  const filteredOrders = orders.filter((o) => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      o.order_no.toLowerCase().includes(q) ||
      (o.sender_name || "").toLowerCase().includes(q) ||
      (o.bank_ref_no || "").toLowerCase().includes(q) ||
      (o.profiles?.email || "").toLowerCase().includes(q) ||
      (o.profiles?.full_name || "").toLowerCase().includes(q);

    return matchStatus && matchQuery;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30">
              Slip Verification & Approval
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ตรวจสลิปโอนเงิน & อนุมัติคำสั่งซื้อ
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            ตรวจสอบสลิปที่ผ่านการ Pre-Approve เบื้องต้น ยืนยันสิทธิ์เข้าเรียนถาวร หรือระงับสิทธิ์กรณีสลิปไม่ถูกต้อง
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-brand-orange" : ""}`} />
          <span>รีเฟรชรายการ</span>
        </button>
      </div>

      {/* Alert Banner */}
      {alertMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
            alertMsg.type === "success"
              ? "bg-brand-emerald/15 border-brand-emerald/30 text-brand-emerald"
              : "bg-rose-500/15 border-rose-500/30 text-rose-400"
          }`}
        >
          <span>{alertMsg.text}</span>
          <button onClick={() => setAlertMsg(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>Pre-Approved (รอตรวจซ้ำ)</span>
            <ScanLine className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-white">{preApprovedCount}</div>
          <p className="text-[11px] text-slate-400">เปิดสิทธิ์ชั่วคราวแล้ว รอแอดมินกดยืนยัน</p>
        </div>

        <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-rose-400">
            <span>Pending Review (รออนุมัติ)</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-white">{pendingReviewCount}</div>
          <p className="text-[11px] text-slate-400">ยอดไม่ตรง/ไม่พบรหัสอ้างอิง รอแอดมินตรวจ</p>
        </div>

        <div className="bg-slate-900 border border-brand-emerald/30 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-brand-emerald">
            <span>อนุมัติสมบูรณ์แล้ว</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-white">{approvedOrders.length}</div>
          <p className="text-[11px] text-slate-400">รายการที่ตรวจสอบผ่านสมบูรณ์</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>ยอดรับชำระที่อนุมัติแล้ว</span>
            <DollarSign className="w-4 h-4 text-brand-orange" />
          </div>
          <div className="text-3xl font-black text-brand-orange">
            ฿{totalApprovedRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">คำนวณเฉพาะออเดอร์ที่ Approved</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: `ทั้งหมด (${orders.length})` },
            { id: "pre_approved", label: `⚡ Pre-Approved รอตรวจซ้ำ (${preApprovedCount})` },
            { id: "pending_review", label: `⏳ รอตรวจสอบ (${pendingReviewCount})` },
            { id: "approved", label: `✓ อนุมัติแล้ว (${approvedOrders.length})` },
            { id: "rejected", label: "✕ ปฏิเสธ" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterStatus === tab.id
                  ? "bg-brand-orange text-white shadow"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาเลขคำสั่งซื้อ, อีเมล, ชื่อผู้โอน..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-orange"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center space-y-2">
            <Loader2 className="w-8 h-8 text-brand-orange animate-spin mx-auto" />
            <p className="text-xs text-slate-400">กำลังโหลดรายการแจ้งโอนเงิน...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <FileCheck2 className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">ไม่พบรายการแจ้งโอนเงินในหมวดนี้</p>
            <p className="text-xs text-slate-500">รายการโอนเงินใหม่จากหน้า /checkout จะแสดงที่นี่ทันที</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase bg-slate-950/50">
                  <th className="py-3.5 px-4">คำสั่งซื้อ / เวลา</th>
                  <th className="py-3.5 px-4">ผู้เรียน / ผู้โอน</th>
                  <th className="py-3.5 px-4">แพ็กเกจ & ยอดโอน</th>
                  <th className="py-3.5 px-4">ผลตรวจสลิปเบื้องต้น</th>
                  <th className="py-3.5 px-4">สถานะ</th>
                  <th className="py-3.5 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-mono font-bold text-white">{order.order_no}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        โอน: {order.transfer_date} {order.transfer_time}
                      </div>
                      {order.bank_ref_no && (
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                          Ref: {order.bank_ref_no}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-white">
                        {order.profiles?.full_name || order.sender_name || "ไม่ระบุชื่อ"}
                      </div>
                      <div className="text-[11px] text-slate-400">{order.profiles?.email}</div>
                      <div className="text-[10px] text-brand-emerald mt-0.5">
                        ผู้โอนบนสลิป: {order.sender_name || "-"}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-white">{order.plan_name}</div>
                      <div className="text-sm font-black text-brand-orange mt-0.5">
                        ฿{Number(order.transfer_amount).toLocaleString()}
                        {Number(order.transfer_amount) !== Number(order.net_amount) && (
                          <span className="ml-1.5 text-[10px] text-rose-400 font-normal">
                            (ยอดสุทธิ ฿{Number(order.net_amount).toLocaleString()})
                          </span>
                        )}
                      </div>
                      {order.affiliate_code && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 text-[10px] font-mono mt-1">
                          <Tag className="w-2.5 h-2.5" /> Ref: {order.affiliate_code}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            order.slip_verify_score >= 75
                              ? "bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          คะแนน {order.slip_verify_score}/100
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {Array.isArray(order.slip_verify_notes) && order.slip_verify_notes[0]?.label}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {order.status === "pre_approved" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ⚡ Pre-Approved (เข้าเรียนได้แล้ว)
                        </span>
                      )}
                      {order.status === "pending_review" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          ⏳ รอแอดมินอนุมัติ
                        </span>
                      )}
                      {order.status === "approved" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30">
                          ✓ อนุมัติสมบูรณ์
                        </span>
                      )}
                      {order.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          ✕ ปฏิเสธแล้ว
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setAdminNoteInput(order.admin_note || "");
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1 border border-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5 text-brand-orange" />
                          <span>ดูสลิป</span>
                        </button>

                        {(order.status === "pre_approved" || order.status === "pending_review") && (
                          <>
                            <button
                              onClick={() => handleReview(order.id, "approved")}
                              disabled={processingId === order.id}
                              className="px-2.5 py-1.5 rounded-lg bg-brand-emerald hover:bg-emerald-600 text-slate-950 font-bold disabled:opacity-50"
                              title="ยืนยันสลิปถูกต้อง"
                            >
                              ✓ อนุมัติ
                            </button>
                            <button
                              onClick={() => handleReview(order.id, "rejected")}
                              disabled={processingId === order.id}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold disabled:opacity-50"
                              title="ปฏิเสธสลิปและระงับสิทธิ์"
                            >
                              ✕ ปฏิเสธ
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal ตรวจสอบรูปสลิป & รายละเอียดผลตรวจเบื้องต้น */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono text-brand-orange font-bold">
                  {selectedOrder.order_no}
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  ตรวจสอบหลักฐานการโอนเงิน ({selectedOrder.plan_name})
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* รูปภาพสลิป */}
              <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
                <img
                  src={selectedOrder.slip_url}
                  alt="Payment Slip"
                  className="max-h-[420px] w-auto object-contain rounded-xl"
                />
                <a
                  href={selectedOrder.slip_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 text-xs text-brand-emerald hover:underline flex items-center gap-1"
                >
                  <span>เปิดดูภาพขนาดเต็มในแท็บใหม่</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* รายละเอียดและปุ่มอนุมัติ */}
              <div className="md:col-span-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">บัญชีผู้เรียน:</span>
                      <span className="font-bold text-white">{selectedOrder.profiles?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ชื่อผู้โอนที่แจ้ง:</span>
                      <span className="font-bold text-white">{selectedOrder.sender_name || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">วัน-เวลาที่โอน:</span>
                      <span className="font-bold text-white">
                        {selectedOrder.transfer_date} เวลา {selectedOrder.transfer_time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">เลขที่อ้างอิงสลิป:</span>
                      <span className="font-mono font-bold text-brand-emerald">
                        {selectedOrder.bank_ref_no || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-800 text-sm">
                      <span className="text-slate-300 font-bold">ยอดโอน / ยอดสุทธิ:</span>
                      <span className="font-black text-brand-orange">
                        ฿{Number(selectedOrder.transfer_amount).toLocaleString()} / ฿
                        {Number(selectedOrder.net_amount).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Checklist ผลตรวจสลิปเบื้องต้น */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">
                        ผลตรวจสลิปเบื้องต้นอัตโนมัติ
                      </span>
                      <span className="text-xs font-extrabold text-brand-emerald">
                        {selectedOrder.slip_verify_score}/100 คะแนน
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      {Array.isArray(selectedOrder.slip_verify_notes) &&
                        selectedOrder.slip_verify_notes.map((n, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            {n.pass ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            )}
                            <span className={n.pass ? "text-slate-300" : "text-amber-300"}>
                              {n.label}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">
                      หมายเหตุจากแอดมิน (ถ้ามี)
                    </label>
                    <input
                      type="text"
                      value={adminNoteInput}
                      onChange={(e) => setAdminNoteInput(e.target.value)}
                      placeholder="เช่น ตรวจสอบยอดเงินเข้าบัญชีเรียบร้อย..."
                      className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => handleReview(selectedOrder.id, "approved", adminNoteInput)}
                    disabled={processingId === selectedOrder.id}
                    className="flex-1 py-3 px-4 rounded-xl text-xs font-extrabold bg-brand-emerald hover:bg-emerald-600 text-slate-950 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ยืนยันอนุมัติสลิป (Approve)</span>
                  </button>
                  <button
                    onClick={() => handleReview(selectedOrder.id, "rejected", adminNoteInput)}
                    disabled={processingId === selectedOrder.id}
                    className="flex-1 py-3 px-4 rounded-xl text-xs font-extrabold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>ปฏิเสธสลิป & ระงับสิทธิ์</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

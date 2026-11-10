"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Search,
  Crown,
  ShieldCheck,
  Laptop,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  X,
  Sliders,
  Calendar,
  Lock,
  RotateCcw,
  Plus,
  Loader2,
} from "lucide-react";

interface UserItem {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: "user" | "admin";
  created_at: string;
  subscription: {
    id: string;
    tier: "standard" | "premium";
    status: string;
    interval: string;
    current_period_end: string;
  } | null;
  apiKey: {
    id: string;
    prefix: string;
    name: string;
    max_devices: number;
    devices_count: number;
    devices: Array<{
      id: string;
      name: string;
      first_seen?: string;
      last_active?: string;
    }>;
    allowed_tools: string[] | null;
    is_active: boolean;
    last_used_at: string | null;
  } | null;
}

function UsersManager() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialTier = searchParams.get("tier") || "all";

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filterTier, setFilterTier] = useState(initialTier);
  const [filterRole, setFilterRole] = useState("all");

  // State สำหรับ Modal ปรับสิทธิ์ Subscription
  const [subModalUser, setSubModalUser] = useState<UserItem | null>(null);
  const [selectedTier, setSelectedTier] = useState<"standard" | "premium">("premium");
  const [selectedInterval, setSelectedInterval] = useState<"monthly" | "yearly" | "lifetime">("lifetime");
  const [subMonths, setSubMonths] = useState("lifetime");
  const [isSubmittingSub, setIsSubmittingSub] = useState(false);

  // State สำหรับ Modal ปรับแก้ Max Devices
  const [deviceModalUser, setDeviceModalUser] = useState<UserItem | null>(null);
  const [newMaxDevices, setNewMaxDevices] = useState(2);
  const [isSubmittingDevice, setIsSubmittingDevice] = useState(false);

  // Notification message
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        showAlert("error", "ไม่สามารถดึงข้อมูลสมาชิกได้");
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // กรองข้อมูล
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchRole =
      filterRole === "all" ? true : u.role === filterRole;

    const matchTier =
      filterTier === "all"
        ? true
        : filterTier === "free"
        ? !u.subscription || u.subscription.status !== "active"
        : u.subscription?.tier === filterTier && u.subscription?.status === "active";

    return matchSearch && matchRole && matchTier;
  });

  // เปลี่ยน Role (User <-> Admin)
  const handleChangeRole = async (user: UserItem, newRole: "user" | "admin") => {
    if (!confirm(`ยืนยันการเปลี่ยนบทบาทของ ${user.email} เป็น ${newRole.toUpperCase()}?`)) return;

    try {
      const res = await fetch("/api/admin/users/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: user.user_id, newRole }),
      });

      const data = await res.json();
      if (res.ok) {
        showAlert("success", data.message);
        fetchUsers();
      } else {
        showAlert("error", data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      showAlert("error", "ไม่สามารถเปลี่ยนบทบาทได้");
    }
  };

  // บันทึก Subscription
  const handleSaveSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subModalUser) return;
    setIsSubmittingSub(true);

    try {
      const res = await fetch("/api/admin/users/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: subModalUser.user_id,
          tier: selectedTier,
          interval: selectedInterval,
          monthsValid: subMonths,
          status: "active",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showAlert("success", data.message);
        setSubModalUser(null);
        fetchUsers();
      } else {
        showAlert("error", data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      showAlert("error", "ไม่สามารถบันทึกสิทธิ์สมาชิกได้");
    } finally {
      setIsSubmittingSub(false);
    }
  };

  // รีเซ็ตอุปกรณ์ของผู้ใช้
  const handleResetDevices = async (user: UserItem) => {
    if (!user.apiKey) {
      showAlert("error", "ผู้ใช้นี้ยังไม่มี API Key ในระบบ");
      return;
    }

    if (!confirm(`ต้องการล้างรายการอุปกรณ์ของ ${user.email} ใช่หรือไม่? (ผู้ใช้จะสามารถนำคีย์ไปต่อกับเครื่องใหม่ได้ทันที)`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin/users/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyId: user.apiKey.id,
          action: "reset",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showAlert("success", data.message);
        fetchUsers();
      } else {
        showAlert("error", data.error || "ไม่สามารถรีเซ็ตอุปกรณ์ได้");
      }
    } catch (err) {
      showAlert("error", "เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  // บันทึก Max Devices
  const handleSaveMaxDevices = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceModalUser || !deviceModalUser.apiKey) return;
    setIsSubmittingDevice(true);

    try {
      const res = await fetch("/api/admin/users/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyId: deviceModalUser.apiKey.id,
          action: "update_max",
          maxDevices: newMaxDevices,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showAlert("success", data.message);
        setDeviceModalUser(null);
        fetchUsers();
      } else {
        showAlert("error", data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      showAlert("error", "ไม่สามารถอัปเดตจำนวนเครื่องได้");
    } finally {
      setIsSubmittingDevice(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Users & Entitlements
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            จัดการสมาชิก & สิทธิ์การใช้งาน
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            ปรับระดับสมาชิก (Free, Standard, Buffet ตลอดชีพ), สลับสิทธิ์แอดมิน และจัดการโควตาอุปกรณ์
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-brand-orange" : ""}`} />
          <span>รีเฟรช</span>
        </button>
      </div>

      {/* Global Alert */}
      {alert && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-3 animate-in slide-in-from-top ${
            alert.type === "success"
              ? "bg-brand-emerald/15 border border-brand-emerald/30 text-brand-emerald"
              : "bg-rose-500/15 border border-rose-500/30 text-rose-400"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span className="font-medium">{alert.message}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาด้วยอีเมล หรือชื่อสมาชิก..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tier Filter */}
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="py-2.5 px-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-brand-orange"
          >
            <option value="all">ทุกแพ็กเกจ</option>
            <option value="premium">Premium (Buffet)</option>
            <option value="standard">Standard</option>
            <option value="free">Free Tier</option>
          </select>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="py-2.5 px-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-brand-orange"
          >
            <option value="all">ทุกบทบาท</option>
            <option value="admin">เฉพาะ Admin</option>
            <option value="user">เฉพาะ User</option>
          </select>
        </div>
      </div>

      {/* Users Count Summary */}
      <div className="text-xs text-slate-400 font-medium px-1">
        พบสมาชิกทั้งหมด <strong className="text-white">{filteredUsers.length}</strong> บัญชี (จาก {users.length} บัญชีในระบบ)
      </div>

      {/* Users Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-850/70 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">สมาชิก</th>
                <th className="py-3.5 px-4">บทบาท (Role)</th>
                <th className="py-3.5 px-4">แพ็กเกจ & อายุการใช้งาน</th>
                <th className="py-3.5 px-4">อุปกรณ์ (Device Lock)</th>
                <th className="py-3.5 px-4 text-right">เครื่องมือจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    {loading ? "กำลังโหลดข้อมูลสมาชิก..." : "ไม่พบสมาชิกตามเงื่อนไขที่ค้นหา"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isBuffet = u.subscription?.tier === "premium" && u.subscription?.status === "active";
                  const isStandard = u.subscription?.tier === "standard" && u.subscription?.status === "active";
                  const isLifetime = u.subscription?.interval === "lifetime" || u.subscription?.current_period_end?.startsWith("2099");

                  return (
                    <tr key={u.id} className="hover:bg-slate-850/40 transition-colors">
                      {/* Name & Email */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/60 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                            {u.full_name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-white truncate flex items-center gap-1.5">
                              {u.full_name}
                              {u.role === "admin" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                              )}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate">{u.email}</span>
                            <span className="text-[10px] text-slate-500">
                              สมัครเมื่อ: {new Date(u.created_at).toLocaleDateString("th-TH")}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Toggle */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {u.role === "admin" ? (
                            <span className="inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <ShieldCheck className="w-3 h-3" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center py-0.5 px-2.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                              User
                            </span>
                          )}

                          <button
                            onClick={() => handleChangeRole(u, u.role === "admin" ? "user" : "admin")}
                            title={u.role === "admin" ? "ลดสิทธิ์เป็น User ทั่วไป" : "แต่งตั้งเป็น Admin"}
                            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Subscription Status & Actions */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {isBuffet ? (
                            <div className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-[10px] font-bold bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
                              <Crown className="w-3 h-3" />
                              <span>Premium (Buffet)</span>
                            </div>
                          ) : isStandard ? (
                            <div className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              <span>Standard</span>
                            </div>
                          ) : (
                            <span className="inline-block text-[11px] text-slate-500">ฟรี (Free Tier)</span>
                          )}

                          {u.subscription && (
                            <div className="text-[10px] text-slate-400">
                              {isLifetime ? (
                                <span className="text-amber-400 font-bold">ตลอดชีพ (Lifetime)</span>
                              ) : (
                                <span>หมดอายุ: {new Date(u.subscription.current_period_end).toLocaleDateString("th-TH")}</span>
                              )}
                            </div>
                          )}

                          <div>
                            <button
                              onClick={() => {
                                setSubModalUser(u);
                                setSelectedTier(u.subscription?.tier || "premium");
                              }}
                              className="text-[11px] font-bold text-brand-orange hover:text-amber-400 underline decoration-dotted"
                            >
                              ปรับสิทธิ์สมาชิก
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Devices Quota & Reset */}
                      <td className="py-4 px-4">
                        {u.apiKey ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Laptop className="w-3.5 h-3.5 text-brand-emerald" />
                              <span className="font-bold text-white text-[11px]">
                                {u.apiKey.devices_count} / {u.apiKey.max_devices} เครื่อง
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[10px]">
                              <button
                                onClick={() => {
                                  setDeviceModalUser(u);
                                  setNewMaxDevices(u.apiKey?.max_devices ?? 2);
                                }}
                                className="text-slate-400 hover:text-white underline"
                              >
                                แก้โควตา
                              </button>
                              <span className="text-slate-600">•</span>
                              <button
                                onClick={() => handleResetDevices(u)}
                                className="text-rose-400 hover:text-rose-300 underline"
                              >
                                รีเซ็ตเครื่อง
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">ยังไม่มี API Key</span>
                        )}
                      </td>

                      {/* Manage Column */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => {
                            setSubModalUser(u);
                            setSelectedTier(u.subscription?.tier || "premium");
                          }}
                          className="py-1 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-all border border-slate-700"
                        >
                          จัดการ
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Modal 1: ปรับสิทธิ์สมาชิก (Subscription Modal) */}
      {/* ========================================================================= */}
      {subModalUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-brand-orange" />
                <h3 className="font-bold text-white text-base">ปรับสิทธิ์แพ็กเกจสมาชิก</h3>
              </div>
              <button
                onClick={() => setSubModalUser(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
              <div>สมาชิก: <strong className="text-white">{subModalUser.full_name}</strong></div>
              <div>อีเมล: <strong className="text-brand-orange">{subModalUser.email}</strong></div>
            </div>

            <form onSubmit={handleSaveSubscription} className="space-y-4 text-xs">
              {/* ระดับแพ็กเกจ */}
              <div>
                <label className="block text-slate-300 font-bold mb-2">เลือกระดับแพ็กเกจ (Tier)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTier("premium")}
                    className={`py-3 px-3 rounded-2xl border text-center font-bold transition-all ${
                      selectedTier === "premium"
                        ? "bg-brand-orange/20 border-brand-orange text-brand-orange"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    👑 Premium (Buffet)
                    <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                      ทุกคอร์ส + โค้ด + เครื่องมือ
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTier("standard")}
                    className={`py-3 px-3 rounded-2xl border text-center font-bold transition-all ${
                      selectedTier === "standard"
                        ? "bg-blue-500/20 border-blue-400 text-blue-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    Standard
                    <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                      1 คอร์ส/เดือน + เครื่องมือ
                    </span>
                  </button>
                </div>
              </div>

              {/* ระยะเวลาสิทธิ์ */}
              <div>
                <label className="block text-slate-300 font-bold mb-2">ระยะเวลาสิทธิ์การใช้งาน</label>
                <select
                  value={subMonths}
                  onChange={(e) => {
                    setSubMonths(e.target.value);
                    if (e.target.value === "lifetime") {
                      setSelectedInterval("lifetime");
                    } else if (e.target.value === "12") {
                      setSelectedInterval("yearly");
                    } else {
                      setSelectedInterval("monthly");
                    }
                  }}
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                >
                  <option value="lifetime">⚡ ตลอดชีพ (Lifetime Access 2099)</option>
                  <option value="12">1 ปี (12 เดือน)</option>
                  <option value="6">6 เดือน</option>
                  <option value="3">3 เดือน</option>
                  <option value="1">1 เดือน</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSubModalUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSub}
                  className="flex-1 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-lg shadow-brand-orange/20"
                >
                  {isSubmittingSub ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <span>บันทึกสิทธิ์ทันที</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal 2: ปรับแก้ Max Devices (Device Quota Modal) */}
      {/* ========================================================================= */}
      {deviceModalUser && deviceModalUser.apiKey && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-brand-emerald" />
                <h3 className="font-bold text-white text-base">ปรับโควตาอุปกรณ์ (Device Lock)</h3>
              </div>
              <button
                onClick={() => setDeviceModalUser(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
              <div>ผู้ใช้: <strong className="text-white">{deviceModalUser.full_name} ({deviceModalUser.email})</strong></div>
              <div>ผูกไว้ปัจจุบัน: <strong className="text-brand-emerald">{deviceModalUser.apiKey.devices_count}</strong> เครื่อง</div>
            </div>

            <form onSubmit={handleSaveMaxDevices} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  จำนวนเครื่องสูงสุดที่อนุญาต (Custom Max Devices)
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  กำหนดจำนวนคอมพิวเตอร์ที่สามารถลงทะเบียนใช้งานโปรแกรมและสตูดิโอพร้อมกันได้
                </p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewMaxDevices(num)}
                      className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                        newMaxDevices === num
                          ? "bg-brand-emerald/20 border-brand-emerald text-brand-emerald"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">หรือระบุตัวเลขเอง</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newMaxDevices}
                  onChange={(e) => setNewMaxDevices(parseInt(e.target.value, 10) || 1)}
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-emerald font-mono"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeviceModalUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDevice}
                  className="flex-1 py-2.5 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white font-bold disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSubmittingDevice ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <span>บันทึกโควตา</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UsersAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-emerald animate-spin" />
          <span className="text-xs">กำลังโหลดหน้าระบบสมาชิก...</span>
        </div>
      }
    >
      <UsersManager />
    </Suspense>
  );
}

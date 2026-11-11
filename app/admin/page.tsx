"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  BookOpen,
  Laptop,
  ArrowRight,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Crown,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  premiumSubscriptions: number;
  totalCourses: number;
  totalConnectedDevices: number;
  activeApiKeys: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    premiumSubscriptions: 0,
    totalCourses: 0,
    totalConnectedDevices: 0,
    activeApiKeys: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setRecentUsers((usersData.users || []).slice(0, 5));
      }
    } catch (err) {
      console.error("Fetch admin data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
              Admin Overview
            </span>
            <span className="text-xs text-slate-500">• aifullfill.com</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ภาพรวมระบบผู้ดูแล
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            ควบคุมสิทธิ์สมาชิก, ดูสถิติการใช้งาน, จัดการจำนวนเครื่อง (Device Lock) และคอร์สเรียน AI
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/80 shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-brand-orange" : ""}`} />
          <span>รีเฟรชข้อมูล</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">ผู้ใช้งานทั้งหมด</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.totalUsers}</span>
            <span className="text-xs text-slate-500">บัญชี</span>
          </div>
          <Link
            href="/admin/users"
            className="mt-4 flex items-center text-[11px] font-bold text-blue-400 hover:text-blue-300 gap-1"
          >
            <span>ดูรายชื่อสมาชิก</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Premium / Buffet Subscribers */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">สมาชิก Premium / Buffet</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">{stats.premiumSubscriptions}</span>
            <span className="text-xs text-slate-500">คน (จาก Active {stats.activeSubscriptions})</span>
          </div>
          <Link
            href="/admin/users?tier=premium"
            className="mt-4 flex items-center text-[11px] font-bold text-amber-400 hover:text-amber-300 gap-1"
          >
            <span>จัดการแพ็กเกจ</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Connected Devices */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">อุปกรณ์ที่ผูกไว้ (Device Lock)</span>
            <div className="w-9 h-9 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-emerald">{stats.totalConnectedDevices}</span>
            <span className="text-xs text-slate-500">เครื่อง (ทั่วโลก)</span>
          </div>
          <Link
            href="/admin/licenses"
            className="mt-4 flex items-center text-[11px] font-bold text-brand-emerald hover:text-emerald-300 gap-1"
          >
            <span>มอนิเตอร์เครื่อง & รีเซ็ตคีย์</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Total Courses */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">คอร์สเรียน & โปรเจกต์</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.totalCourses}</span>
            <span className="text-xs text-slate-500">คอร์ส</span>
          </div>
          <Link
            href="/admin/courses"
            className="mt-4 flex items-center text-[11px] font-bold text-purple-400 hover:text-purple-300 gap-1"
          >
            <span>จัดการเนื้อหา</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Sparkles className="w-4 h-4 text-brand-orange" />
          <span>ทางลัดการจัดการด่วน (Quick Actions)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/admin/payments"
            className="p-4 rounded-2xl bg-slate-800/60 border border-amber-500/40 hover:bg-slate-800 hover:border-amber-400 transition-all flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                ตรวจสลิป & อนุมัติคำสั่งซื้อ
              </h4>
              <p className="text-[11px] text-slate-400">
                เช็คสลิปที่ผ่าน Pre-Approve และยืนยันสิทธิ์ถาวร
              </p>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-brand-orange/40 transition-all flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-brand-orange transition-colors">
                ปรับสิทธิ์สมาชิก / อัปเกรดบุฟเฟต์
              </h4>
              <p className="text-[11px] text-slate-400">
                เพิ่มวันหมดอายุ หรือตั้งสิทธิ์ Buffet ตลอดชีพ
              </p>
            </div>
          </Link>

          <Link
            href="/admin/licenses"
            className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-brand-emerald/40 transition-all flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-emerald/15 text-brand-emerald flex items-center justify-center shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-brand-emerald transition-colors">
                ปลดล็อก / เพิ่มโควตาเครื่อง
              </h4>
              <p className="text-[11px] text-slate-400">
                รีเซ็ตเครื่องเมื่อลูกค้าเปลี่ยนคอม หรือขยายเป็น 3-5 เครื่อง
              </p>
            </div>
          </Link>

          <Link
            href="/admin/courses"
            className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-purple-400/40 transition-all flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                เพิ่มคอร์ส AI / โปรเจกต์ใหม่
              </h4>
              <p className="text-[11px] text-slate-400">
                อัปโหลดคอร์สใหม่ ผูกลิงก์ GitHub หรือวิดีโอ
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>สมาชิกที่ลงทะเบียนล่าสุด</span>
            </h3>
            <p className="text-xs text-slate-400">
              แสดงผู้ใช้ 5 ลำดับล่าสุดในระบบ
            </p>
          </div>
          <Link
            href="/admin/users"
            className="text-xs font-semibold text-brand-orange hover:text-amber-400 flex items-center gap-1"
          >
            <span>ดูทั้งหมด ({stats.totalUsers})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentUsers.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            {loading ? "กำลังโหลดข้อมูล..." : "ยังไม่มีข้อมูลผู้ใช้ในระบบ"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">ผู้ใช้งาน</th>
                  <th className="py-3 px-3">บทบาท</th>
                  <th className="py-3 px-3">แพ็กเกจสมาชิก</th>
                  <th className="py-3 px-3">อุปกรณ์ผูกไว้</th>
                  <th className="py-3 px-3 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                          {u.full_name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-white truncate">{u.full_name}</span>
                          <span className="text-[11px] text-slate-400 truncate">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      {u.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <ShieldCheck className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                          User
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      {u.subscription?.tier === "premium" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
                          <Crown className="w-3 h-3" />
                          Premium (Buffet)
                        </span>
                      ) : u.subscription?.tier === "standard" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Standard
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">ฟรี (Free Tier)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      {u.apiKey ? (
                        <span className="text-[11px] text-slate-300">
                          <strong className="text-brand-emerald">{u.apiKey.devices_count}</strong> / {u.apiKey.max_devices} เครื่อง
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/admin/users?search=${encodeURIComponent(u.email)}`}
                        className="py-1 px-2.5 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors inline-block"
                      >
                        จัดการสิทธิ์
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

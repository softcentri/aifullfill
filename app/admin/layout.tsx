"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  BookOpen,
  ArrowLeft,
  KeyRound,
  Laptop,
  Sparkles,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        setCurrentUser(user);

        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name, email")
          .eq("user_id", user.id)
          .single();

        if (profile?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Check admin error:", err);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-10 h-10 text-brand-emerald animate-spin" />
        <p className="text-sm text-slate-400 font-medium">
          กำลังตรวจสอบสิทธิ์ผู้ดูแลระบบ...
        </p>
      </div>
    );
  }

  // หากไม่มีสิทธิ์ Admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700/80 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white">
              ไม่มีสิทธิ์เข้าถึงส่วนผู้ดูแลระบบ
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              หน้านี้สงวนไว้สำหรับผู้ดูแลระบบ (Admin) เท่านั้น
              {currentUser
                ? ` บัญชีปัจจุบัน (${currentUser.email}) ยังไม่ได้รับสิทธิ์แอดมิน`
                : " กรุณาเข้าสู่ระบบด้วยบัญชีแอดมิน"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-300 bg-slate-700/70 hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              กลับหน้าแรก
            </Link>
            <Link
              href="/login"
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20"
            >
              สลับบัญชีเข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    {
      name: "ภาพรวมระบบ (Overview)",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "จัดการสมาชิก & สิทธิ์ (Users)",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "คุมสิทธิ์โปรแกรม & เครื่อง (Licenses)",
      href: "/admin/licenses",
      icon: Laptop,
    },
    {
      name: "จัดการคอร์สเรียน (Courses)",
      href: "/admin/courses",
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-slate-900 border-r border-slate-800/80 p-5 shrink-0 justify-between">
        <div className="space-y-6">
          {/* Admin Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center shadow-lg shadow-brand-orange/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                  aifullfill
                  <span className="text-[10px] uppercase font-black bg-brand-orange/20 text-brand-orange border border-brand-orange/30 px-1.5 py-0.2 rounded-md">
                    Admin
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  ศูนย์ควบคุม & จัดการระบบ
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-brand-orange/20 to-amber-500/10 text-brand-orange border border-brand-orange/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-brand-orange" : "text-slate-400"
                    }`}
                  />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-emerald/20 border border-brand-emerald/30 text-brand-emerald flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser?.email?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">
                {currentUser?.email}
              </span>
              <span className="text-[10px] text-brand-emerald flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse"></span>
                Super Admin
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="w-full py-2 px-3 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2 border border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับสู่หน้าเว็บไซต์</span>
            <ExternalLink className="w-3 h-3 ml-auto text-slate-500" />
          </Link>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <header className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-sm text-white">
            aifullfill Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Dropdown Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                  isActive
                    ? "bg-brand-orange/20 text-brand-orange border border-brand-orange/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับหน้าเว็บไซต์หลัก
          </Link>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
        {children}
      </main>
    </div>
  );
}

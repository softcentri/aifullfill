"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { 
  Search, 
  BookOpen, 
  Code2, 
  Wrench, 
  Users, 
  Briefcase, 
  Sparkles, 
  User as UserIcon, 
  Menu, 
  X, 
  LogOut 
} from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    // ตรวจสอบ Session ปัจจุบัน
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        setUserProfile(profile);
      }
    };

    checkUser();

    // ฟังการเปลี่ยนแปลง Auth State
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user || null;
      setCurrentUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUserProfile(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-brand-slate flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl tracking-tighter flex items-center">
                A<span className="text-brand-orange relative">i<span className="absolute -top-1 right-0 w-1.5 h-1.5 bg-brand-orange rounded-full animate-ping"></span></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-brand-slate flex items-center">
                ai<span className="text-brand-slate">full</span><span className="text-brand-orange">fill</span>
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-brand-emerald-light text-brand-emerald-dark rounded-full">
                  FULL
                </span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium -mt-1 tracking-wider uppercase">
                AI Academy & Toolkit
              </span>
            </div>
          </Link>

          {/* Udemy-Style Global Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2 relative">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาคอร์ส AI, ซอร์สโค้ด, เครื่องมือ หรือ Prompts..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 hover:bg-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-emerald/40 border border-transparent focus:border-brand-emerald rounded-full transition-all"
              />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700">
            <Link
              href="/courses"
              className="px-3 py-2 rounded-lg hover:text-brand-emerald hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-brand-emerald" />
              คอร์สเรียน
            </Link>
            <Link
              href="/projects"
              className="px-3 py-2 rounded-lg hover:text-brand-emerald hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Code2 className="w-4 h-4 text-indigo-500" />
              คลังโค้ด & โปรเจกต์
            </Link>
            <Link
              href="/tools"
              className="px-3 py-2 rounded-lg hover:text-brand-emerald hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4 text-teal-500" />
              เครื่องมือ & AI Gems
            </Link>
            <Link
              href="/training"
              className="px-3 py-2 rounded-lg hover:text-brand-emerald hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-purple-500" />
              อบรมตัวต่อตัว / กทม.
            </Link>
            <Link
              href="/agency"
              className="px-3 py-2 rounded-lg hover:text-brand-emerald hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4 text-amber-500" />
              รับทำระบบ
            </Link>
          </nav>

          {/* Action Buttons & Auth Status */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/#pricing"
              className="relative hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange-hover hover:to-amber-600 rounded-full shadow-md shadow-brand-orange/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>สมัครบุฟเฟต์</span>
            </Link>

            {currentUser ? (
              // กรณีล็อกอินแล้ว
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-xs font-bold text-brand-slate"
                  title="แดชบอร์ดสมาชิก"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-emerald text-white flex items-center justify-center font-bold text-xs">
                    {(userProfile?.full_name || currentUser.email || "U")[0].toUpperCase()}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">
                    {userProfile?.full_name || currentUser.email?.split("@")[0]}
                  </span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-full hover:bg-slate-100 transition-colors"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              // กรณียังไม่ได้ล็อกอิน
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-bold text-brand-slate hover:text-brand-emerald border border-slate-300 hover:border-brand-emerald rounded-full transition-colors flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>เข้าสู่ระบบ</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="mb-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาคอร์ส AI, โค้ด, หรือเครื่องมือ..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 border border-transparent rounded-lg"
              />
            </div>
          </div>
          <Link
            href="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-sm"
          >
            <BookOpen className="w-4 h-4 text-brand-emerald" />
            คอร์สเรียนทั้งหมด
          </Link>
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-sm"
          >
            <Code2 className="w-4 h-4 text-indigo-500" />
            คลังโค้ด & โปรเจกต์พร้อมใช้
          </Link>
          <Link
            href="/tools"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-sm"
          >
            <Wrench className="w-4 h-4 text-teal-500" />
            ศูนย์รวมเครื่องมือ & AI Gems
          </Link>
          <Link
            href="/training"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-sm"
          >
            <Users className="w-4 h-4 text-purple-500" />
            อบรม AI ตัวต่อตัว / กทม.
          </Link>
          <Link
            href="/agency"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-sm"
          >
            <Briefcase className="w-4 h-4 text-amber-500" />
            รับทำเว็บไซต์ & ซอฟต์แวร์ด้วย AI
          </Link>

          {currentUser ? (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-brand-emerald font-bold text-sm bg-brand-emerald/10"
              >
                <UserIcon className="w-4 h-4" />
                แดชบอร์ดสมาชิก ({currentUser.email?.split("@")[0]})
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 font-medium text-sm text-left"
              >
                <LogOut className="w-4 h-4" />
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-xs font-bold text-white bg-brand-slate rounded-xl block"
              >
                เข้าสู่ระบบ / สมัครสมาชิก
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

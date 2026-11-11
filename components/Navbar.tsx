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
  LogOut,
  ShieldCheck 
} from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
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
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/90 transition-all text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-md group-hover:border-brand-emerald/50 transition-colors">
              <span className="text-white font-bold text-lg tracking-tighter flex items-center">
                A<span className="text-brand-orange relative">i<span className="absolute -top-1 right-0 w-1.5 h-1.5 bg-brand-orange rounded-full animate-ping"></span></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center">
                ai<span className="text-white">full</span><span className="text-brand-orange">fill</span>
                <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 rounded-full">
                  FULL
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium -mt-1 tracking-wider uppercase">
                AI Academy & Toolkit
              </span>
            </div>
          </Link>

          {/* Global Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2 relative">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาคอร์ส AI, ซอร์สโค้ด, เครื่องมือ หรือ Prompts..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-800/80 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-emerald/50 border border-slate-700/80 focus:border-brand-emerald rounded-full transition-all"
              />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-300">
            <Link
              href="/courses"
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-brand-emerald" />
              คอร์สเรียน
            </Link>
            <Link
              href="/projects"
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
            >
              <Code2 className="w-4 h-4 text-indigo-400" />
              คลังโค้ด
            </Link>
            <Link
              href="/tools"
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4 text-teal-400" />
              เครื่องมือ
            </Link>
            <Link
              href="/training"
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-purple-400" />
              อบรมตัวต่อตัว
            </Link>
            <Link
              href="/agency"
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              รับทำระบบ
            </Link>
          </nav>

          {/* Action Buttons & Auth Status */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/pricing"
              className="relative hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-full tactile-button-primary transition-all duration-150 active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>สมัครบุฟเฟต์</span>
            </Link>

            {currentUser ? (
              // กรณีล็อกอินแล้ว
              <div className="flex items-center gap-2">
                {userProfile?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-950/80 hover:bg-amber-900 border border-amber-700/80 rounded-full transition-all"
                    title="ไปที่แผงควบคุมระบบ (Admin Panel)"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin</span>
                  </Link>
                )}

                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-semibold text-slate-200 border border-slate-700/80"
                  title="แดชบอร์ดสมาชิก"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-emerald text-slate-950 flex items-center justify-center font-bold text-xs">
                    {(userProfile?.full_name || currentUser.email || "U")[0].toUpperCase()}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">
                    {userProfile?.full_name || currentUser.email?.split("@")[0]}
                  </span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-full hover:bg-slate-800 transition-colors"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              // กรณียังไม่ได้ล็อกอิน
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-full tactile-button-secondary transition-all flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>เข้าสู่ระบบ</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="mb-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาคอร์ส AI, โค้ด, หรือเครื่องมือ..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-400"
              />
            </div>
          </div>
          <Link
            href="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white font-medium text-sm"
          >
            <BookOpen className="w-4 h-4 text-brand-emerald" />
            คอร์สเรียนทั้งหมด
          </Link>
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white font-medium text-sm"
          >
            <Code2 className="w-4 h-4 text-indigo-400" />
            คลังโค้ด & โปรเจกต์พร้อมใช้
          </Link>
          <Link
            href="/tools"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white font-medium text-sm"
          >
            <Wrench className="w-4 h-4 text-teal-400" />
            ศูนย์รวมเครื่องมือ & AI Gems
          </Link>
          <Link
            href="/training"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white font-medium text-sm"
          >
            <Users className="w-4 h-4 text-purple-400" />
            อบรม AI ตัวต่อตัว / กทม.
          </Link>
          <Link
            href="/agency"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white font-medium text-sm"
          >
            <Briefcase className="w-4 h-4 text-amber-400" />
            รับทำเว็บไซต์ & ซอฟต์แวร์ด้วย AI
          </Link>

          {currentUser ? (
            <div className="pt-2 border-t border-slate-800 space-y-1">
              {userProfile?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-amber-300 font-bold text-sm bg-amber-950/80 border border-amber-800"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  แผงควบคุมผู้ดูแล (Admin Panel)
                </Link>
              )}
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-brand-emerald font-semibold text-sm bg-brand-emerald/10"
              >
                <UserIcon className="w-4 h-4" />
                แดชบอร์ดสมาชิก ({currentUser.email?.split("@")[0]})
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-400 hover:bg-slate-800 font-medium text-sm text-left"
              >
                <LogOut className="w-4 h-4" />
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-full block tactile-button-primary"
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

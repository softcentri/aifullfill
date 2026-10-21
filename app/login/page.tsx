"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  ShieldCheck,
  Loader2
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const supabase = createClient();

  // ดำเนินการเข้าสู่ระบบ
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
        } else if (error.message.includes("Email not confirmed")) {
          setErrorMessage("กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ (ตรวจสอบในกล่องจดหมาย)");
        } else {
          setErrorMessage(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.session) {
        router.push(nextUrl);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
      setIsLoading(false);
    }
  };

  // ดำเนินการสมัครสมาชิกใหม่
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setErrorMessage("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${nextUrl}`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setErrorMessage("อีเมลนี้ถูกลงทะเบียนในระบบแล้ว กรุณาเลือกเข้าสู่ระบบ");
        } else {
          setErrorMessage(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.user && data.session) {
        setSuccessMessage("สมัครสมาชิกสำเร็จ! กำลังนำคุณเข้าสู่แดชบอร์ด...");
        setTimeout(() => {
          router.push(nextUrl);
          router.refresh();
        }, 1000);
      } else {
        setSuccessMessage(
          "สมัครสมาชิกสำเร็จ! เราได้ส่งลิงก์ยืนยันตัวตนไปยังอีเมลของคุณแล้ว กรุณากดลิงก์ในอีเมลเพื่อเริ่มใช้งาน"
        );
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage("เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${nextUrl}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-brand-slate flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl tracking-tighter flex items-center">
              A<span className="text-brand-orange">i</span>
            </span>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-brand-slate">
            ai<span className="text-brand-slate">full</span><span className="text-brand-orange">fill</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-brand-slate">
          {mode === "signin" ? "ยินดีต้อนรับกลับมา" : "เริ่มต้นเติมเต็มทักษะ AI"}
        </h2>
        <p className="text-xs text-slate-500">
          {mode === "signin"
            ? "เข้าสู่ระบบเพื่อเข้าถึงคอร์สเรียน คลังโค้ด และสิทธิ์ MCP"
            : "สมัครสมาชิกฟรี เพื่อเริ่มต้นทดลองเรียนและใช้งานเครื่องมือ AI"}
        </p>
      </div>

      {/* Card Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
        
        {/* Mode Switcher Tabs */}
        <div className="flex rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === "signin"
                ? "bg-white text-brand-slate shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            เข้าสู่ระบบ
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === "signup"
                ? "bg-white text-brand-slate shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            สมัครสมาชิกใหม่
          </button>
        </div>

        {/* Alert Error / Success */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald-dark text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-emerald" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Google One-Click Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>เข้าสู่ระบบด้วย Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-medium">หรือใช้อีเมล</span>
        </div>

        {/* Form */}
        <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
          
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อ-นามสกุล</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="เช่น บัณฑิต บุญฤทธิ์"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 focus:border-brand-emerald transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">อีเมลของคุณ</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 focus:border-brand-emerald transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">รหัสผ่าน</label>
              {mode === "signin" && (
                <Link href="/forgot-password" className="text-[11px] text-brand-emerald hover:underline">
                  ลืมรหัสผ่าน?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 focus:border-brand-emerald transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange-hover hover:to-amber-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/25 disabled:opacity-50"
          >
            {isLoading ? (
              <span>กำลังประมวลผล...</span>
            ) : (
              <>
                <span>{mode === "signin" ? "เข้าสู่ระบบทันที" : "สร้างบัญชีผู้ใช้ใหม่"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>

      {/* Security Trust Footer */}
      <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
        <span>ระบบความปลอดภัยมาตรฐาน Supabase Auth และ Row Level Security</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-off-white font-sans">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-8 h-8 text-brand-emerald animate-spin" />
          <span className="text-xs text-slate-500">กำลังโหลด...</span>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}

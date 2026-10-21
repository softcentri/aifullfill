import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Heart, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-slate text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-surface flex items-center justify-center border border-slate-700">
                <span className="text-white font-bold text-lg tracking-tighter">
                  A<span className="text-brand-orange">i</span>
                </span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                ai<span className="text-white">full</span><span className="text-brand-orange">fill</span>
                <span className="text-brand-emerald text-sm ml-1 font-semibold">.com</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              แพลตฟอร์มบุฟเฟต์การเรียนรู้ AI แบบครบวงจร คลังซอร์สโค้ดพร้อมใช้ เครื่องมือทุ่นแรง และระบบควบคุมสิทธิ์ Agentic AI ที่ช่วยเติมเต็มศักยภาพให้คุณสร้างรายได้จริง
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                คุ้มครองลิขสิทธิ์ด้วย MCP Token
              </span>
            </div>
          </div>

          {/* Column 1: เรียนรู้ */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">การเรียนรู้</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/courses" className="hover:text-brand-emerald transition-colors">คอร์สบุฟเฟต์ทั้งหมด</Link></li>
              <li><Link href="/courses?tier=standard" className="hover:text-brand-emerald transition-colors">Standard Buffet</Link></li>
              <li><Link href="/courses?tier=premium" className="hover:text-brand-emerald transition-colors">Premium Masterclass</Link></li>
              <li><Link href="/training" className="hover:text-brand-emerald transition-colors">อบรม AI ตัวต่อตัว / กทม.</Link></li>
            </ul>
          </div>

          {/* Column 2: เครื่องมือ & โค้ด */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">ทรัพยากร AI</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/projects" className="hover:text-brand-emerald transition-colors">คลังซอร์สโค้ดโปรเจกต์</Link></li>
              <li><Link href="/tools" className="hover:text-brand-emerald transition-colors">ศูนย์รวมเครื่องมือ AI</Link></li>
              <li><Link href="/tools?tab=gems" className="hover:text-brand-emerald transition-colors">AI Gems & Prompts</Link></li>
              <li><Link href="/dashboard/api-keys" className="hover:text-brand-emerald transition-colors">MCP Server License</Link></li>
            </ul>
          </div>

          {/* Column 3: บริการ & ติดต่อ */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">ติดต่อ & ซัพพอร์ต</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/agency" className="hover:text-brand-emerald transition-colors">รับทำเว็บไซต์ & แอปด้วย AI</Link></li>
              <li><Link href="/pricing" className="hover:text-brand-emerald transition-colors">อัตราค่าบริการบุฟเฟต์</Link></li>
              <li><a href="https://line.me" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-brand-emerald transition-colors"><MessageCircle className="w-3.5 h-3.5 text-brand-emerald" /> LINE Official</a></li>
              <li><a href="mailto:support@aifullfill.com" className="flex items-center gap-1.5 hover:text-brand-emerald transition-colors"><Mail className="w-3.5 h-3.5 text-brand-orange" /> support@aifullfill.com</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} aifullfill.com — All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">นโยบายความเป็นส่วนตัว</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">เงื่อนไขการให้บริการ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

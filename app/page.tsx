import React from "react";
import Link from "next/link";
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  PlayCircle, 
  Star, 
  Code2, 
  Wrench, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Users, 
  Download,
  Terminal,
  Layers,
  Briefcase,
  Play,
  Check
} from "lucide-react";
import { TrustMarquee } from "@/components/TrustMarquee";
import { PillarsTabSection } from "@/components/PillarsTabSection";
import { InstructorSection } from "@/components/InstructorSection";
import { FaqSection } from "@/components/FaqSection";

export default function HomePage() {
  return (
    <div className="space-y-24 pb-24 overflow-hidden bg-brand-slate text-slate-100">
      
      {/* =========================================================================
          1. HERO SECTION (Lovable Precision + อัตลักษณ์มงคล 60-30-10)
      ========================================================================= */}
      <section className="relative pt-16 pb-20 lg:pt-20 lg:pb-28 bg-grid-pattern overflow-hidden border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Status Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>AI Buffet Subscription — เรียนไม่อั้น ปลดล็อกทุกระบบ</span>
              </div>

              {/* Crisp Solid Heading (No Gradient Text) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-white">
                เรียนใช้ <span className="text-brand-orange">AI สร้างงานได้จริง</span>
                <br />
                เติมเต็มทุกไอเดียสู่ธุรกิจ
              </h1>

              {/* Subtitle with High Readability */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                เข้าถึงคลังคอร์ส AI ครบวงจร, ซอร์สโค้ดโปรเจกต์พร้อมรัน, เครื่องมือทุ่นแรง และระบบควบคุมสิทธิ์ Agentic AI ในแพ็กเกจเดียว ไม่ต้องจ่ายแยกรายคอร์ส
              </p>

              {/* Skill Tags */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-1">
                {[
                  "Desktop Agents (Antigravity/Codex)", 
                  "ComfyUI ฟรี 100%", 
                  "Local AI (DeepSeek/Ollama)", 
                  "Vibe Coding Web App", 
                  "AI E-Book Masterclass", 
                  "Google Flow & Grok Video"
                ].map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/80 hover:border-brand-emerald/50 hover:text-white transition-all"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Tactile CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
                <Link
                  href="/pricing"
                  className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-full tactile-button-primary transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>สมัครบุฟเฟต์เริ่มต้น 599.-</span>
                </Link>

                <Link
                  href="/courses"
                  className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 rounded-full tactile-button-secondary transition-all duration-150 flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-4 h-4 text-brand-emerald" />
                  <span>ทดลองเรียนคอร์สฟรี</span>
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800/80 text-center lg:text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">60+</div>
                  <div className="text-xs text-slate-400 mt-0.5">คอร์ส AI คุณภาพสูง</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-brand-emerald">25+</div>
                  <div className="text-xs text-slate-400 mt-0.5">โปรเจกต์พร้อมซอร์สโค้ด</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-brand-orange">4.9 ★</div>
                  <div className="text-xs text-slate-400 mt-0.5">คะแนนความพึงพอใจ</div>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity Interactive Course Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-lg bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden tactile-card">
                
                {/* Mockup Window Chrome */}
                <div className="px-4 py-3 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-xs font-mono text-slate-400">player.aifullfill.com</span>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
                    LIVE ACCESS
                  </span>
                </div>

                {/* Video Stage Preview */}
                <div className="relative aspect-video bg-slate-950 flex flex-col items-center justify-center border-b border-slate-800/80 p-6 group">
                  <div className="w-14 h-14 rounded-full bg-brand-orange/90 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 cursor-pointer">
                    <Play className="w-6 h-6 ml-1 fill-white" />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-xs font-semibold text-white tracking-wide">EP 01: ติดตั้ง Antigravity + Agent Workflow</p>
                    <span className="text-[11px] text-brand-emerald font-medium">Free Preview บทเรียนนี้ดูฟรีได้ทันที</span>
                  </div>

                  {/* Charging Metaphor Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                    <div className="h-full bg-gradient-to-r from-brand-emerald to-brand-orange w-3/4 rounded-r-full" />
                  </div>
                </div>

                {/* Course Playlist Feed */}
                <div className="p-4 space-y-2.5 bg-slate-900/80">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1 pb-1">
                    <span>คิวบทเรียนถัดไป</span>
                    <span className="text-brand-orange font-semibold">ความคืบหน้า 75%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-brand-emerald/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-brand-emerald/20 text-brand-emerald flex items-center justify-center text-xs font-bold">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">EP 01: พื้นฐาน Agentic Coding</div>
                        <div className="text-[11px] text-slate-400">14 นาที • จบแล้ว</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-brand-emerald px-2 py-0.5 rounded bg-brand-emerald/10">FREE</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between hover:bg-slate-800/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">EP 02: เชื่อมต่อ Supabase Auth & RLS</div>
                        <div className="text-[11px] text-slate-400">22 นาที • กำลังเรียน</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-brand-orange px-2 py-0.5 rounded bg-brand-orange/10">STANDARD</span>
                  </div>
                </div>

                {/* Card Bottom Meta */}
                <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-emerald" />
                    <span>ระบบป้องกันสิทธิ์ Single Function</span>
                  </span>
                  <span className="font-mono text-slate-500">Tier: Premium</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. TECH ECOSYSTEM & SOCIAL PROOF MARQUEE (Inspired by DesignMeee)
      ========================================================================= */}
      <TrustMarquee />

      {/* =========================================================================
          3. 4-PILLAR INTERACTIVE TABS (Inspired by DesignMeee's Multi-category)
      ========================================================================= */}
      <PillarsTabSection />

      {/* =========================================================================
          4. PRICING BUFFET SECTION (3 Tiers with Clear Visual Hierarchy)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>เข้าถึงทุกอย่างในแพ็กเดียว</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            เลือกแพ็กเกจบุฟเฟต์ที่คุ้มค่าที่สุดสำหรับคุณ
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-normal">
            ไม่มีข้อผูกมัด ยกเลิกเมื่อไหร่ก็ได้ หรือเลือกเหมาตลอดชีพเพื่อความคุ้มค่าสูงสุด
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Plan 1: Standard Monthly */}
          <div className="bg-slate-900/90 rounded-2xl p-8 border border-slate-800 flex flex-col justify-between tactile-card hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  เริ่มต้นสบายกระเป๋า
                </span>
                <span className="text-xs text-slate-400">รายเดือน</span>
              </div>
              <h3 className="text-xl font-bold text-white">Standard Monthly</h3>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-white">฿599</span>
                <span className="text-slate-400 text-sm">/ เดือน</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">เหมาะสำหรับผู้ที่ต้องการทดลองเรียนและสร้างพื้นฐาน AI</p>

              <ul className="space-y-3 mt-6 text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>เข้าเรียนคอร์สระดับ Standard ไม่จำกัด</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>ดาวน์โหลดไฟล์แนบประกอบบทเรียน</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>เข้าถึง AI Tools & Gems พื้นฐาน</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>อัปเดตบทเรียนใหม่ตลอดอายุสมาชิก</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/checkout?plan=monthly"
                className="w-full py-3 px-4 text-sm font-semibold rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-center block transition-all tactile-button-secondary"
              >
                เลือกแผนรายเดือน
              </Link>
            </div>
          </div>

          {/* Plan 2: Yearly (Recommended Highlight - The Focal Point) */}
          <div className="bg-slate-900 rounded-2xl p-8 border-2 border-brand-orange relative flex flex-col justify-between shadow-2xl shadow-brand-orange/10 transform md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-orange text-white text-xs font-bold uppercase tracking-wide shadow-md">
              ★ แนะนำยอดนิยม คุ้มค่าที่สุด
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-orange/10 text-brand-orange border border-brand-orange/30">
                  ประหยัดถึง 45%
                </span>
                <span className="text-xs text-brand-orange font-semibold">รายปี</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">Premium Yearly</h3>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-white">฿3,890</span>
                <span className="text-slate-400 text-sm">/ ปี</span>
              </div>
              <p className="text-xs text-brand-orange/90 mt-2 font-medium">(เฉลี่ยเพียงเดือนละ 324 บาทเท่านั้น)</p>

              <ul className="space-y-3 mt-6 text-sm text-slate-200">
                <li className="flex items-center gap-2.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>เข้าเรียนได้<strong>ทุกคอร์ส (Standard + Premium)</strong></span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>ดาวน์โหลด<strong>ซอร์สโค้ดโปรเจกต์ทั้งหมด</strong></span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>รับสิทธิ์ใช้งาน <strong>MCP Server & API Key</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>เข้ากลุ่มพิเศษและถามตอบกับผู้สอนโดยตรง</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>ใบประกาศนียบัตรรับรองการสำเร็จหลักสูตร</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/checkout?plan=yearly"
                className="w-full py-3.5 px-4 text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-full text-center block tactile-button-primary transition-all duration-150 active:scale-[0.98]"
              >
                สมัครแผนรายปี (คุ้มที่สุด)
              </Link>
            </div>
          </div>

          {/* Plan 3: Lifetime VIP */}
          <div className="bg-slate-900/90 rounded-2xl p-8 border border-slate-800 text-white flex flex-col justify-between tactile-card hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30">
                  จ่ายครั้งเดียวจบ
                </span>
                <span className="text-xs text-slate-400">ตลอดชีพ</span>
              </div>
              <h3 className="text-xl font-bold text-white">Lifetime VIP</h3>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-white">฿6,990</span>
                <span className="text-slate-400 text-sm">ครั้งเดียว</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">สมาชิกถาวรตลอดชีพ ไม่ต้องต่ออายุรายปีอีกต่อไป</p>

              <ul className="space-y-3 mt-6 text-sm text-slate-300">
                <li className="flex items-center gap-2.5 font-medium text-white">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>เข้าถึงทุกสิ่งที่มีในปัจจุบัน และ<strong>ในอนาคต</strong></span>
                </li>
                <li className="flex items-center gap-2.5 font-medium text-white">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>สิทธิ์การใช้งาน MCP Server ระดับไม่จำกัด</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>ส่วนลดพิเศษ 30% สำหรับการอบรม On-site</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>ตราสัญลักษณ์ VIP Member ในระบบ</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/checkout?plan=lifetime"
                className="w-full py-3 px-4 text-sm font-semibold rounded-full bg-slate-800 hover:bg-slate-700 text-white text-center block transition-all border border-slate-700 tactile-button-secondary"
              >
                ปลดล็อกสิทธิ์ตลอดชีพ
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. INSTRUCTOR AUTHORITY & STORY (Inspired by DesignMeee's Instructor)
      ========================================================================= */}
      <InstructorSection />

      {/* =========================================================================
          6. FREQUENTLY ASKED QUESTIONS (FAQ Accordion - Conversion Booster)
      ========================================================================= */}
      <FaqSection />

      {/* =========================================================================
          7. ON-SITE WORKSHOP & AGENCY BANNER (Clear CTA Services)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: On-site Training */}
          <div className="bg-slate-900/90 text-white rounded-2xl p-8 border border-slate-800 flex flex-col justify-between tactile-card">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30">
                <Users className="w-3.5 h-3.5" /> Private Workshop
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                อบรม AI กรุงเทพฯ (กทม.) <br />
                <span className="text-brand-emerald">Private Training 2 วันเต็ม</span>
              </h3>
              <p className="text-sm text-slate-300 font-normal leading-relaxed">
                หลักสูตรจับมือทำตัวต่อตัว สำหรับผู้บริหาร ผู้ประกอบการ หรือทีมงาน เดินทางสะดวกติดแนวรถไฟฟ้า มีอุปกรณ์ให้พร้อม เลี้ยงอาหารและเบรก พร้อมรับสิทธิ์สมาชิกบุฟเฟต์ออนไลน์แถมฟรี
              </p>
            </div>
            <div className="pt-8">
              <Link
                href="/training"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-brand-emerald hover:bg-emerald-600 text-slate-950 transition-colors shadow-lg"
              >
                <span>จองรอบเรียน & ดูรายละเอียด</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Dev Agency */}
          <div className="bg-slate-900/90 text-white rounded-2xl p-8 border border-slate-800 flex flex-col justify-between tactile-card">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-orange/10 text-brand-orange border border-brand-orange/30">
                <Briefcase className="w-3.5 h-3.5" /> Turnkey Solutions
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                รับพัฒนาเว็บไซต์ & ซอฟต์แวร์ <br />
                <span className="text-brand-orange">ด้วย AI และเทคโนโลยีล่าสุด</span>
              </h3>
              <p className="text-sm text-slate-300 font-normal leading-relaxed">
                ไม่มีเวลาทำเอง? ทีมงานของเรารับสร้าง Web Application, บอทตอบแชท AI, ระบบ CRM และระบบ Automation ส่งงานไว ได้มาตรฐาน ปลอดภัย
              </p>
            </div>
            <div className="pt-8">
              <Link
                href="/agency"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-brand-orange hover:bg-brand-orange-hover text-white transition-colors tactile-button-primary"
              >
                <span>ขอใบเสนอราคา / ดูผลงาน</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

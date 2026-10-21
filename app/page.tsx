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
  Briefcase
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      
      {/* =========================================================================
          1. HERO SECTION (สไตล์ Udemy + อัตลักษณ์มงคล 60-30-10)
      ========================================================================= */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-b from-slate-900 via-brand-slate to-slate-900 text-white overflow-hidden">
        {/* Glow Gradients Background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-emerald/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-4 h-4 text-brand-orange" />
                <span>AI Buffet Subscription — เรียนไม่อั้น ปลดล็อกทุกระบบ</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight text-white">
                เรียนใช้ <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-400 to-brand-emerald">AI สร้างงานได้จริง</span> <br />
                เติมเต็มทุกไอเดียสู่ธุรกิจ
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
                เข้าถึงคลังคอร์ส AI ครบวงจร, ซอร์สโค้ดโปรเจกต์พร้อมรัน, เครื่องมือทุ่นแรง และระบบควบคุมสิทธิ์ Agentic AI ในแพ็กเกจเดียว ไม่ต้องจ่ายแยกรายคอร์ส
              </p>

              {/* Skill Tags */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
                {["Claude Masterclass", "Vibe Coding", "n8n Automation", "AI Agents & MCP", "LINE Bot AI", "Midjourney & Video"].map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700 hover:border-brand-emerald transition-colors">
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/pricing"
                  className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange-hover hover:to-amber-600 rounded-full shadow-lg shadow-brand-orange/30 hover:shadow-brand-orange/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  <span>สมัครบุฟเฟต์เริ่มต้น 599.-</span>
                </Link>

                <Link
                  href="/courses"
                  className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-full transition-all flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-5 h-5 text-brand-emerald" />
                  <span>ทดลองเรียนคอร์สฟรี</span>
                </Link>
              </div>

              {/* Trust Metrics Bar */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800 text-center lg:text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">60+</div>
                  <div className="text-xs text-slate-400">คอร์ส AI คุณภาพสูง</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-brand-emerald">25+</div>
                  <div className="text-xs text-slate-400">โปรเจกต์พร้อมซอร์สโค้ด</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-brand-orange">4.9 ★</div>
                  <div className="text-xs text-slate-400">คะแนนความพึงพอใจ</div>
                </div>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/80 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-brand-emerald animate-pulse"></span>
                    <span className="text-xs font-semibold text-slate-300">Live AI Buffet Hub</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
                    PREMIUM UNLOCKED
                  </span>
                </div>

                {/* Mockup Card Items */}
                <div className="space-y-3.5 my-5">
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3.5 hover:border-brand-emerald/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-bold">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">AI Game Developer Masterclass</div>
                      <div className="text-xs text-slate-400">8 ตอน • มีไฟล์แนบ Workshop</div>
                    </div>
                    <span className="text-xs font-bold text-brand-emerald">พร้อมเรียน</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3.5 hover:border-brand-emerald/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">OmniVoice & Line CRM Code</div>
                      <div className="text-xs text-slate-400">ซอร์สโค้ดสำเร็จรูป + คู่มือรัน</div>
                    </div>
                    <span className="text-xs font-bold text-indigo-400">แจกโค้ด</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3.5 hover:border-brand-emerald/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center font-bold">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">Classroom Toolkit MCP Server</div>
                      <div className="text-xs text-slate-400">ระบบคุมสิทธิ์ Agentic AI License</div>
                    </div>
                    <span className="text-xs font-bold text-brand-orange">Active Key</span>
                  </div>
                </div>

                {/* Footer of Card */}
                <div className="pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
                  <span>สถานะสมาชิก: <strong className="text-white">Active</strong></span>
                  <span className="text-brand-emerald flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> ปลอดภัย ไร้ N+1 Query
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          2. PRICING BUFFET SECTION (3 แพ็กเกจชัดเจน รายเดือน-รายปี-ตลอดชีพ)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>เข้าถึงทุกอย่างในแพ็กเดียว</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-slate">
            เลือกแพ็กเกจบุฟเฟต์ที่คุ้มค่าที่สุดสำหรับคุณ
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            ไม่มีข้อผูกมัด ยกเลิกเมื่อไหร่ก็ได้ หรือเลือกเหมาตลอดชีพเพื่อความคุ้มค่าสูงสุด
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: Monthly */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  เริ่มต้นสบายกระเป๋า
                </span>
                <span className="text-xs text-slate-400">รายเดือน</span>
              </div>
              <h3 className="text-xl font-bold text-brand-slate">Standard Monthly</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-brand-slate">฿599</span>
                <span className="text-slate-500 text-sm">/ เดือน</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">เหมาะสำหรับผู้ที่ต้องการทดลองเรียนและสร้างพื้นฐาน AI</p>

              <ul className="space-y-3 mt-6 text-sm text-slate-700">
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
                className="w-full py-3 px-4 text-sm font-semibold rounded-2xl border-2 border-slate-300 hover:border-brand-emerald text-slate-700 hover:text-brand-emerald text-center block transition-colors"
              >
                เลือกแผนรายเดือน
              </Link>
            </div>
          </div>

          {/* Card 2: Yearly (Recommended Highlight - Glow Orange) */}
          <div className="bg-white rounded-3xl p-8 border-2 border-brand-orange shadow-2xl shadow-brand-orange/15 relative flex flex-col justify-between transform md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-orange to-amber-500 text-white text-xs font-bold uppercase tracking-wide shadow-md">
              ★ แนะนำยอดนิยม คุ้มค่าที่สุด
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-orange/10 text-brand-orange">
                  ประหยัดถึง 45%
                </span>
                <span className="text-xs text-brand-orange font-semibold">รายปี</span>
              </div>
              <h3 className="text-2xl font-extrabold text-brand-slate">Premium Yearly</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-brand-slate">฿3,890</span>
                <span className="text-slate-500 text-sm">/ ปี</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">(เฉลี่ยเพียงเดือนละ 324 บาทเท่านั้น)</p>

              <ul className="space-y-3 mt-6 text-sm text-slate-700">
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
                className="w-full py-3.5 px-4 text-sm font-bold text-white bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange-hover hover:to-amber-600 rounded-2xl text-center block shadow-lg shadow-brand-orange/30 transition-all hover:scale-[1.02]"
              >
                สมัครแผนรายปี (คุ้มที่สุด)
              </Link>
            </div>
          </div>

          {/* Card 3: Lifetime (เหมาตลอดชีพ) */}
          <div className="bg-gradient-to-b from-brand-slate to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30">
                  จ่ายครั้งเดียวจบ
                </span>
                <span className="text-xs text-slate-400">ตลอดชีพ</span>
              </div>
              <h3 className="text-xl font-bold text-white">Lifetime VIP</h3>
              <div className="mt-4 flex items-baseline gap-1">
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
                className="w-full py-3 px-4 text-sm font-semibold rounded-2xl bg-white hover:bg-slate-100 text-brand-slate text-center block transition-colors"
              >
                ปลดล็อกสิทธิ์ตลอดชีพ
              </Link>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          3. COURSE CATALOG (สไตล์ UDEMY CARDS พร้อม Rating & Badges)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-emerald uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>คอร์สเรียนแนะนำ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-slate">
              คอร์สเรียน AI มาใหม่และยอดนิยมสูงสุด
            </h2>
          </div>
          <Link
            href="/courses"
            className="text-sm font-semibold text-brand-emerald hover:text-brand-emerald-dark inline-flex items-center gap-1.5 group"
          >
            <span>ดูคอร์สทั้งหมด (60+)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Udemy Course Grid (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Course 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-brand-emerald/40 transition-all flex flex-col group">
            <div className="relative aspect-video bg-slate-900 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <div className="absolute top-3 left-3 z-20">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-brand-orange text-white uppercase tracking-wider shadow">
                  PREMIUM
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-xs text-white">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 8.5 ชม.</span>
                <span>8 ตอนเรียน</span>
              </div>
              {/* Fallback image cover */}
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500 font-bold group-hover:scale-105 transition-transform duration-300">
                AI Game Developer
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-brand-emerald uppercase tracking-wider">Game & Vibe Coding</span>
                <h3 className="text-sm font-bold text-brand-slate leading-snug group-hover:text-brand-emerald transition-colors line-clamp-2 mt-1">
                  AI Game Developer: สร้างเกมด้วย AI ใครก็ทำได้ พร้อมซอร์สโค้ด MMO
                </h3>
                <p className="text-xs text-slate-500 mt-1">AI Academy Team</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-xs font-extrabold text-amber-500">4.9</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">(428 รีวิว)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-emerald-light text-brand-emerald-dark">
                  ฟรีในบุฟเฟต์
                </span>
                <Link
                  href="/courses/ai-game-developer"
                  className="text-xs font-bold text-slate-700 hover:text-brand-orange flex items-center gap-1"
                >
                  เข้าเรียน <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Course 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-brand-emerald/40 transition-all flex flex-col group">
            <div className="relative aspect-video bg-slate-900 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <div className="absolute top-3 left-3 z-20">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-brand-emerald text-white uppercase tracking-wider shadow">
                  STANDARD
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-xs text-white">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 6.0 ชม.</span>
                <span>12 ตอนเรียน</span>
              </div>
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500 font-bold group-hover:scale-105 transition-transform duration-300">
                Claude Masterclass
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">AI Coding & Prompt</span>
                <h3 className="text-sm font-bold text-brand-slate leading-snug group-hover:text-brand-emerald transition-colors line-clamp-2 mt-1">
                  Claude Masterclass: เจาะลึกการสั่ง Claude Code ให้เขียนระบบแทนคุณ
                </h3>
                <p className="text-xs text-slate-500 mt-1">AI Academy Team</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-xs font-extrabold text-amber-500">4.8</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">(890 รีวิว)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-emerald-light text-brand-emerald-dark">
                  ฟรีในบุฟเฟต์
                </span>
                <Link
                  href="/courses/claude-masterclass"
                  className="text-xs font-bold text-slate-700 hover:text-brand-orange flex items-center gap-1"
                >
                  เข้าเรียน <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Course 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-brand-emerald/40 transition-all flex flex-col group">
            <div className="relative aspect-video bg-slate-900 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <div className="absolute top-3 left-3 z-20">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-brand-orange text-white uppercase tracking-wider shadow">
                  PREMIUM
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-xs text-white">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 10.0 ชม.</span>
                <span>15 ตอนเรียน</span>
              </div>
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500 font-bold group-hover:scale-105 transition-transform duration-300">
                n8n Automation Pro
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider">Workflow Automation</span>
                <h3 className="text-sm font-bold text-brand-slate leading-snug group-hover:text-brand-emerald transition-colors line-clamp-2 mt-1">
                  n8n Automation Workflows: ประกอบระบบดูดข้อมูลและยิงแชท LINE อัตโนมัติ
                </h3>
                <p className="text-xs text-slate-500 mt-1">AI Academy Team</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-xs font-extrabold text-amber-500">4.9</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">(612 รีวิว)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-emerald-light text-brand-emerald-dark">
                  ฟรีในบุฟเฟต์
                </span>
                <Link
                  href="/courses/n8n-automation"
                  className="text-xs font-bold text-slate-700 hover:text-brand-orange flex items-center gap-1"
                >
                  เข้าเรียน <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Course 4 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-brand-emerald/40 transition-all flex flex-col group">
            <div className="relative aspect-video bg-slate-900 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <div className="absolute top-3 left-3 z-20">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-brand-emerald text-white uppercase tracking-wider shadow">
                  STANDARD
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-xs text-white">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 5.0 ชม.</span>
                <span>9 ตอนเรียน</span>
              </div>
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500 font-bold group-hover:scale-105 transition-transform duration-300">
                AI Content & Video
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-teal-600 uppercase tracking-wider">Content Creation</span>
                <h3 className="text-sm font-bold text-brand-slate leading-snug group-hover:text-brand-emerald transition-colors line-clamp-2 mt-1">
                  สร้างช่อง YouTube & TikTok ด้วย AI คลิปสั้นปังใน 10 นาที
                </h3>
                <p className="text-xs text-slate-500 mt-1">AI Academy Team</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-xs font-extrabold text-amber-500">4.8</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">(1,040 รีวิว)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-emerald-light text-brand-emerald-dark">
                  ฟรีในบุฟเฟต์
                </span>
                <Link
                  href="/courses/ai-content-video"
                  className="text-xs font-bold text-slate-700 hover:text-brand-orange flex items-center gap-1"
                >
                  เข้าเรียน <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          4. SOURCE CODE & PROJECTS HUB PREVIEW (จุดขายดาวน์โหลดโค้ดจริง)
      ========================================================================= */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                <Code2 className="w-4 h-4" />
                <span>ซอร์สโค้ดพร้อมใช้</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-slate">
                ไม่ได้มีแค่คลิปสอน — แต่แจกซอร์สโค้ดโปรเจกต์พร้อมรัน
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1.5 group"
            >
              <span>ดูโปรเจกต์ทั้งหมด (25+)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                  LINE AI Bot
                </span>
                <span className="text-xs font-medium text-brand-emerald flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> ฟรีสำหรับสมาชิก
                </span>
              </div>
              <h3 className="font-bold text-brand-slate text-base">ระบบบันทึกคำสั่งซื้อ + แจ้งเตือน LINE อัตโนมัติ</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                โค้ด Node.js + Supabase + LINE Messaging API เชื่อมกับ Google Sheets ใช้งานได้จริงในร้านค้า
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                  Chrome Extension
                </span>
                <span className="text-xs font-medium text-brand-emerald flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> ฟรีสำหรับสมาชิก
                </span>
              </div>
              <h3 className="font-bold text-brand-slate text-base">SP X Extension ดึงข้อมูลสินค้า Shopee</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                ส่วนขยายเบราว์เซอร์สแกนและดึงราคาสินค้า, ยอดขาย และคีย์เวิร์ด นำไปวิเคราะห์การตลาดได้ทันที
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-600 border border-purple-100">
                  Agentic AI
                </span>
                <span className="text-xs font-medium text-brand-emerald flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> ฟรีสำหรับสมาชิก
                </span>
              </div>
              <h3 className="font-bold text-brand-slate text-base">Classroom Toolkit MCP Server</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                ระบบเซิร์ฟเวอร์ MCP สำหรับเชื่อม Claude Desktop เข้ากับชุดข้อมูลชั้นเรียน พร้อมระบบ Token เช็คสิทธิ์
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          5. ON-SITE WORKSHOP & AGENCY BANNER (บริการเสริมสร้างรายได้)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: On-site Training */}
          <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30">
                <Users className="w-3.5 h-3.5" /> Private Workshop
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                อบรม AI กรุงเทพฯ (กทม.) <br />
                <span className="text-brand-emerald">Private Training 2 วันเต็ม</span>
              </h3>
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                หลักสูตรจับมือทำตัวต่อตัว สำหรับผู้บริหาร ผู้ประกอบการ หรือทีมงาน เดินทางสะดวกติดแนวรถไฟฟ้า มีอุปกรณ์ให้พร้อม เลี้ยงอาหารและเบรก พร้อมรับสิทธิ์สมาชิกบุฟเฟต์ออนไลน์แถมฟรี
              </p>
            </div>
            <div className="pt-8 relative z-10">
              <Link
                href="/training"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-brand-emerald hover:bg-brand-emerald-dark text-slate-950 transition-colors shadow-lg"
              >
                <span>จองรอบเรียน & ดูรายละเอียด</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Dev Agency */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 border border-slate-800 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
                <Briefcase className="w-3.5 h-3.5" /> Turnkey Solutions
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                รับพัฒนาเว็บไซต์ & ซอฟต์แวร์ <br />
                <span className="text-brand-orange">ด้วย AI และเทคโนโลยีล่าสุด</span>
              </h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                ไม่มีเวลาทำเอง? ทีมงานของเรารับสร้าง Web Application, บอทตอบแชท AI, ระบบ CRM และระบบ Automation ส่งงานไว ได้มาตรฐาน ปลอดภัย
              </p>
            </div>
            <div className="pt-8 relative z-10">
              <Link
                href="/agency"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-brand-orange hover:bg-brand-orange-hover text-white transition-colors shadow-lg"
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

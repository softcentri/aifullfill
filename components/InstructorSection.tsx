import React from "react";
import Link from "next/link";
import { ShieldCheck, Award, Users, BookOpen, ArrowRight, CheckCircle2, Terminal } from "lucide-react";

export function InstructorSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 sm:p-12 tactile-card relative overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Instructor Profile & Photo Frame */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            <div className="relative">
              {/* Outer Glow & Border Frame */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-slate-800 border-2 border-brand-emerald/40 overflow-hidden shadow-2xl relative flex items-center justify-center">
                {/* Fallback Graphic Avatar */}
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center text-slate-300">
                  <Terminal className="w-16 h-16 text-brand-emerald mb-2" />
                  <span className="font-extrabold text-xl text-white">อาจารย์อั๋น</span>
                  <span className="text-xs text-slate-400">AI Architect & Founder</span>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-slate-950 border border-brand-emerald text-brand-emerald text-xs font-bold flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified AI Instructor</span>
              </div>
            </div>

            {/* Quick Stats Below Photo */}
            <div className="grid grid-cols-3 gap-4 mt-8 w-full border-t border-slate-800/80 pt-5 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">10+ ปี</div>
                <div className="text-[11px] text-slate-400 mt-0.5">ประสบการณ์ไอที</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-brand-emerald">60+</div>
                <div className="text-[11px] text-slate-400 mt-0.5">คอร์สที่สร้างเอง</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-brand-orange">10,000+</div>
                <div className="text-[11px] text-slate-400 mt-0.5">ผู้เรียนในชุมชน</div>
              </div>
            </div>
          </div>

          {/* Right Column: Instructor Story & Philosophy */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>ผู้ถ่ายทอดความรู้เบื้องหลัง aifullfill.com</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              “ไม่สอนทฤษฎีเลื่อนลอย ทุกบทเรียนต้องเปิดโค้ดจริง และนำไปสร้างเงินได้จริง”
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              ผมเชื่อว่าการเรียน AI ในยุคนี้ ไม่ใช่แค่การพิมพ์สั่ง Prompt เล่นๆ แล้วจบไป แต่คือการฝึกให้คุณเป็น 
              <strong> ผู้ควบคุม AI (AI Conductor)</strong> ที่สามารถสั่ง Agent เขียนโค้ดระบบจริง, ประกอบ Workflow อัตโนมัติ, 
              และมีทรัพย์สินทางปัญญาเป็นของตัวเอง
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-200">
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-brand-emerald flex-shrink-0 mt-0.5" />
                <span>
                  <strong>เน้นสถาปัตยกรรมระดับโปรดักชัน:</strong> ไม่มีโค้ดหลุด ไม่มี N+1 Query สอนวิธีเชื่อม Supabase, Next.js, และ Local AI อย่างถูกต้อง
                </span>
              </div>
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-brand-emerald flex-shrink-0 mt-0.5" />
                <span>
                  <strong>แจกซอร์สโค้ดเต็ม 100%:</strong> ไม่กั๊กไฟล์ ทุกโปรเจกต์มี Git Repository พร้อมรัน และนำไปต่อยอดรับงานลูกค้าได้ทันที
                </span>
              </div>
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-brand-emerald flex-shrink-0 mt-0.5" />
                <span>
                  <strong>อัปเดตบทเรียนตามทันโมเดลใหม่ตลอด:</strong> เมื่อมี Claude 3.7, DeepSeek V3 หรือ Antigravity ฟีเจอร์ใหม่ เนื้อหาจะได้รับการอัปเกรดเข้าสู่ระบบบุฟเฟต์ทันที
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/courses"
                className="w-full sm:w-auto px-7 py-3 rounded-full text-xs font-semibold bg-brand-emerald hover:bg-emerald-600 text-slate-950 transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>สำรวจคอร์สทั้งหมดของผู้สอน</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/training"
                className="w-full sm:w-auto px-7 py-3 rounded-full text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5 tactile-button-secondary"
              >
                <span>จองคิวอบรมตัวต่อตัว</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

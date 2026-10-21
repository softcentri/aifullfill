"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Laptop, 
  Coffee, 
  Award, 
  MessageSquare, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Check
} from "lucide-react";

export default function TrainingPage() {
  const [learningMode, setLearningMode] = useState<"onsite" | "online">("onsite");

  return (
    <div className="bg-brand-off-white min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* =========================================================================
            1. HEADER BANNER (เลือกคอร์สที่ใช่กับคุณ)
        ========================================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-brand-slate rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800 text-center max-w-4xl mx-auto">
          <div className="absolute right-0 top-0 w-80 h-80 bg-brand-emerald/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-emerald/20 text-brand-emerald text-xs font-bold uppercase tracking-wider border border-brand-emerald/30">
              <Users className="w-4 h-4 text-brand-orange" />
              <span>Private Coaching & Corporate Training</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              เลือกคอร์สที่ใช่กับคุณ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-300 to-brand-emerald">
                อบรม AI ตัวต่อตัว On-site กรุงเทพฯ (กทม.)
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
              เหมาะสำหรับผู้บริหาร เจ้าของธุรกิจ หรือทีมงานที่ต้องการทางลัดในการนำ AI ไปประยุกต์ใช้ในองค์กร จับมือทำจริง 2 วันเต็ม มีอุปกรณ์ให้พร้อม
            </p>

            {/* Toggle Switch On-site vs Online */}
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 mt-4">
              <button
                onClick={() => setLearningMode("onsite")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  learningMode === "onsite"
                    ? "bg-brand-emerald text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>อบรม On-site กทม. (จับมือทำ)</span>
              </button>
              <button
                onClick={() => setLearningMode("online")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  learningMode === "online"
                    ? "bg-brand-orange text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Private Online สดผ่าน Zoom</span>
              </button>
            </div>
          </div>
        </div>


        {/* =========================================================================
            2. FEATURED WORKSHOPS (2 คอร์สท็อป: Vibe Coding vs AI for Business)
        ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Workshop 1: Vibe Coding */}
          <div className="bg-white rounded-3xl border-2 border-brand-emerald/40 overflow-hidden shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between group">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-emerald-light text-brand-emerald-dark">
                  หลักสูตรยอดนิยมสูงสุด
                </span>
                <span className="text-xs font-semibold text-slate-400">2 วันเต็ม (10:00 - 17:00)</span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-brand-slate group-hover:text-brand-emerald transition-colors">
                  Vibe Coding & AI Agent Masterclass
                </h3>
                <p className="text-xs text-slate-500 mt-1">สร้าง Fullstack Web App และรันระบบ Multi-Agent ด้วย AI</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>เขียน Web App ทันสมัยด้วย Next.js, Supabase, Tailwind</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>สร้าง MCP Server ควบคุมสิทธิ์ AI ป้องกันโค้ดหลุด</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>สั่ง Claude 3.7 Sonnet และ Cursor เขียนโค้ดสเกลจริง</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>แจกซอร์สโค้ดโปรเจกต์พร้อมรัน 3 ระบบเต็ม</span>
                </div>
              </div>

              {/* Price comparison */}
              <div className="pt-2 flex items-baseline justify-between border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block">ราคาอบรม On-site กทม.</span>
                  <span className="text-3xl font-extrabold text-brand-slate">฿9,900</span>
                  <span className="text-xs text-slate-500 ml-1">/ ท่าน</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">เรียนออนไลน์สด</span>
                  <span className="text-xl font-bold text-slate-600">฿5,900</span>
                </div>
              </div>
            </div>

            <div className="p-8 pt-0">
              <a
                href="https://line.me"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl text-xs font-bold text-slate-950 bg-brand-emerald hover:bg-brand-emerald-dark transition-all text-center block shadow-md hover:scale-[1.01]"
              >
                จองรอบเรียน Vibe Coding กทม. ↗
              </a>
            </div>
          </div>

          {/* Workshop 2: AI for Business */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                  สำหรับผู้ประกอบการ
                </span>
                <span className="text-xs font-semibold text-slate-400">1 วันเต็ม (10:00 - 17:00)</span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-brand-slate group-hover:text-indigo-600 transition-colors">
                  AI for Business & Work Automation
                </h3>
                <p className="text-xs text-slate-500 mt-1">เจาะลึกการใช้ AI ลดต้นทุน เพิ่มยอดขาย และสร้างบอททำงานอัตโนมัติ</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>สร้างบอท LINE OA ปิดการขายอัตโนมัติด้วย ChatGPT API</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>ต่อระบบดูดข้อมูลและบันทึกลง Google Sheets ด้วย n8n</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>ผลิตคลิปวิดีโอสั้น TikTok & Reels 30 คลิปใน 1 ชั่วโมง</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>แถมฟรีคลัง Prompt ปิดการขายมากกว่า 100+ สูตร</span>
                </div>
              </div>

              {/* Price comparison */}
              <div className="pt-2 flex items-baseline justify-between border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block">ราคาอบรม On-site กทม.</span>
                  <span className="text-3xl font-extrabold text-brand-slate">฿4,900</span>
                  <span className="text-xs text-slate-500 ml-1">/ ท่าน</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">เรียนออนไลน์สด</span>
                  <span className="text-xl font-bold text-slate-600">฿2,500</span>
                </div>
              </div>
            </div>

            <div className="p-8 pt-0">
              <a
                href="https://line.me"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl text-xs font-bold text-white bg-brand-slate hover:bg-slate-800 transition-all text-center block shadow-md hover:scale-[1.01]"
              >
                จองรอบเรียน AI for Business กทม. ↗
              </a>
            </div>
          </div>

        </div>


        {/* =========================================================================
            3. ON-SITE AMENITIES (4 จุดเด่นของการเรียน On-site กทม.)
        ========================================================================= */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-slate">
              สิทธิประโยชน์การเรียน On-site กรุงเทพฯ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">เราดูแลทุกรายละเอียด เพื่อให้คุณโฟกัสกับการเรียนรู้ได้อย่างเต็มที่</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center mx-auto">
                <Laptop className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-brand-slate">อุปกรณ์พร้อมใช้</h4>
              <p className="text-xs text-slate-500">มีคอมพิวเตอร์และอินเทอร์เน็ตความเร็วสูงพร้อม หรือนำเครื่องส่วนตัวมาได้</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-brand-slate">ปรึกษาได้ตลอดชีพ</h4>
              <p className="text-xs text-slate-500">มีกลุ่ม LINE ส่วนตัว ถามตอบข้อสงสัยกับผู้สอนหลังจบคอร์สได้ต่อเนื่อง</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-brand-slate">ใบประกาศนียบัตร</h4>
              <p className="text-xs text-slate-500">รับ Certificate รับรองการผ่านการอบรมเพื่อเสริมโปรไฟล์ธุรกิจ</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Coffee className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-brand-slate">อาหาร & เบรก</h4>
              <p className="text-xs text-slate-500">เลี้ยงอาหารกลางวันบุฟเฟต์ และบริการ Coffee Break ขนมเครื่องดื่มไม่อั้น</p>
            </div>
          </div>
        </div>


        {/* =========================================================================
            4. LOCATION & MAP (สถานที่จัดอบรม กทม.)
        ========================================================================= */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-brand-emerald uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Training Center Bangkok
              </span>
              <h3 className="text-2xl font-extrabold text-brand-slate mt-1">
                สถานที่จัดอบรม (กรุงเทพมหานคร)
              </h3>
              <p className="text-xs text-slate-500">เดินทางสะดวกสบาย ติดแนวรถไฟฟ้า BTS/MRT พร้อมที่จอดรถรองรับ</p>
            </div>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors self-start sm:self-auto"
            >
              <span>เปิดใน Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Map Placeholder */}
            <div className="lg:col-span-7 bg-slate-100 rounded-2xl h-64 border border-slate-200 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <MapPin className="w-10 h-10 text-brand-orange mb-2 animate-bounce" />
              <div className="font-bold text-sm text-slate-700">aifullfill Training Center @ Bangkok</div>
              <div className="text-xs text-slate-500 mt-1">พิกัดติดแนวรถไฟฟ้า BTS / MRT ใจกลางกรุงเทพฯ</div>
            </div>

            {/* Travel Info */}
            <div className="lg:col-span-5 space-y-4 text-xs text-slate-600">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="font-bold text-sm text-brand-slate">การเดินทาง:</div>
                <div>🚇 <strong>รถไฟฟ้า BTS:</strong> ลงสถานีใกล้เคียง ต่อเดินเพียง 3 นาที</div>
                <div>🚗 <strong>รถยนต์ส่วนตัว:</strong> มีอาคารจอดรถรองรับฟรีตลอดวัน</div>
                <div>🕒 <strong>รอบเวลาอบรม:</strong> เสาร์-อาทิตย์ (10:00 - 17:00 น.)</div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald-dark font-medium">
                🎁 <strong>สิทธิพิเศษเฉพาะผู้เรียน On-site:</strong> แถมฟรีสิทธิ์สมาชิกบุฟเฟต์ออนไลน์ของ aifullfill.com มูลค่า 3,890 บาท เข้าเรียนทบทวนได้ตลอดชีพ!
              </div>
            </div>

          </div>
        </div>


        {/* =========================================================================
            5. FINAL CALL TO ACTION BOX (พร้อมเริ่มเรียนแล้วหรือยัง?)
        ========================================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-slate to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-5 border border-slate-800 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-orange/30">
            <Sparkles className="w-6 h-6" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold">
            พร้อมเริ่มเรียนและสร้างระบบ AI ของคุณหรือยัง?
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-light max-w-lg mx-auto">
            รับจำนวนจำกัดเพียง 6-8 ท่านต่อรอบ เพื่อการดูแลอย่างทั่วถึงแบบจับมือทำ ปรึกษาและจองรอบวันเรียนกับเราได้ทาง LINE
          </p>

          <div className="pt-2">
            <a
              href="https://line.me"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-slate-950 bg-gradient-to-r from-brand-emerald to-teal-400 hover:from-brand-emerald-dark hover:to-teal-500 transition-all shadow-lg hover:scale-105"
            >
              <span>ติดต่อสอบถาม & จองคอร์สผ่าน LINE</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Code2, 
  Wrench, 
  Users, 
  ArrowRight, 
  Clock, 
  Star, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Zap
} from "lucide-react";

export function PillarsTabSection() {
  const [activeTab, setActiveTab] = useState<"courses" | "code" | "tools" | "workshop">("courses");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
          <span>4 เสาหลักคลังความรู้ AI แบบครบวงจร</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          เลือกสำรวจตามเป้าหมายที่คุณต้องการพัฒนา
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          สลับดูคอร์สเรียน, ซอร์สโค้ดพร้อมรัน, เครื่องมือทุ่นแรง หรือเวิร์กช็อปจับมือทำตัวต่อตัว
        </p>
      </div>

      {/* 4 Interactive Tabs Bar */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 gap-2.5 no-scrollbar">
        {[
          { id: "courses", label: "คอร์สออนไลน์บุฟเฟต์", count: "60+", icon: BookOpen },
          { id: "code", label: "ซอร์สโค้ดโปรเจกต์", count: "25+", icon: Code2 },
          { id: "tools", label: "AI Gems & เครื่องมือ", count: "40+", icon: Wrench },
          { id: "workshop", label: "Private Training กทม.", count: "จำกัดรอบ", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-150 border ${
                isActive
                  ? "bg-slate-800 text-white border-brand-emerald shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] ring-1 ring-brand-emerald/40"
                  : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-brand-orange" : "text-slate-500"}`} />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                isActive ? "bg-brand-emerald/20 text-brand-emerald font-bold" : "bg-slate-800 text-slate-500"
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="mt-8 transition-all">
        
        {/* =================== TAB 1: COURSES =================== */}
        {activeTab === "courses" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {[
              {
                title: "AI Game Developer: สร้างเกมด้วย AI พร้อมซอร์สโค้ด MMO",
                hours: "8.5 ชม.",
                episodes: "8 ตอน",
                tier: "PREMIUM",
                rating: "4.9",
                slug: "ai-game-developer",
                category: "Game & Vibe Coding",
              },
              {
                title: "Claude Masterclass: เจาะลึกการสั่ง Claude Code ให้เขียนระบบแทนคุณ",
                hours: "6.0 ชม.",
                episodes: "12 ตอน",
                tier: "STANDARD",
                rating: "4.8",
                slug: "claude-masterclass",
                category: "AI Coding & Prompt",
              },
              {
                title: "n8n Automation Pro: สร้างระบบดูดข้อมูลและยิงแชท LINE อัตโนมัติ",
                hours: "10.0 ชม.",
                episodes: "15 ตอน",
                tier: "PREMIUM",
                rating: "4.9",
                slug: "n8n-automation",
                category: "Workflow Automation",
              },
            ].map((course, idx) => (
              <div 
                key={idx}
                className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between tactile-card hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-brand-emerald uppercase tracking-wider">
                      {course.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      course.tier === "PREMIUM" 
                        ? "bg-brand-orange/10 text-brand-orange border border-brand-orange/20" 
                        : "bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20"
                    }`}>
                      {course.tier}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-4">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.hours}</span>
                    <span>•</span>
                    <span>{course.episodes}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3 h-3 fill-current" /> {course.rating}
                    </span>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-brand-emerald font-medium">รวมในบุฟเฟต์</span>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="text-xs font-semibold text-slate-200 hover:text-brand-orange inline-flex items-center gap-1 transition-colors"
                  >
                    <span>เข้าเรียน</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =================== TAB 2: SOURCE CODE REPOS =================== */}
        {activeTab === "code" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {[
              {
                title: "LINE Bot E-Commerce Order System",
                desc: "ระบบรับออเดอร์ แจ้งเตือน LINE อัตโนมัติ บันทึกลง Supabase และ Google Sheets",
                tech: "Node.js + Supabase + LINE API",
                tag: "พร้อมรันจริง",
              },
              {
                title: "Shopee SP-X Data Scraper Extension",
                desc: "ส่วนขยายเบราว์เซอร์สแกนและดึงราคาสินค้า ยอดขาย และคีย์เวิร์ด นำไปวิเคราะห์การตลาด",
                tech: "Chrome Extension + TypeScript",
                tag: "อัปเดตตลอด",
              },
              {
                title: "Classroom Toolkit MCP Server",
                desc: "เซิร์ฟเวอร์ MCP สำหรับเชื่อมต่อ Claude Desktop เข้ากับคลังข้อมูลส่วนตัว พร้อม Token คุ้มครองสิทธิ์",
                tech: "Python + MCP Protocol",
                tag: "ใบอนุญาตใช้ได้ตลอดชีพ",
              },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between tactile-card hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                    <span className="text-xs text-brand-emerald flex items-center gap-1 font-medium">
                      <Download className="w-3.5 h-3.5" /> ซอร์สโค้ดเต็ม
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="mt-3 text-[11px] font-mono text-slate-500">
                    Stack: {item.tech}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">ฟรีสำหรับสมาชิก Premium</span>
                  <Link
                    href="/projects"
                    className="text-xs font-semibold text-slate-200 hover:text-brand-orange inline-flex items-center gap-1 transition-colors"
                  >
                    <span>ดูรายละเอียด</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =================== TAB 3: AI TOOLS & GEMS =================== */}
        {activeTab === "tools" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {[
              {
                title: "System Prompt ชุดเสก Web App",
                desc: "พร้อมโครงสร้างไฟล์และกฎกติกาเขียนโค้ด ให้ Desktop Agent สร้างเว็บให้ไม่หลุดธีม",
                type: "Prompt Architecture",
              },
              {
                title: "ComfyUI Workflow: แปลงรูปสินค้าเป็นภาพโฆษณาพรีเมียม",
                desc: "ไฟล์ JSON พร้อมลากวางใน ComfyUI รันฟรีบนเครื่องตัวเอง ไม่เสียเครดิตคลาวด์",
                type: "Workflow JSON",
              },
              {
                title: "Custom GPT: ผู้ช่วยเขียน E-Book ขายดี",
                desc: "โครงสร้างการเรียบเรียงบท สารบัญ และสาระสำคัญสำหรับผลิต E-book จบเล่มใน 1 วัน",
                type: "AI Agent Template",
              },
            ].map((tool, idx) => (
              <div 
                key={idx}
                className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between tactile-card hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                      {tool.type}
                    </span>
                    <span className="text-xs text-brand-emerald font-medium">คัดสรรแล้ว</span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">คัดลอกไปใช้ได้ทันที</span>
                  <Link
                    href="/tools"
                    className="text-xs font-semibold text-slate-200 hover:text-brand-orange inline-flex items-center gap-1 transition-colors"
                  >
                    <span>เปิดเครื่องมือ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =================== TAB 4: PRIVATE WORKSHOP =================== */}
        {activeTab === "workshop" && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 tactile-card animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30">
                  <Users className="w-3.5 h-3.5" /> Private 1-on-1 หรือ ทีมงาน 2 วันเต็ม
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  หลักสูตรอบรม AI กรุงเทพฯ (กทม.) — จับมือทำจนสร้างระบบสำเร็จ
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  เรียนกับผู้สอนโดยตรง ณ ห้องอบรมติดแนวรถไฟฟ้า มีคอมพิวเตอร์และอุปกรณ์ครบครัน เลี้ยงอาหารกลางวันและเบรกระดับพรีเมียม 
                  เน้นการนำ Agentic AI, Local LLM, และระบบ Automation ไปใช้งานกับธุรกิจจริงของคุณโดยเฉพาะ
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                    <span>แถมฟรี สมาชิกบุฟเฟต์ออนไลน์ Lifetime VIP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                    <span>ที่ปรึกษาต่อเนื่อง 30 วันหลังจบคอร์ส</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                    <span>มีใบเสนอราคาและออกใบเสร็จสำหรับบริษัทได้</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                    <span>ปรับแต่งเนื้อหาตามโจทย์ธุรกิจของผู้เรียน</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center bg-slate-950/80 border border-slate-800 rounded-xl p-6 text-center">
                <span className="text-xs text-slate-400">จองรอบเรียนเดือนนี้</span>
                <div className="text-3xl font-extrabold text-white mt-1">รับเพียง 4 ทีม</div>
                <p className="text-xs text-brand-orange mt-1">เหลือ 1 ที่นั่งสุดท้าย</p>
                <Link
                  href="/training"
                  className="mt-5 w-full py-3 px-4 rounded-full text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover tactile-button-primary transition-all text-center block"
                >
                  ดูรายละเอียด & กำหนดการ
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

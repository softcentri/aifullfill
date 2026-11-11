"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Crown,
  ArrowRight,
  Clock,
  Code2,
  BookOpen,
  KeyRound,
  HelpCircle,
  Check,
  X,
} from "lucide-react";

export default function PricingPage() {
  const comparisonRows = [
    {
      feature: "คอร์สกลุ่ม Standard (E-Book, ComfyUI, Video, Desktop Agent, Local AI)",
      standard: "เข้าเรียนได้ไม่จำกัด",
      yearly: "เข้าเรียนได้ไม่จำกัด",
      lifetime: "เข้าเรียนได้ไม่จำกัด (ตลอดชีพ)",
    },
    {
      feature: "คอร์สกลุ่ม Premium Exclusive (Vibe Coding Web App, Micro-Tools, Hermes Agent)",
      standard: false,
      yearly: "ปลดล็อกครบทุกคอร์ส",
      lifetime: "ปลดล็อกครบทุกคอร์ส + คอร์สใหม่ในอนาคต",
    },
    {
      feature: "ดาวน์โหลดคลังซอร์สโค้ดโปรเจกต์พร้อมรัน (25+ Projects)",
      standard: "เฉพาะระดับ Standard",
      yearly: "ดาวน์โหลดได้ทั้งหมด",
      lifetime: "ดาวน์โหลดได้ทั้งหมดตลอดชีพ",
    },
    {
      feature: "สิทธิ์ใช้งาน MCP Server & AI Agent API Key",
      standard: "1 เครื่อง (Standard Tools)",
      yearly: "2 เครื่อง (All Premium Tools)",
      lifetime: "สูงสุด 3 เครื่อง (VIP Unlimited)",
    },
    {
      feature: "ส่วนแบ่งรายได้พาร์ทเนอร์ (Affiliate Commission)",
      standard: "10% ทุกยอดซื้อ",
      yearly: "15% ทุกยอดซื้อ",
      lifetime: "25% สูงสุดตลอดชีพ",
    },
    {
      feature: "ระบบตรวจสลิปเบื้องต้น (Pre-Approved Instant Access)",
      standard: "เข้าเรียนได้ทันทีหลังอัปโหลดสลิป",
      yearly: "เข้าเรียนได้ทันทีหลังอัปโหลดสลิป",
      lifetime: "เข้าเรียนได้ทันทีหลังอัปโหลดสลิป",
    },
  ];

  return (
    <div className="bg-brand-slate text-slate-100 min-h-screen py-16 sm:py-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* =========================================================================
            1. HEADER & INSTANT PRE-APPROVAL BADGE
        ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-emerald/15 border border-brand-emerald/30 text-brand-emerald text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-brand-orange" />
            <span>Instant Pre-Approve — แจ้งโอนปุ๊บ ระบบตรวจสลิปเบื้องต้นเปิดคอร์สให้เรียนทันที</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            เลือกแพ็กเกจบุฟเฟต์ <span className="text-brand-orange">aifullfill</span> ที่เหมาะกับคุณ
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            ปลดล็อกคลังคอร์ส AI ครบวงจร ซอร์สโค้ดพร้อมใช้งาน และสิทธิ์เชื่อมต่อ MCP Server ในแพ็กเกจเดียว 
            ชำระผ่าน PromptPay QR หรือโอนผ่านธนาคาร พร้อมระบบตรวจสลิปเบื้องต้นอัตโนมัติไม่ต้องรอนาน
          </p>
        </div>

        {/* =========================================================================
            2. PRICING CARDS (3 TIERS)
        ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Plan 1: Standard Monthly */}
          <div className="bg-slate-900/90 rounded-3xl p-8 border border-slate-800 flex flex-col justify-between tactile-card hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  เริ่มต้นสบายกระเป๋า
                </span>
                <span className="text-xs text-slate-400">รายเดือน (30 วัน)</span>
              </div>
              <h2 className="text-xl font-bold text-white">Standard Monthly</h2>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-white">฿599</span>
                <span className="text-slate-400 text-sm">/ เดือน</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                เหมาะสำหรับผู้ที่ต้องการปูพื้นฐาน AI, ComfyUI, E-Book และ Local LLM
              </p>

              <ul className="space-y-3 mt-6 text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>เข้าเรียนคอร์สระดับ Standard ไม่จำกัด</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>ดาวน์โหลดไฟล์แนบและ Prompt ประจำบท</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>เข้าถึง AI Tools & Gems พื้นฐาน</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>รับสิทธิ์ Affiliate แนะนำเพื่อนรับ 10%</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/checkout?plan=monthly"
                className="w-full py-3.5 px-4 text-sm font-bold rounded-full border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-center flex items-center justify-center gap-2 transition-all tactile-button-secondary"
              >
                <span>สมัครแผนรายเดือน (฿599)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Plan 2: Premium Yearly (Recommended) */}
          <div className="bg-slate-900 rounded-3xl p-8 border-2 border-brand-orange relative flex flex-col justify-between shadow-2xl shadow-brand-orange/15 transform md:-translate-y-3">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-orange text-white text-xs font-extrabold uppercase tracking-wide shadow-md whitespace-nowrap">
              ★ แนะนำยอดนิยม • คุ้มค่าที่สุด
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                  ประหยัดถึง 45%
                </span>
                <span className="text-xs text-brand-orange font-semibold">รายปี (365 วัน)</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Premium Yearly</h2>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-white">฿3,890</span>
                <span className="text-slate-400 text-sm">/ ปี</span>
              </div>
              <p className="text-xs text-brand-orange/90 mt-2 font-medium">
                (เฉลี่ยเพียงเดือนละ 324 บาท ปลดล็อกทุกคอร์สและซอร์สโค้ด)
              </p>

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
                  <span>รับสิทธิ์ใช้งาน <strong>MCP Server & API Key (2 เครื่อง)</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>เข้ากลุ่ม LINE พิเศษและถามตอบกับผู้สอนโดยตรง</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>รับสิทธิ์ Affiliate แนะนำเพื่อนรับ 15%</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/checkout?plan=yearly"
                className="w-full py-4 px-4 text-sm font-extrabold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-full text-center flex items-center justify-center gap-2 tactile-button-primary shadow-lg shadow-brand-orange/25 transition-all"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>สมัครแผนรายปี (฿3,890)</span>
              </Link>
            </div>
          </div>

          {/* Plan 3: Lifetime VIP */}
          <div className="bg-slate-900/90 rounded-3xl p-8 border border-slate-800 text-white flex flex-col justify-between tactile-card hover:border-brand-emerald/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
                  จ่ายครั้งเดียวจบ
                </span>
                <span className="text-xs text-slate-400">ตลอดชีพ (Lifetime)</span>
              </div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Lifetime VIP</span>
                <Crown className="w-4 h-4 text-amber-400" />
              </h2>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-white">฿6,990</span>
                <span className="text-slate-400 text-sm">ครั้งเดียว</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                สมาชิกถาวรตลอดชีพ ไม่ต้องต่ออายุรายปีอีกต่อไป พร้อมสิทธิ์สูงสุดทุกด้าน
              </p>

              <ul className="space-y-3 mt-6 text-sm text-slate-300">
                <li className="flex items-center gap-2.5 font-medium text-white">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>เข้าถึงทุกคอร์สและซอร์สโค้ด <strong>ตลอดชีพ</strong></span>
                </li>
                <li className="flex items-center gap-2.5 font-medium text-white">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>สิทธิ์ใช้งาน MCP Server สูงสุด 3 เครื่องพร้อมกัน</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>ส่วนลดพิเศษ 30% สำหรับการอบรมตัวต่อตัว (On-site)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                  <span>รับสิทธิ์ Affiliate ระดับสูงสุด <strong>25% ตลอดชีพ</strong></span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/checkout?plan=lifetime"
                className="w-full py-3.5 px-4 text-sm font-bold rounded-full bg-brand-emerald hover:bg-brand-emerald-dark text-slate-950 text-center flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-emerald/20"
              >
                <Crown className="w-4 h-4" />
                <span>ปลดล็อกสิทธิ์ตลอดชีพ (฿6,990)</span>
              </Link>
            </div>
          </div>

        </div>

        {/* =========================================================================
            3. COMPARISON TABLE
        ========================================================================= */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 overflow-x-auto">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-white">ตารางเปรียบเทียบสิทธิ์แต่ละแพ็กเกจ</h3>
            <p className="text-xs text-slate-400">เปรียบเทียบความคุ้มค่าแบบชัดเจนก่อนตัดสินใจสมัคร</p>
          </div>

          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-4 pr-4 w-2/5">รายละเอียดสิทธิ์การใช้งาน</th>
                <th className="py-4 px-4 text-center">Standard (฿599/ด.)</th>
                <th className="py-4 px-4 text-center text-brand-orange">Premium (฿3,890/ปี)</th>
                <th className="py-4 pl-4 text-center text-brand-emerald">Lifetime VIP (฿6,990)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 pr-4 font-semibold text-slate-200">{row.feature}</td>
                  <td className="py-4 px-4 text-center text-slate-300">
                    {row.standard === false ? (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    ) : (
                      <span>{row.standard}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center font-semibold text-amber-300 bg-brand-orange/5">
                    {row.yearly}
                  </td>
                  <td className="py-4 pl-4 text-center font-semibold text-brand-emerald">
                    {row.lifetime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* =========================================================================
            4. HOW PRE-APPROVED SLIP VERIFICATION WORKS
        ========================================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-emerald uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-orange" />
              <span>ระบบชำระเงินอัจฉริยะ (Smart Slip Pre-Approval)</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              ไม่ต้องรอนาน! อัปโหลดสลิปปุ๊บ เข้าเรียนได้ทันที
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              เมื่อคุณโอนชำระเงินและอัปโหลดสลิปในหน้า Checkout ระบบจะทำการสแกน QR บนสลิป ตรวจสอบยอดเงิน และเช็คความซ้ำซ้อนอัตโนมัติ 
              หากข้อมูลถูกต้องครบถ้วน ระบบจะปรับสถานะเป็น <strong className="text-brand-emerald">Pre-Approved</strong> เพื่อเปิดสิทธิ์ให้คุณเข้าเรียนได้ทันที 
              จากนั้นผู้ดูแลระบบจะทำการตรวจสอบยืนยันขั้นสุดท้ายอีกครั้งในภายหลัง
            </p>
          </div>

          <Link
            href="/checkout?plan=yearly"
            className="px-7 py-4 rounded-full text-sm font-extrabold text-white bg-brand-orange hover:bg-brand-orange-hover tactile-button-primary flex items-center gap-2 flex-shrink-0 shadow-xl"
          >
            <span>ไปที่หน้าแจ้งชำระเงิน</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

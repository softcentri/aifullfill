import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-brand-slate text-slate-200 min-h-screen py-16 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าแรก</span>
        </Link>

        <div className="space-y-2 border-b border-slate-800 pb-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-emerald">
            <ShieldCheck className="w-4 h-4" />
            <span>PDPA & Data Privacy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            นโยบายความเป็นส่วนตัว (Privacy Policy)
          </h1>
          <p className="text-xs text-slate-400">อัปเดตล่าสุด: พฤศจิกายน 2026 • aifullfill.com</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-white">1. ข้อมูลที่เราจัดเก็บ</h2>
          <p>
            เรารวบรวมข้อมูลที่จำเป็นต่อการให้บริการระบบเรียนออนไลน์และระบบตรวจสอบสิทธิ์ ได้แก่ ชื่อ-นามสกุล, อีเมล, 
            ประวัติความก้าวหน้าในการเรียน, หลักฐานการชำระเงิน (สลิปโอนเงิน) และรหัสอ้างอิงอุปกรณ์สำหรับการใช้งาน MCP Server
          </p>

          <h2 className="text-base font-bold text-white">2. วัตถุประสงค์ในการใช้ข้อมูล</h2>
          <p>
            ข้อมูลของคุณถูกใช้เพื่อการยืนยันตัวตน, การตรวจสอบสลิปโอนเงินเพื่อเปิดสิทธิ์แพ็กเกจบุฟเฟต์, 
            การบันทึกความก้าวหน้าการเรียน และการป้องกันการละเมิดลิขสิทธิ์ซอร์สโค้ดและคีย์ API เท่านั้น 
            เราไม่นำข้อมูลส่วนบุคคลของคุณไปจำหน่ายหรือเผยแพร่ให้บุคคลภายนอกโดยเด็ดขาด
          </p>

          <h2 className="text-base font-bold text-white">3. ความปลอดภัยของข้อมูล</h2>
          <p>
            ข้อมูลทั้งหมดถูกจัดเก็บอย่างปลอดภัยด้วยระบบฐานข้อมูลที่มีการควบคุมสิทธิ์ระดับแถว (Row-Level Security) 
            และการเข้ารหัสตามมาตรฐานสากล
          </p>
        </div>
      </div>
    </div>
  );
}

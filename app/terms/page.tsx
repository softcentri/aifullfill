import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange">
            <FileText className="w-4 h-4" />
            <span>Terms of Service</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            เงื่อนไขการให้บริการ (Terms of Service)
          </h1>
          <p className="text-xs text-slate-400">อัปเดตล่าสุด: พฤศจิกายน 2026 • aifullfill.com</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-white">1. สิทธิ์การใช้งานบัญชีและเนื้อหา</h2>
          <p>
            บัญชีสมาชิก aifullfill.com เป็นสิทธิ์เฉพาะบุคคล ห้ามแบ่งปันรหัสผ่านหรือนำวิดีโอบทเรียนไปเผยแพร่ซ้ำหรือจำหน่ายต่อ 
            ส่วนซอร์สโค้ดโปรเจกต์ในระบบ สมาชิกสามารถนำไปดัดแปลงเพื่อใช้งานในธุรกิจหรือรับงานลูกค้าได้ตามสิทธิ์ของแพ็กเกจ
          </p>

          <h2 className="text-base font-bold text-white">2. ระบบตรวจสลิปเบื้องต้น (Pre-Approval) และการยืนยันชำระเงิน</h2>
          <p>
            เมื่อสมาชิกอัปโหลดสลิปโอนเงินและผ่านการตรวจเบื้องต้น ระบบจะเปิดสิทธิ์ให้เข้าเรียนทันที (Pre-Approved) 
            ทั้งนี้ทีมงานผู้ดูแลระบบจะทำการตรวจสอบยอดเงินจริงอีกครั้ง หากพบว่าเป็นสลิปที่ไม่ถูกต้องหรือสลิปปลอม 
            ทางระบบขอสงวนสิทธิ์ในการระงับบัญชีและยกเลิกสิทธิ์การเข้าถึงทันที
          </p>

          <h2 className="text-base font-bold text-white">3. การใช้งาน MCP Server & Device Lock</h2>
          <p>
            API Key สำหรับเชื่อมต่อ MCP Server จำกัดจำนวนอุปกรณ์ตามแพ็กเกจที่สมัคร หากต้องการย้ายเครื่องคอมพิวเตอร์ 
            สามารถแจ้งผู้ดูแลระบบเพื่อรีเซ็ตเครื่องได้ตลอดอายุสมาชิก
          </p>
        </div>
      </div>
    </div>
  );
}

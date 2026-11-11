"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Award,
  Download,
  Printer,
  Share2,
  Check,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface CertificateData {
  id: string;
  certificate_code: string;
  user_id: string;
  course_id: string;
  recipient_name: string;
  course_title: string;
  instructor_name: string;
  issued_at: string;
  courses?: {
    slug: string;
  };
}

export default function CertificateVerifyPage() {
  const params = useParams();
  const code = (params?.code as string) || "";
  const supabase = createClient();

  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingPng, setDownloadingPng] = useState(false);

  useEffect(() => {
    const fetchCert = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from("course_certificates")
          .select("*, courses:course_id(slug)")
          .eq("certificate_code", decodeURIComponent(code).trim())
          .maybeSingle();

        if (data) {
          setCertificate(data as CertificateData);
        }
      } catch (err) {
        console.error("Error fetching certificate:", err);
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchCert();
    }
  }, [code, supabase]);

  const handleCopyVerifyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // วาดใบประกาศนียบัตรความละเอียดสูง (1920x1357) ลงบน Canvas เพื่อดาวน์โหลดเป็นไฟล์ PNG
  const handleDownloadPng = () => {
    if (!certificate) return;
    setDownloadingPng(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1920;
      canvas.height = 1357;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Background Deep Slate
      const bgGrad = ctx.createLinearGradient(0, 0, 1920, 1357);
      bgGrad.addColorStop(0, "#0F172A");
      bgGrad.addColorStop(0.5, "#0B1120");
      bgGrad.addColorStop(1, "#0F172A");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1920, 1357);

      // 2. Outer Emerald & Orange Luxury Frame
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 6;
      ctx.strokeRect(60, 60, 1800, 1237);

      ctx.strokeStyle = "#F97316";
      ctx.lineWidth = 2;
      ctx.strokeRect(82, 82, 1756, 1193);

      // 3. Brand Header
      ctx.fillStyle = "#10B981";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("AIFULLFILL.COM • AI ACADEMY & TOOLKIT", 960, 210);

      // 4. Certificate Title
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 72px sans-serif";
      ctx.fillText("CERTIFICATE OF COMPLETION", 960, 320);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "28px sans-serif";
      ctx.fillText("ใบประกาศนียบัตรฉบับนี้ขอมอบไว้เพื่อรับรองว่า", 960, 410);

      // 5. Recipient Name
      ctx.fillStyle = "#F97316";
      ctx.font = "bold 76px sans-serif";
      ctx.fillText(certificate.recipient_name, 960, 540);

      // Underline under name
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(460, 580);
      ctx.lineTo(1460, 580);
      ctx.stroke();

      // 6. Course Completion Text
      ctx.fillStyle = "#CBD5E1";
      ctx.font = "30px sans-serif";
      ctx.fillText("ได้ผ่านการศึกษาและปฏิบัติครบทุกบทเรียน (100%) ในหลักสูตร", 960, 665);

      ctx.fillStyle = "#10B981";
      ctx.font = "bold 44px sans-serif";
      ctx.fillText(certificate.course_title, 960, 755);

      // 7. Footer Signatures & Metadata
      const issuedDateStr = new Date(certificate.issued_at).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 30px sans-serif";
      ctx.fillText(issuedDateStr, 480, 1060);
      ctx.fillStyle = "#64748B";
      ctx.font = "24px sans-serif";
      ctx.fillText("วันที่ออกใบประกาศนียบัตร", 480, 1105);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 30px sans-serif";
      ctx.fillText(certificate.instructor_name, 1440, 1060);
      ctx.fillStyle = "#64748B";
      ctx.font = "24px sans-serif";
      ctx.fillText("ผู้สอนและผู้อำนวยการหลักสูตร", 1440, 1105);

      // Center Seal
      ctx.beginPath();
      ctx.arc(960, 1050, 70, 0, Math.PI * 2);
      ctx.fillStyle = "#10B981";
      ctx.fill();
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("VERIFIED", 960, 1045);
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("100%", 960, 1072);

      // Certificate Code at bottom
      ctx.fillStyle = "#94A3B8";
      ctx.font = "22px monospace";
      ctx.fillText(`Certificate ID: ${certificate.certificate_code} • Verify at aifullfill.com/certificates/${certificate.certificate_code}`, 960, 1220);

      // Trigger Download
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${certificate.certificate_code}-${certificate.recipient_name}.png`;
      a.click();
    } finally {
      setDownloadingPng(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-brand-slate flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="w-8 h-8 text-brand-emerald animate-spin" />
        <p className="text-xs text-slate-400">กำลังตรวจสอบข้อมูลใบประกาศนียบัตร...</p>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-[80vh] bg-brand-slate flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h1 className="text-xl font-extrabold text-white">ไม่พบข้อมูลใบประกาศนียบัตร</h1>
          <p className="text-xs text-slate-400">
            รหัสใบประกาศนียบัตร ({code}) อาจไม่ถูกต้อง หรือยังไม่ได้ถูกออกในระบบ
          </p>
          <Link
            href="/courses"
            className="inline-block px-6 py-2.5 rounded-full text-xs font-bold bg-brand-orange text-white"
          >
            กลับไปหน้ารวมคอร์สเรียน
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(certificate.issued_at).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-brand-slate text-slate-100 min-h-screen py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Action Bar (ซ่อนเวลาสั่งพิมพ์) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <Link
            href={certificate.courses?.slug ? `/courses/${certificate.courses.slug}` : "/dashboard"}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้าห้องเรียน / แดชบอร์ด</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadPng}
              disabled={downloadingPng}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-brand-orange hover:bg-brand-orange-hover text-white flex items-center gap-2 shadow-lg shadow-brand-orange/25 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingPng ? "กำลังสร้างไฟล์ภาพ..." : "ดาวน์โหลดรูปภาพ (PNG ความชัดสูง)"}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-emerald hover:bg-emerald-600 text-slate-950 flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์ / บันทึกเป็น PDF</span>
            </button>

            <button
              onClick={handleCopyVerifyLink}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all"
            >
              {copiedLink ? <Check className="w-4 h-4 text-brand-emerald" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? "คัดลอกลิงก์แล้ว!" : "แชร์ลิงก์ยืนยัน"}</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            CERTIFICATE VISUAL STAGE
        ========================================================================= */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-4 sm:p-8 border-2 border-brand-emerald/60 shadow-2xl overflow-hidden">
          {/* Inner Decorative Border */}
          <div className="border border-brand-orange/40 rounded-2xl p-6 sm:p-14 text-center space-y-8 relative z-10">
            
            {/* Top Brand Badge */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-emerald/15 border border-brand-emerald/30 text-brand-emerald text-xs font-extrabold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>aifullfill.com • Official Certificate</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-wider text-white uppercase">
                Certificate of Completion
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                ใบประกาศนียบัตรฉบับนี้ขอมอบไว้เพื่อรับรองว่า
              </p>
            </div>

            {/* Recipient Name */}
            <div className="py-2">
              <div className="text-3xl sm:text-5xl font-extrabold text-brand-orange tracking-tight pb-4 border-b border-slate-800 max-w-2xl mx-auto">
                {certificate.recipient_name}
              </div>
            </div>

            {/* Course Title */}
            <div className="space-y-2 max-w-2xl mx-auto">
              <p className="text-xs sm:text-sm text-slate-300">
                ได้ผ่านการศึกษาและฝึกปฏิบัติครบถ้วน 100% ในหลักสูตร
              </p>
              <h2 className="text-lg sm:text-2xl font-extrabold text-brand-emerald leading-snug">
                {certificate.course_title}
              </h2>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center max-w-3xl mx-auto border-t border-slate-800/80">
              <div className="space-y-1">
                <div className="text-sm font-bold text-white">{formattedDate}</div>
                <div className="text-[11px] text-slate-400">วันที่ออกใบประกาศนียบัตร</div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-emerald to-teal-400 text-slate-950 flex flex-col items-center justify-center shadow-lg shadow-brand-emerald/25 border-2 border-white/20">
                  <Award className="w-7 h-7 stroke-[2.2]" />
                  <span className="text-[9px] font-black uppercase tracking-tighter">VERIFIED</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-white">{certificate.instructor_name}</div>
                <div className="text-[11px] text-slate-400">ผู้สอนและผู้อำนวยการหลักสูตร</div>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 font-mono border-t border-slate-800/50">
              <span className="flex items-center gap-1.5 text-brand-emerald">
                <ShieldCheck className="w-4 h-4" />
                <span>ตรวจสอบความถูกต้องของใบประกาศนียบัตรแล้ว (Verified Authentic)</span>
              </span>
              <span>Certificate ID: {certificate.certificate_code}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  Share2, 
  Link as LinkIcon, 
  Tag, 
  ShieldCheck, 
  Wallet, 
  Users, 
  HelpCircle, 
  ChevronDown, 
  Zap, 
  Crown,
  Loader2
} from "lucide-react";

export default function AffiliateLandingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    checkUser();
  }, []);

  const handleJoinOrDashboard = async () => {
    if (!currentUser) {
      router.push("/login?redirect=/aff");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/affiliate/join", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard/affiliate");
      } else {
        alert(data.error || "เกิดข้อผิดพลาดในการสมัคร");
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "ค่าคอมมิชชั่นได้ครั้งเดียว หรือได้ตลอดเวลาที่ลูกค้าต่ออายุ?",
      a: "คนที่สมัครสมาชิกผ่านลิงก์หรือคูปองของคุณจะผูกกับบัญชีคุณถาวรครับ! เมื่อลูกค้าต่ออายุแพ็กเกจรายเดือนทุกๆ เดือน หรือต่ออายุรายปี คุณจะได้รับค่าคอมมิชชั่นทุกครั้งอย่างต่อเนื่อง (Recurring Revenue) ตราบใดที่ลูกค้ายังคงใช้งานระบบอยู่ครับ",
    },
    {
      q: "ลูกค้าเก่าที่มีบัญชีเดิมอยู่แล้ว สามารถใช้สิทธิ์แนะนำได้ไหม?",
      a: "ลิงก์แนะนำ (?ref=CODE) จะใช้ผูกกับผู้ที่สมัครบัญชีใหม่ครับ แต่สำหรับลูกค้าเก่าที่เคยมีบัญชีอยู่แล้ว คุณสามารถมอบ 'คูปองส่วนลดส่วนตัว' ของคุณให้เขาใช้ตอนชำระเงินได้ ซึ่งลูกค้าจะได้ส่วนลด และคุณจะได้รับค่าคอมมิชชั่นจากยอดชำระเช่นกันครับ",
    },
    {
      q: "ใครสามารถสมัครเป็นพาร์ทเนอร์แนะนำได้บ้าง?",
      a: "สมาชิกของ aifullfill ทุกระดับสามารถกดสมัครเป็นพาร์ทเนอร์ได้ทันที โดยไม่มีค่าใช้จ่ายเพิ่มเติม และไม่ต้องรอการอนุมัติ สามารถสร้างลิงก์และคูปองไปแนะนำได้เลยครับ",
    },
    {
      q: "ระดับค่าคอมมิชชั่น (Standard vs Premium vs Lifetime) คำนวณอย่างไร?",
      a: "ระดับพาร์ทเนอร์จะอิงตามแพ็กเกจสมาชิกที่คุณถืออยู่: สมาชิก Standard ได้รับ 10%, สมาชิก Premium รายปีได้รับ 15%, และสมาชิก Lifetime VIP ได้รับสูงสุดถึง 25% ของยอดชำระ โดยระบบจะปรับระดับให้อัตโนมัติทันทีครับ",
    },
    {
      q: "การถอนเงินมีเงื่อนไขอย่างไร และใช้เวลากี่วัน?",
      a: "ยอดเงินขั้นต่ำในการถอนคือ 500 บาท เมื่อสะสมครบสามารถกดยื่นคำขอถอนเงินผ่านแดชบอร์ดพาร์ทเนอร์ได้ตลอด 24 ชม. ทีมงานจะดำเนินการตรวจสอบและโอนเงินเข้าบัญชีธนาคารไทยของคุณ พร้อมส่งสลิปยืนยันภายใน 24-48 ชั่วโมงครับ",
    },
  ];

  return (
    <div className="bg-brand-slate text-slate-100 min-h-screen">
      
      {/* =========================================================================
          1. HERO SECTION (Inspired by aiunlock.co/aff)
      ========================================================================= */}
      <section className="relative pt-20 pb-20 lg:pt-28 lg:pb-32 bg-grid-pattern border-b border-slate-800 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>aifullfill Partner Program</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            แนะนำ aifullfill รับส่วนแบ่งค่าคอม <br className="hidden sm:inline" />
            <span className="text-brand-orange">สูงสุด 25%</span> ของยอดที่ลูกค้าจ่าย
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            แชร์ลิงก์หรือคูปองส่วนลดของคุณ ทุกครั้งที่คนที่คุณแนะนำซื้อ รวมถึงตอนต่ออายุทุกเดือน 
            คุณก็ได้ค่าคอมมิชชั่น ลูกค้าผูกกับคุณถาวร สร้างรายได้แบบ Recurring ตลอดไป
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleJoinOrDashboard}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover tactile-button-primary transition-all duration-150 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 fill-white" />
              )}
              <span>{currentUser ? "ไปที่แดชบอร์ดพาร์ทเนอร์" : "เข้าสู่ระบบเพื่อสมัครพาร์ทเนอร์"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#commission-table"
              className="w-full sm:w-auto px-7 py-4 rounded-full text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/90 border border-slate-800 hover:border-slate-700 tactile-button-secondary transition-all"
            >
              ดูตารางคำนวณรายได้ ↓
            </a>
          </div>

          {/* 4 Pillars Stats Highlight */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 text-center">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 tactile-card">
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-orange">สูงสุด 25%</div>
              <div className="text-xs text-slate-400 mt-1">ส่วนแบ่งค่าคอมมิชชั่น</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 tactile-card">
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-emerald">ทุกเดือน</div>
              <div className="text-xs text-slate-400 mt-1">ได้รับตลอดที่ลูกค้าต่ออายุ</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 tactile-card">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">ถาวร</div>
              <div className="text-xs text-slate-400 mt-1">ลูกค้าผูกกับรหัสคุณตลอดชีพ</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 tactile-card">
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-emerald">฿500</div>
              <div className="text-xs text-slate-400 mt-1">ยอดถอนขั้นต่ำ โอนไว</div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. COMMISSION CALCULATION TABLE (Real pricing from aifullfill)
      ========================================================================= */}
      <section id="commission-table" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-brand-emerald uppercase tracking-wider">
            คิดจากราคาจริงบนเว็บ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            แนะนำ 1 ครั้ง คุณได้เงินเข้ากระเป๋าเท่าไหร่?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            ระดับพาร์ทเนอร์จะเท่ากับระดับแพ็กเกจสมาชิกที่คุณถืออยู่ ยิ่งถือแพ็กเกจสูง ยิ่งได้ส่วนแบ่งมากขึ้น
          </p>
        </div>

        {/* Table */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden tactile-card shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">แพ็กเกจบุฟเฟต์</th>
                  <th className="py-4 px-6">ราคาหน้าเว็บ</th>
                  <th className="py-4 px-6 text-center">
                    <span className="text-slate-300 block">Standard</span>
                    <span className="text-[11px] text-slate-500 font-normal">คอม 10%</span>
                  </th>
                  <th className="py-4 px-6 text-center">
                    <span className="text-brand-emerald block font-bold">Premium</span>
                    <span className="text-[11px] text-brand-emerald/70 font-normal">คอม 15%</span>
                  </th>
                  <th className="py-4 px-6 text-center bg-brand-orange/10 border-x border-brand-orange/30">
                    <span className="text-brand-orange block font-extrabold flex items-center justify-center gap-1">
                      <Crown className="w-3.5 h-3.5" /> Lifetime VIP
                    </span>
                    <span className="text-[11px] text-brand-orange font-bold">คอม 25% (สูงสุด)</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-5 px-6 font-semibold text-white">
                    <div>บุฟเฟต์รายเดือน (Standard Monthly)</div>
                    <div className="text-[11px] text-brand-emerald mt-0.5">★ ได้รับทุกเดือนที่ลูกค้าต่ออายุ</div>
                  </td>
                  <td className="py-5 px-6 font-mono text-slate-300">฿599 / เดือน</td>
                  <td className="py-5 px-6 text-center font-bold text-slate-300">฿60 / ด.</td>
                  <td className="py-5 px-6 text-center font-bold text-brand-emerald">฿90 / ด.</td>
                  <td className="py-5 px-6 text-center font-extrabold text-brand-orange bg-brand-orange/5 border-x border-brand-orange/30 text-base">
                    ฿150 / ด.
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-5 px-6 font-semibold text-white">
                    <div>บุฟเฟต์รายปี (Premium Yearly)</div>
                    <div className="text-[11px] text-brand-emerald mt-0.5">★ ได้รับทุกปีที่ลูกค้าต่ออายุ</div>
                  </td>
                  <td className="py-5 px-6 font-mono text-slate-300">฿3,890 / ปี</td>
                  <td className="py-5 px-6 text-center font-bold text-slate-300">฿389 / ปี</td>
                  <td className="py-5 px-6 text-center font-bold text-brand-emerald">฿583 / ปี</td>
                  <td className="py-5 px-6 text-center font-extrabold text-brand-orange bg-brand-orange/5 border-x border-brand-orange/30 text-base">
                    ฿972 / ปี
                  </td>
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-5 px-6 font-semibold text-white">
                    <div>สมาชิกตลอดชีพ (Lifetime VIP)</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">รับก้อนใหญ่ จ่ายครั้งเดียวจบ</div>
                  </td>
                  <td className="py-5 px-6 font-mono text-slate-300">฿6,990 จบ</td>
                  <td className="py-5 px-6 text-center font-bold text-slate-300">฿699</td>
                  <td className="py-5 px-6 text-center font-bold text-brand-emerald">฿1,048</td>
                  <td className="py-5 px-6 text-center font-extrabold text-brand-orange bg-brand-orange/5 border-x border-brand-orange/30 text-base">
                    ฿1,747
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-center text-xs text-slate-400">
            * สมาชิกที่ซื้อแพ็กเกจ Lifetime VIP จะได้รับสิทธิ์ค่าคอมมิชชั่น 25% สูงสุดถาวรตลอดชีพ แม้ในอนาคตจะไม่มีการจ่ายเพิ่มก็ตาม
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. 3 STEPS TO GET STARTED (สไตล์ aiunlock.co)
      ========================================================================= */}
      <section className="py-20 bg-slate-950/60 border-y border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              เริ่มต้นง่ายๆ ใน 3 ขั้นตอน
            </h2>
            <p className="text-slate-400 text-sm">
              ไม่ต้องมีเว็บไซต์ ไม่ต้องมีผู้ติดตามเป็นแสน แค่แชร์ความรู้และสิ่งที่คุณใช้จริง
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 tactile-card space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange border border-brand-orange/20 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-white text-base">กดสมัครพาร์ทเนอร์</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                เข้าสู่ระบบด้วยบัญชี aifullfill ของคุณ แล้วกดปุ่มสมัครได้ทันที ไม่ต้องรอการอนุมัติ 
                ระบบจะสร้างลิงก์แนะนำและรหัสคูปองเฉพาะตัวของคุณทันทีใน 1 วินาที
              </p>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 tactile-card space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-white text-base">แชร์ลิงก์หรือคูปองส่วนลด</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                นำลิงก์ไปใส่ใต้คลิป YouTube, โพสต์ใน Facebook, ทวิต หรือทักแชทแนะนำให้เพื่อน ลูกค้าได้ส่วนลดพิเศษ คุณได้ค่าคอมมิชชั่นแบบอัตโนมัติ
              </p>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 tactile-card space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-white text-base">ถอนเงินเข้าบัญชีธนาคาร</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                สะสมยอดคอมมิชชั่นครบ 500 บาท กดปุ่มขอถอนเงินได้ตลอดเวลา ทีมงานจะโอนเงินเข้าบัญชีธนาคารของคุณพร้อมส่งสลิปหลักฐานยืนยัน
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          4. 2 POWERFUL TOOLS (Referral Link & Custom Coupon)
      ========================================================================= */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">เครื่องมือสร้างรายได้</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            2 อาวุธช่วยขาย ที่ทำให้คุณปิดลูกค้าง่ายขึ้น
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Tool 1 */}
          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 tactile-card space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-bold">
              <LinkIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-brand-emerald uppercase">เครื่องมือที่ 1</span>
            <h3 className="text-xl font-bold text-white">ลิงก์แนะนำส่วนตัว (?ref=CODE)</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              สามารถนำรหัสของคุณไปต่อท้ายหน้าไหนก็ได้บนเว็บ เช่น หน้าแรก, หน้ารวมคอร์ส หรือหน้าเจาะจง 
              คนที่กดคลิกจะถูกบันทึกคุกกี้ 30 วัน และเมื่อสมัครสมาชิกใหม่จะถูกผูกกับคุณถาวร ซื้ออะไรหลังจากนั้นคุณได้รับค่าคอมทั้งหมด
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
              <span className="truncate">https://aifullfill.com/?ref=YOUR_CODE</span>
              <span className="text-brand-emerald text-[11px] font-bold">แชร์ได้ทุกแพลตฟอร์ม</span>
            </div>
          </div>

          {/* Tool 2 */}
          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 tactile-card space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center font-bold">
              <Tag className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-brand-orange uppercase">เครื่องมือที่ 2</span>
            <h3 className="text-xl font-bold text-white">คูปองส่วนลดตั้งชื่อเองได้</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              รับคูปองส่วนลดพิเศษทันทีที่สมัคร ลูกค้าที่กรอกโค้ดจะได้ส่วนลดค่าสมาชิกทันที 
              และคุณจะได้รับค่าคอมมิชชั่นตามสัดส่วน เหมาะมากสำหรับใช้กับลูกค้าเก่าที่มีบัญชีอยู่แล้ว หรือใช้ในการทำคลิปสอน
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
              <span className="font-bold text-brand-orange tracking-widest">CODE: [ชื่อของคุณ]</span>
              <span className="text-slate-400 text-[11px]">ลูกค้าได้ลด • คุณได้คอม</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. FAQ ACCORDION (Addressing All Partner Doubts)
      ========================================================================= */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-brand-orange" />
            <span>คำถามที่พบบ่อยสำหรับพาร์ทเนอร์</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            ทุกเรื่องที่คุณอยากรู้ก่อนเริ่มแนะนำ
          </h2>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen ? "bg-slate-900 border-slate-700 shadow-lg" : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-bold text-sm sm:text-base text-white leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "bg-brand-orange text-white rotate-180" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 font-normal leading-relaxed border-t border-slate-800/80 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          6. BOTTOM CALL TO ACTION
      ========================================================================= */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-brand-slate text-center border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            พร้อมสร้างรายได้ต่อเนื่องแบบ Recurring ไปด้วยกันหรือยัง?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-normal">
            ไม่จำกัดยอดขาย ไม่มียอดขั้นต่ำ แนะนำเพียงครั้งเดียว รับส่วนแบ่งทุกเดือนที่ลูกค้าต่ออายุ
          </p>
          <div className="pt-2">
            <button
              onClick={handleJoinOrDashboard}
              disabled={isSubmitting}
              className="px-8 py-4 rounded-full text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover tactile-button-primary transition-all inline-flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
              <span>{currentUser ? "เข้าสู่แดชบอร์ดพาร์ทเนอร์ของคุณ" : "เข้าสู่ระบบและเริ่มแนะนำวันนี้"}</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

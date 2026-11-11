"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "ไม่มีพื้นฐานการเขียนโปรแกรมมาก่อนเลย จะเรียนรู้เรื่องและทำตามได้ไหม?",
      a: "เรียนได้แน่นอนครับ! หลักสูตรของเราออกแบบมาโดยเฉพาะสำหรับยุค AI Coding (Vibe Coding) ที่คุณไม่ต้องนั่งพิมพ์ไวยากรณ์โค้ดทีละบรรทัด แต่เราจะสอนตั้งแต่แนวคิดการจัดโครงสร้างระบบ การเขียนคำสั่ง Prompt เชิงวิศวกรรมให้ AI ทำงานแทน และการใช้ Desktop Agents (เช่น Antigravity และ Claude Code) ให้เสกเว็บและบอทออกมาได้จริงแบบ Step-by-step ครับ",
    },
    {
      q: "ซอร์สโค้ดและโปรเจกต์ที่ดาวน์โหลดไป สามารถนำไปรับงานลูกค้าหรือใช้ในธุรกิจส่วนตัวได้ไหม?",
      a: "ได้ 100% เลยครับ! สมาชิกสามารถนำซอร์สโค้ดทุกโปรเจกต์ (LINE Bot, Web Application, ส่วนขยาย Chrome, ระบบ Scraping) ไปปรับแต่ง ใช้งานในธุรกิจของคุณ หรือนำไปรับจ้างส่งมอบงานให้ลูกค้าได้ทันทีโดยไม่มีค่าลิขสิทธิ์เพิ่มเติม (ห้ามเพียงแค่นำไฟล์ดิบไปขายต่อเป็นคลังโค้ดโดยตรงเท่านั้น)",
    },
    {
      q: "สิทธิประโยชน์ระหว่าง Standard Buffet กับ Premium Buffet ต่างกันอย่างไร?",
      a: "Standard Buffet เหมาะสำหรับผู้เริ่มต้น เข้าเรียนคอร์สพื้นฐานได้ไม่จำกัดและดาวน์โหลดเอกสารประกอบ ส่วน Premium Buffet ปลดล็อกทุกอย่าง 100% ทั้งคอร์สระดับแอดวานซ์, สิทธิ์ดาวน์โหลดซอร์สโค้ดโปรเจกต์ทั้งหมด, สิทธิ์การใช้ MCP Server Token, และสิทธิ์เข้ากลุ่มพิเศษสำหรับปรึกษาผู้สอนโดยตรงครับ",
    },
    {
      q: "เมื่อมีโมเดล AI ใหม่ๆ ออกมา (เช่น Claude, DeepSeek รุ่นใหม่) จะมีบทเรียนอัปเดตไหม?",
      a: "มีอัปเดตตลอดเวลาครับ! จุดเด่นของระบบบุฟเฟต์ที่ aifullfill.com คือคุณไม่ต้องซื้อคอร์สใหม่ซ้ำๆ เมื่อมีเทคโนโลยีใหม่ เครื่องมือใหม่ หรือเทคนิคใหม่ ทีมงานจะเพิ่มบทเรียนและซอร์สโค้ดชุดใหม่เข้าสู่ระบบให้สมาชิกเรียนได้ทันทีโดยไม่ต้องจ่ายเพิ่ม",
    },
    {
      q: "สามารถออกใบเสนอราคา ใบเสร็จรับเงิน หรือใบกำกับภาษีสำหรับบริษัทได้หรือไม่?",
      a: "สามารถออกเอกสารใบเสร็จรับเงินและใบกำกับภาษีได้ครับ สำหรับบริษัท นิติบุคคล หรือองค์กรที่ต้องการส่งพนักงานเข้าอบรม หรือต้องการจัดซื้อแพ็กเกจสมาชิกแบบทีม สามารถแจ้งรายละเอียดผ่าน LINE Official หรือส่งอีเมลมาที่ support@aifullfill.com ได้เลยครับ",
    },
    {
      q: "หากต้องการยกเลิกสมาชิกรายเดือน สามารถทำได้เองหรือไม่?",
      a: "ทำได้ง่ายและโปร่งใสมากครับ คุณสามารถกดยกเลิกการต่ออายุได้ด้วยตัวเองผ่านเมนูแดชบอร์ดสมาชิกได้ทุกเวลา โดยระบบจะยังคงเปิดให้คุณเข้าใช้งานได้จนครบกำหนดรอบบิลเดิมที่คุณได้ชำระไว้ ไม่มีค่าธรรมเนียมแอบแฝงใดๆ ทั้งสิ้นครับ",
    },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-brand-orange" />
          <span>คลายทุกข้อสงสัย (FAQ)</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          คำถามที่พบบ่อยเกี่ยวกับระบบบุฟเฟต์
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          รวมทุกคำตอบที่ผู้เรียนสอบถามเข้ามาบ่อยที่สุด เพื่อช่วยให้คุณตัดสินใจได้ง่ายขึ้น
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "bg-slate-900 border-slate-700 shadow-lg"
                  : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4"
              >
                <span className="font-bold text-sm sm:text-base text-white leading-snug">
                  {faq.q}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                    isOpen
                      ? "bg-brand-orange text-white rotate-180"
                      : "bg-slate-800 text-slate-400"
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
  );
}

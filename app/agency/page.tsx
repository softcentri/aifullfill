"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Code2, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  MessageSquare, 
  Terminal, 
  Layers, 
  Cpu, 
  Database, 
  Cloud, 
  Bot, 
  Laptop, 
  ShieldCheck, 
  Zap,
  Clock,
  Send
} from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  startingPrice: string;
  deliveryTime: string;
  tech: string[];
}

export default function AgencyPage() {
  const [quoteFormData, setQuoteFormData] = useState({
    name: "",
    contact: "",
    serviceType: "web-app",
    budget: "under-30k",
    details: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const services = [
    {
      title: "พัฒนา Web Application",
      description: "สร้างเว็บแอปพลิเคชันระบบจัดการ แพลตฟอร์มสมาชิก หรือ SaaS ด้วย Next.js และ Supabase ส่งงานไว เสถียรสูง",
      tag: "Fullstack",
    },
    {
      title: "ระบบ Automation & n8n",
      description: "เชื่อมต่อข้อมูลข้ามแพลตฟอร์ม ดูดข้อมูลอัตโนมัติ ยิงแจ้งเตือน LINE และอัปเดต Google Sheets ลดงานคน 80%",
      tag: "No-Code & AI",
    },
    {
      title: "แชทบอท LINE OA & CRM",
      description: "บอทตอบคำถามลูกค้า ปิดการขาย ตรวจสลิปโอนเงิน และจัดหมวดหมู่ลูกค้าเข้าสู่ระบบ CRM อัจฉริยะ",
      tag: "Marketing",
    },
    {
      title: "ออกแบบ UI/UX สไตล์สากล",
      description: "ดีไซน์หน้าตาเว็บไซต์ระดับโปรดักชัน สไตล์โมเดิร์นคลีนแบบ Udemy / Stripe ใช้งานง่ายบนทุกอุปกรณ์",
      tag: "Design",
    },
    {
      title: "Agentic AI & MCP Server",
      description: "พัฒนาระบบ AI Agent เฉพาะทางสำหรับองค์กร และเซิร์ฟเวอร์ MCP เพื่อเชื่อม Claude เข้ากับฐานข้อมูลภายใน",
      tag: "Agentic AI",
    },
    {
      title: "ระบบ E-Commerce & ชำระเงิน",
      description: "ร้านค้าออนไลน์ตัดบัตรเครดิต สแกน PromptPay QR Code อัตโนมัติ จัดการสต็อก และออกใบเสร็จ",
      tag: "E-Commerce",
    },
  ];

  const portfolioItems: PortfolioItem[] = [
    {
      id: "port-1",
      title: "Unlock E-Learning Buffet Platform",
      category: "E-Learning & SaaS",
      description: "แพลตฟอร์มคอร์สเรียนบุฟเฟต์ พร้อมระบบสตรีมวิดีโอ ระบบสมาชิก 2 Tier และระบบบันทึกความคืบหน้านักเรียน",
      startingPrice: "29,000฿",
      deliveryTime: "10-14 วัน",
      tech: ["Next.js", "Supabase", "Tailwind", "Bunny Stream"],
    },
    {
      id: "port-2",
      title: "ระบบจัดการอสังหาริมทรัพย์ (Property CRM)",
      category: "CRM & Marketplace",
      description: "เว็บค้นหาบ้านและคอนโด พร้อมระบบคัดกรองแปลงที่ดิน แดชบอร์ดสำหรับนายหน้า และระบบแจ้งเตือนลูกค้าทาง LINE",
      startingPrice: "25,000฿",
      deliveryTime: "14 วัน",
      tech: ["React", "PostgreSQL", "LINE Notify"],
    },
    {
      id: "port-3",
      title: "SP X Data Scraper & Market Analytics",
      category: "Automation & Extension",
      description: "Chrome Extension ดึงราคาสินค้า Shopee ยอดขาย และคำค้นยอดนิยม แปลงเป็นกราฟวิเคราะห์ยอดขายคู่แข่ง",
      startingPrice: "12,900฿",
      deliveryTime: "5-7 วัน",
      tech: ["Manifest V3", "Node.js", "Chart.js"],
    },
    {
      id: "port-4",
      title: "LINE Bot ปิดการขาย + ตรวจสลิปอัตโนมัติ",
      category: "LINE OA & Fintech",
      description: "บอทตอบลูกค้า 24 ชม. รับออเดอร์ คำนวณยอดเงิน และใช้ AI สแกนตรวจสลิปโอนเงินปลอมก่อนอนุมัติสินค้า",
      startingPrice: "8,900฿",
      deliveryTime: "3-5 วัน",
      tech: ["LINE Messaging", "FastAPI", "OCR AI"],
    },
    {
      id: "port-5",
      title: "Unlock Coffee POS & Inventory Cloud",
      category: "Point of Sale",
      description: "ระบบคิดเงินหน้าร้านคาเฟ่ รองรับตัดสต็อกเมล็ดกาแฟ สแกน PromptPay และสรุปยอดขายรายวันส่งเข้า LINE ผู้บริหาร",
      startingPrice: "15,900฿",
      deliveryTime: "7 วัน",
      tech: ["Vue.js", "Supabase", "PromptPay QR"],
    },
    {
      id: "port-6",
      title: "ระบบ Multi-Agent AI คอนเทนต์อัตโนมัติ",
      category: "Agentic AI",
      description: "ระบบ Agent 4 ตัวดึงหัวข้อเทรนด์ เจนบทความ SEO 2,000 คำ สร้างภาพประกอบ AI และโพสต์ลงเว็บอัตโนมัติ",
      startingPrice: "19,000฿",
      deliveryTime: "7-10 วัน",
      tech: ["Claude API", "Python", "WordPress REST"],
    },
  ];

  const techStacks = [
    {
      category: "Frontend Development",
      items: ["Next.js 15", "React 19", "Tailwind CSS", "TypeScript", "Vue.js"],
      icon: Laptop,
    },
    {
      category: "Backend & Database",
      items: ["Supabase", "Node.js", "FastAPI", "PostgreSQL", "REST / GraphQL"],
      icon: Database,
    },
    {
      category: "AI & Automation",
      items: ["Claude 3.7", "OpenAI GPT-4o", "n8n Workflows", "MCP Protocol", "CrewAI"],
      icon: Bot,
    },
    {
      category: "Cloud & Infrastructure",
      items: ["Vercel", "Cloudflare", "AWS", "Bunny CDN", "GitHub Actions"],
      icon: Cloud,
    },
  ];

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="bg-brand-off-white min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* =========================================================================
            1. HERO SECTION (ถอดแบบจากภาพต้นแบบ รับทำเว็บไซต์ & แอปพลิเคชัน)
        ========================================================================= */}
        <div className="bg-gradient-to-b from-slate-900 via-brand-slate to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-brand-emerald/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Texts */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider border border-brand-orange/30">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Turnkey Software & AI Solutions</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                รับทำเว็บไซต์ & แอปพลิเคชัน <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-300 to-brand-emerald">
                  ด้วย AI และเทคโนโลยีล่าสุด
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed max-w-xl">
                พัฒนาเว็บไซต์และระบบซอฟต์แวร์อย่างรวดเร็ว ส่งงานไว ประสิทธิภาพสูง รองรับผู้ใช้งานจำนวนมาก และดูแลหลังการขายอย่างมืออาชีพ
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#quote-form"
                  className="w-full sm:w-auto px-7 py-3.5 text-xs font-bold text-white bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange-hover hover:to-amber-600 rounded-full shadow-lg shadow-brand-orange/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>ขอใบเสนอราคาด่วน</span>
                </a>

                <a
                  href="#portfolio"
                  className="w-full sm:w-auto px-7 py-3.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-full transition-all flex items-center justify-center gap-2"
                >
                  <span>ดูตัวอย่างผลงานจริง</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald" /> ประเมินราคาใน 24 ชม.
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald" /> ส่งมอบโค้ดจริง 100%
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald" /> สัญญาจ้างและการันตีงาน
                </span>
              </div>
            </div>

            {/* Right Mockup Code Window (ถอดแบบจากภาพต้นแบบ) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
                {/* Code Window Header */}
                <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] text-slate-400">AppArchitecture.tsx</span>
                  <span className="text-[10px] text-brand-emerald">Ready</span>
                </div>

                {/* Code Lines */}
                <div className="p-5 text-slate-300 space-y-1.5 overflow-x-auto leading-relaxed">
                  <div><span className="text-purple-400">import</span> &#123; createClient &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">&quot;@supabase/ssr&quot;</span>;</div>
                  <div><span className="text-purple-400">import</span> &#123; agenticWorkflow &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">&quot;@/lib/ai&quot;</span>;</div>
                  <br />
                  <div className="text-slate-500">&#47;&#47; High Performance Turnkey Web App</div>
                  <div><span className="text-blue-400">export async function</span> <span className="text-amber-300">DeliverProject</span>() &#123;</div>
                  <div className="pl-4">
                    <span className="text-blue-400">const</span> system = &#123;
                  </div>
                  <div className="pl-8 text-emerald-300">
                    speed: <span className="text-amber-300">&quot;10x Faster with AI&quot;</span>,
                  </div>
                  <div className="pl-8 text-emerald-300">
                    architecture: <span className="text-amber-300">&quot;No N+1 Query&quot;</span>,
                  </div>
                  <div className="pl-8 text-emerald-300">
                    security: <span className="text-amber-300">&quot;RLS & MCP Guarded&quot;</span>
                  </div>
                  <div className="pl-4">&#125;;</div>
                  <div className="pl-4"><span className="text-purple-400">return</span> system.<span className="text-blue-300">launchProduction</span>();</div>
                  <div>&#125;</div>
                </div>

                <div className="bg-slate-900/60 px-4 py-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Tech: Next.js + Supabase + Claude</span>
                  <span className="text-brand-orange font-bold">100% Production Ready</span>
                </div>
              </div>
            </div>

          </div>
        </div>


        {/* =========================================================================
            2. SERVICES GRID (บริการของเรา 6 รูปแบบ)
        ========================================================================= */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-brand-emerald uppercase tracking-wider">
              Our Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-slate">
              บริการพัฒนาซอฟต์แวร์ของเรา
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              ครอบคลุมตั้งแต่การออกแบบหน้าตา วางโครงสร้างฐานข้อมูล ไปจนถึงต่อระบบ AI อัตโนมัติ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-emerald/40 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-emerald-light text-brand-emerald-dark">
                      {srv.tag}
                    </span>
                    <span className="text-slate-300 font-mono text-xs font-bold">0{idx + 1}</span>
                  </div>

                  <h3 className="font-extrabold text-lg text-brand-slate group-hover:text-brand-emerald transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>ปรึกษาขอบเขตงานฟรี</span>
                  <ArrowRight className="w-4 h-4 text-brand-orange group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* =========================================================================
            3. PORTFOLIO & CASE STUDIES (ตัวอย่างผลงานจริง พร้อมราคาเริ่มต้น)
        ========================================================================= */}
        <div id="portfolio" className="space-y-8 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Proven Track Record
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-slate mt-1">
                ตัวอย่างผลงานที่ส่งมอบแล้ว
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-sm text-right sm:text-left">
              ราคาเริ่มต้นประเมินตามฟังก์ชันจริง ส่งงานตรงเวลา พร้อมคู่มือและซอร์สโค้ดเต็ม
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:shadow-xl hover:border-brand-orange/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-orange text-white">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2 group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tech.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">ราคาเริ่มต้น ({item.deliveryTime})</span>
                    <span className="text-base font-extrabold text-brand-slate">{item.startingPrice}</span>
                  </div>

                  <a
                    href="#quote-form"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-brand-orange hover:text-white transition-colors"
                  >
                    สนใจทำระบบนี้
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* =========================================================================
            4. TECH STACK WE USE (เทคโนโลยีที่เราใช้ระดับมาตรฐานสากล)
        ========================================================================= */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-slate">
              Tech Stack ที่เราเลือกใช้
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              เราเลือกเครื่องมือที่ทันสมัยที่สุดในวงการ เพื่อให้ระบบของคุณเร็ว ปลอดภัย และขยายขนาดได้สบาย
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStacks.map((stk, idx) => {
              const IconComponent = stk.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-slate shadow-sm">
                    <IconComponent className="w-5 h-5 text-brand-emerald" />
                  </div>
                  <h4 className="font-bold text-xs text-brand-slate uppercase tracking-wider">{stk.category}</h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {stk.items.map((tech, tIdx) => (
                      <li key={tIdx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>


        {/* =========================================================================
            5. QUOTE FORM & CONTACT (กล่องประเมินราคาภายใน 24 ชม.)
        ========================================================================= */}
        <div id="quote-form" className="bg-gradient-to-r from-slate-900 via-brand-slate to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-2xl max-w-3xl mx-auto space-y-8 scroll-mt-20">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-emerald/20 text-brand-emerald text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Fast Estimate</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              ติดต่อสอบถามราคา & ขอใบเสนอราคา
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light">
              กรอกรายละเอียดเบื้องต้น ทีมงานวิศวกรจะประเมินงบประมาณและเวลาส่งมอบกลับไปภายใน 24 ชั่วโมง
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 rounded-2xl bg-brand-emerald/15 border border-brand-emerald/30 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-brand-emerald text-slate-950 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-lg text-white">ได้รับข้อมูลเรียบร้อยแล้วครับ!</h4>
              <p className="text-xs text-slate-300">ทีมงาน aifullfill จะติดต่อกลับทางช่องทางที่คุณระบุเพื่อส่งใบเสนอราคาโดยเร็วที่สุด</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitQuote} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">ชื่อของคุณ / ชื่อบริษัท</label>
                  <input
                    type="text"
                    required
                    value={quoteFormData.name}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, name: e.target.value })}
                    placeholder="เช่น คุณสมชาย (บริษัท มีดี จำกัด)"
                    className="w-full px-4 py-2.5 text-xs bg-slate-800/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">เบอร์โทรศัพท์ หรือ LINE ID</label>
                  <input
                    type="text"
                    required
                    value={quoteFormData.contact}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, contact: e.target.value })}
                    placeholder="081-xxx-xxxx หรือ @lineid"
                    className="w-full px-4 py-2.5 text-xs bg-slate-800/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">ประเภทระบบที่ต้องการทำ</label>
                  <select
                    value={quoteFormData.serviceType}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, serviceType: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-800/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
                  >
                    <option value="web-app">Web Application / แพลตฟอร์ม</option>
                    <option value="automation">ระบบ Automation n8n / LINE Bot</option>
                    <option value="pos-crm">ระบบ CRM / POS คิดเงินหน้าร้าน</option>
                    <option value="extension">Chrome Extension ดึงข้อมูล</option>
                    <option value="ai-agent">ระบบ Agentic AI & MCP Server</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">งบประมาณที่เตรียมไว้</label>
                  <select
                    value={quoteFormData.budget}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, budget: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-800/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
                  >
                    <option value="under-15k">ต่ำกว่า 15,000 บาท</option>
                    <option value="15k-30k">15,000 - 30,000 บาท</option>
                    <option value="30k-60k">30,000 - 60,000 บาท</option>
                    <option value="60k-plus">60,000 บาทขึ้นไป</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">รายละเอียดงาน / ความต้องการเพิ่มเติม</label>
                <textarea
                  rows={3}
                  value={quoteFormData.details}
                  onChange={(e) => setQuoteFormData({ ...quoteFormData, details: e.target.value })}
                  placeholder="อธิบายฟังก์ชันคร่าวๆ เช่น ต้องการบอท LINE ตอบลูกค้าและบันทึกออเดอร์..."
                  className="w-full px-4 py-2.5 text-xs bg-slate-800/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 px-6 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-brand-emerald to-teal-400 hover:from-brand-emerald-dark hover:to-teal-500 transition-all shadow-lg shadow-brand-emerald/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>ส่งข้อมูลขอใบเสนอราคา</span>
                </button>

                <a
                  href="https://line.me"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto py-3 px-6 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-center"
                >
                  หรือทักคุยผ่าน LINE ทันที ↗
                </a>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}

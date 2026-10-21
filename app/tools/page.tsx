"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Wrench, 
  Search, 
  Sparkles, 
  Download, 
  ExternalLink, 
  Laptop, 
  Globe, 
  Layers, 
  Bot, 
  Copy, 
  Check, 
  CheckCircle2, 
  ArrowRight,
  Video,
  FileText,
  Palette,
  Briefcase,
  Terminal,
  Zap
} from "lucide-react";

interface DesktopTool {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  os: string;
  fileSize: string;
  requiredTier: "standard" | "premium";
}

interface WebAppItem {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  badge: string;
  requiredTier: "standard" | "premium";
}

interface AiGemItem {
  id: string;
  title: string;
  group: "video" | "content" | "design" | "marketing" | "dev";
  groupLabel: string;
  description: string;
  systemPrompt: string;
  targetModel: string;
  requiredTier: "standard" | "premium";
}

const DESKTOP_TOOLS: DesktopTool[] = [
  {
    id: "dt-1",
    name: "FastMark: ใส่ลายน้ำและแปลงวิดีโอ 60 FPS",
    category: "Video & Media",
    description: "โปรแกรมตัดต่อและประทับลายน้ำลงบนคลิปวิดีโอจำนวนมากแบบ Batch ประมวลผลเร็วด้วย GPU",
    version: "v1.4.0",
    os: "Windows / Mac",
    fileSize: "48.2 MB",
    requiredTier: "standard",
  },
  {
    id: "dt-2",
    name: "AI Video Upscaler 4K Pro",
    category: "Video & Media",
    description: "ขยายความละเอียดวิดีโอเก่าหรือคลิปความละเอียดต่ำให้คมชัดระดับ 4K ด้วย AI โดยภาพไม่แตก",
    version: "v2.1.0",
    os: "Windows (NVIDIA GPU)",
    fileSize: "124.0 MB",
    requiredTier: "premium",
  },
  {
    id: "dt-3",
    name: "OmniVoice TTS Studio Desktop",
    category: "Audio & Voice",
    description: "เครื่องมือเจนเสียงบรรยายภาษาไทยพร้อมระบบตัดแบ่งวรรคตอนและปรับโทนอารมณ์ในเครื่องของคุณ",
    version: "v1.0.8",
    os: "Windows / Mac",
    fileSize: "65.5 MB",
    requiredTier: "standard",
  },
  {
    id: "dt-4",
    name: "Master SEO & Keyword Explorer",
    category: "Marketing",
    description: "โปรแกรมสแกนคีย์เวิร์ด ค้นหาช่องว่างคู่แข่ง และวิเคราะห์แนวโน้มการค้นหาใน Google Search",
    version: "v1.2.2",
    os: "Windows",
    fileSize: "32.0 MB",
    requiredTier: "standard",
  },
  {
    id: "dt-5",
    name: "Clip2Cut AI: ตัดคลิปไฮไลต์อัตโนมัติ",
    category: "Video & Media",
    description: "ฟังเสียงพูดในวิดีโอยาว ตรวจจับช่วงตื่นเต้น และตัดเป็นคลิปสั้นแนวตั้งสำหรับ TikTok ทันที",
    version: "v1.1.5",
    os: "Windows / Mac",
    fileSize: "88.0 MB",
    requiredTier: "premium",
  },
  {
    id: "dt-6",
    name: "Vibe Coding Studio Local Server",
    category: "Developer",
    description: "เครื่องมือจำลอง Local Web Server พร้อมระบบ Auto-reload และเชื่อมต่อ Claude Code ในคลิกเดียว",
    version: "v2.0.0",
    os: "Windows / Mac / Linux",
    fileSize: "18.5 MB",
    requiredTier: "premium",
  },
];

const WEB_APPS: WebAppItem[] = [
  {
    id: "wa-1",
    name: "Shopee Keyword & Price Tracker",
    category: "E-Commerce",
    description: "เว็บแอปพลิเคชันวิเคราะห์แนวโน้มราคาสินค้าและคำค้นยอดฮิตใน Shopee แบบ Real-time",
    url: "#",
    badge: "HOT",
    requiredTier: "standard",
  },
  {
    id: "wa-2",
    name: "Viral Thumbnail Concept Generator",
    category: "Creative",
    description: "เครื่องมือวางโครงสร้างปก YouTube ช่วยจัดวางตัวหนังสือและใบหน้าให้สะกดสายตา",
    url: "#",
    badge: "NEW",
    requiredTier: "standard",
  },
  {
    id: "wa-3",
    name: "AI Prompt Formatter & Optimizer",
    category: "AI Tools",
    description: "ช่วยขัดเกลาและปรับแต่งคำสั่ง Prompt ให้มีโครงสร้างถูกต้อง ได้ผลลัพธ์จาก AI แม่นยำขึ้น 3 เท่า",
    url: "#",
    badge: "FREE",
    requiredTier: "standard",
  },
  {
    id: "wa-4",
    name: "LINE Slip Verifier Cloud",
    category: "Automation",
    description: "ระบบสแกนตรวจสอบสลิปโอนเงินธนาคารผ่าน LINE อัตโนมัติ ป้องกันสลิปปลอมหรือใช้ซ้ำ",
    url: "#",
    badge: "VIP",
    requiredTier: "premium",
  },
];

const AI_GEMS: AiGemItem[] = [
  // Video Group
  {
    id: "gem-1",
    title: "AI Video Hook & 3-Act Scriptwriter",
    group: "video",
    groupLabel: "🎬 AI for Video",
    description: "คิดท่อนฮุกเปิดคลิป 3 วินาทีแรกที่หยุดคนดู พร้อมโครงสร้างเนื้อหา 3 องก์สำหรับคลิปสั้น",
    targetModel: "ChatGPT / Claude",
    requiredTier: "standard",
    systemPrompt: `คุณคือผู้เชี่ยวชาญด้าน Viral Short-form Video (TikTok & YouTube Shorts) ที่มีประสบการณ์ยอดวิวรวมกว่า 100 ล้านครั้ง
หน้าที่ของคุณ:
1. วิเคราะห์หัวข้อที่ผู้ใช้กำหนด
2. สร้าง "Hook 3 วินาทีแรก" 5 แบบที่ใช้เทคนิค Negative Bias, Open Loop, และ Curiosity Gap
3. เขียนสคริปต์ความยาว 45-60 วินาทีที่มีโครงสร้าง Hook -> Agitate -> Solution -> CTA ชัดเจน
4. กำกับฉาก (Visual Direction) สำหรับตัดต่อในแต่ละท่อน`,
  },
  {
    id: "gem-2",
    title: "Avatar Studio & Lip-Sync Director",
    group: "video",
    groupLabel: "🎬 AI for Video",
    description: "ออกแบบบทบรรยายและคำสั่งควบคุมอารมณ์ใบหน้าสำหรับโมเดล AI Avatar เช่น HeyGen หรือ Hedra",
    targetModel: "ChatGPT / Claude",
    requiredTier: "standard",
    systemPrompt: `คุณคือผู้กำกับ AI Avatar ทำหน้าที่แปลงข้อความธรรมดาให้กลายเป็นสคริปต์สำหรับ AI Talking Head โดยใส่แท็กควบคุมจังหวะการหายใจ การเน้นเสียง และอารมณ์ของสีหน้าอย่างเป็นธรรมชาติ`,
  },

  // Content Group
  {
    id: "gem-3",
    title: "Viral Storyteller & Narrative Architect",
    group: "content",
    groupLabel: "✍️ Content Creation",
    description: "เปลี่ยนบทเรียนหรือความรู้ทางเทคนิค ให้กลายเป็นเรื่องเล่าที่เข้าใจง่ายและน่าติดตาม",
    targetModel: "Claude 3.5 Sonnet",
    requiredTier: "standard",
    systemPrompt: `คุณคือนักเล่าเรื่องชั้นครู (Storytelling Master) แปลงข้อมูลที่ซับซ้อนให้กลายเป็นเรื่องเล่าที่มีตัวละคร ความขัดแย้ง และจุดเปลี่ยน (Hero's Journey) ที่ผู้อ่านวางไม่ลง`,
  },
  {
    id: "gem-4",
    title: "Long-form to 10 Social Posts Repurposer",
    group: "content",
    groupLabel: "✍️ Content Creation",
    description: "นำบทความยาว 1 ชิ้น มาแยกย่อยเป็นโพสต์ Facebook, X (Twitter) Threads, และ Carousel Slide",
    targetModel: "ChatGPT / Claude",
    requiredTier: "standard",
    systemPrompt: `นำเนื้อหายาวที่ได้รับ มาแปลงเป็น 10 Micro-contents: 3 Facebook Posts, 3 Twitter Threads, 2 Carousel Slides, และ 2 Short Quotes ที่พร้อมโพสต์ทันที`,
  },

  // Design Group
  {
    id: "gem-5",
    title: "Midjourney v6.1 Ultra-Photorealistic Prompt",
    group: "design",
    groupLabel: "🎨 Visual & Design",
    description: "สูตรคำสั่งเจนภาพถ่ายบุคคล สินค้า และทัศนียภาพที่สมจริงระดับกล้องฟูลเฟรม 85mm f/1.4",
    targetModel: "Midjourney / ChatGPT",
    requiredTier: "standard",
    systemPrompt: `สร้าง Prompt ภาษาอังกฤษสำหรับ Midjourney v6.1 ที่ระบุ: Subject, Cinematic Lighting, Camera Angle, Lens & Aperture, Color Grading, และพารามิเตอร์ --ar 16:9 --v 6.1 --style raw ครบถ้วน`,
  },

  // Marketing Group
  {
    id: "gem-6",
    title: "High-Converting Facebook Ad Copywriter",
    group: "marketing",
    groupLabel: "💼 Business & Marketing",
    description: "เขียนคำโฆษณายิงแอดแบบ Direct Response ที่เน้นแก้ Pain Point และกระตุ้นยอดขายทันที",
    targetModel: "ChatGPT / Claude",
    requiredTier: "standard",
    systemPrompt: `เขียน Ad Copy สำหรับ Facebook Ads 3 รูปแบบ: แบบสั้น (Short Punchy), แบบกลาง (Story-based), และแบบยาว (Pain-Point Deep Dive) พร้อมพาดหัวที่หยุดนิ้วโป้ง`,
  },

  // Dev Group
  {
    id: "gem-7",
    title: "Fullstack Architecture & MCP Code Generator",
    group: "dev",
    groupLabel: "⚡ Dev & Automation",
    description: "ออกแบบสถาปัตยกรรมซอฟต์แวร์ เขียนโค้ด API และสร้างเซิร์ฟเวอร์ MCP ตามมาตรฐาน Model Context Protocol",
    targetModel: "Claude 3.7 Sonnet / Cursor",
    requiredTier: "premium",
    systemPrompt: `คุณคือ Principal Software Architect เชี่ยวชาญ Next.js, Supabase, และ Model Context Protocol (MCP) หน้าที่ของคุณคือสร้างโค้ดที่ Type-safe, สะอาด, ไม่เกิด N+1 Query และมี Security Definer ชัดเจน`,
  },
];

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "desktop" | "web" | "gems">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGem, setSelectedGem] = useState<AiGemItem | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // การกรองข้อมูล
  const filteredDesktop = DESKTOP_TOOLS.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWeb = WEB_APPS.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGems = AI_GEMS.filter((g) =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.groupLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCount = DESKTOP_TOOLS.length + WEB_APPS.length + AI_GEMS.length;

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="bg-brand-off-white min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* =========================================================================
            HEADER BANNER (ถอดแบบจากภาพต้นแบบ "ศูนย์รวมเครื่องมือทั้งหมด")
        ========================================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-brand-slate rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute right-0 top-0 w-96 h-96 bg-brand-emerald/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30">
              <Wrench className="w-4 h-4 text-brand-emerald" />
              <span>ศูนย์รวมเครื่องมือและทรัพยากร AI</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              ศูนย์รวมเครื่องมือทั้งหมด <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-300 to-brand-emerald">
                โปรแกรมสำเร็จรูป • แอปออนไลน์ • AI Gems
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              เครื่องมือทุ่นแรงที่คัดสรรมาเพื่อช่วยให้คุณประหยัดเวลา ไม่ต้องเริ่มต้นจากศูนย์ มีทั้งโปรแกรมรันในเครื่อง, เว็บแอปบนคลาวด์ และคลัง System Prompt ระดับเซียน
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" /> ปลดล็อกฟรีในสิทธิ์บุฟเฟต์
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" /> อัปเดตเวอร์ชันใหม่ต่อเนื่อง
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" /> ใช้งานได้ไม่จำกัดจำนวนครั้ง
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SEARCH & CATEGORY TABS (ถอดแบบจากภาพต้นแบบแท็บกลมมน)
        ========================================================================= */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Box */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อโปรแกรม, เครื่องมือ, AI Prompt..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 focus:border-brand-emerald transition-all"
              />
            </div>

            {/* Main Tabs (Pill Tabs) */}
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                  activeTab === "all"
                    ? "bg-brand-slate text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                ทั้งหมด ({totalCount})
              </button>
              <button
                onClick={() => setActiveTab("desktop")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "desktop"
                    ? "bg-brand-emerald text-white shadow shadow-brand-emerald/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                โปรแกรมสำเร็จรูป ({DESKTOP_TOOLS.length})
              </button>
              <button
                onClick={() => setActiveTab("web")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "web"
                    ? "bg-indigo-600 text-white shadow shadow-indigo-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                แอปออนไลน์ ({WEB_APPS.length})
              </button>
              <button
                onClick={() => setActiveTab("gems")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "gems"
                    ? "bg-brand-orange text-white shadow shadow-brand-orange/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                AI Gems ({AI_GEMS.length})
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 1: โปรแกรมสำเร็จรูป (DESKTOP TOOLS)
        ========================================================================= */}
        {(activeTab === "all" || activeTab === "desktop") && filteredDesktop.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center shadow-sm">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-brand-slate flex items-center gap-2">
                    โปรแกรมสำเร็จรูป (Desktop Software)
                    <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                      {filteredDesktop.length} โปรแกรม
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">ติดตั้งรันบนเครื่องคอมพิวเตอร์ของคุณ ประมวลผลเร็วด้วยการ์ดจอ ปลอดภัย ข้อมูลไม่หลุด</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDesktop.map((tool) => {
                const isPremium = tool.requiredTier === "premium";

                return (
                  <div
                    key={tool.id}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-xl hover:border-brand-emerald/40 transition-all flex flex-col justify-between group"
                  >
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          {tool.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isPremium
                              ? "bg-brand-orange text-white"
                              : "bg-brand-emerald-light text-brand-emerald-dark"
                          }`}
                        >
                          {isPremium ? "PREMIUM" : "STANDARD"}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-brand-slate group-hover:text-brand-emerald transition-colors line-clamp-1">
                        {tool.name}
                      </h3>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {tool.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{tool.os}</span>
                        <span className="font-mono">{tool.version} • {tool.fileSize}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">ฟรีในบุฟเฟต์</span>
                      <button
                        onClick={() => alert(`เริ่มดาวน์โหลด ${tool.name} แล้วครับ!`)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-dark transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>ดาวน์โหลด</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 2: แอปออนไลน์ (WEB APPS)
        ========================================================================= */}
        {(activeTab === "all" || activeTab === "web") && filteredWeb.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-brand-slate flex items-center gap-2">
                    แอปออนไลน์ (Cloud & Web Apps)
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                      {filteredWeb.length} แอป
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">เปิดใช้งานผ่านเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้งโปรแกรม รองรับทั้งบนมือถือและคอมพิวเตอร์</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredWeb.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:shadow-lg hover:border-indigo-400 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-600">
                        {app.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-emerald text-white">
                        {app.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-brand-slate group-hover:text-indigo-600 transition-colors">
                      {app.name}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {app.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-2 border-t border-slate-100">
                    <button
                      onClick={() => alert(`กำลังเปิดเข้าสู่ระบบ ${app.name} ผ่าน SSO...`)}
                      className="w-full py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>เปิดใช้งาน</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 3: คลัง AI GEMS & PROMPTS (สไตล์แบ่งกลุ่มสายงาน)
        ========================================================================= */}
        {(activeTab === "all" || activeTab === "gems") && filteredGems.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-orange to-amber-500 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-brand-slate flex items-center gap-2">
                    คลัง AI Gems & Custom System Prompts
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-orange/15 text-brand-orange font-bold">
                      {filteredGems.length} Gems
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">รวมคำสั่ง System Prompt เฉพาะทางสำหรับใส่ใน ChatGPT, Claude หรือ Custom GPTs ให้ตอบคมระดับมืออาชีพ</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGems.map((gem) => (
                <div
                  key={gem.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-xl hover:border-brand-orange/50 transition-all flex flex-col justify-between group"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600">
                        {gem.groupLabel}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                        {gem.targetModel}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-brand-slate group-hover:text-brand-orange transition-colors">
                      {gem.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {gem.description}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Prompt พร้อมใช้</span>
                    <button
                      onClick={() => setSelectedGem(gem)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange-hover hover:to-amber-600 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>เปิดดู Gem & คัดลอก</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal แสดง System Prompt และปุ่ม Copy 1-Click */}
        {selectedGem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                    {selectedGem.groupLabel}
                  </span>
                  <h3 className="text-lg font-bold text-brand-slate mt-1">
                    {selectedGem.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedGem(null)}
                  className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedGem.description}
              </p>

              {/* Box Code */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>System Prompt (ก๊อปปี้ไปวางใน ChatGPT / Claude ได้ทันที):</span>
                  <span className="font-mono text-[10px] text-brand-emerald">
                    แนะนำใช้กับ {selectedGem.targetModel}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs max-h-56 overflow-y-auto leading-relaxed border border-slate-800">
                  <pre className="whitespace-pre-wrap font-sans text-xs">{selectedGem.systemPrompt}</pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleCopyPrompt(selectedGem.systemPrompt)}
                  className="flex-1 py-3 px-4 rounded-xl text-center text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-dark transition-colors flex items-center justify-center gap-2 shadow"
                >
                  {copiedPrompt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPrompt ? "คัดลอก Prompt เรียบร้อยแล้ว!" : "คัดลอก System Prompt"}</span>
                </button>

                <button
                  onClick={() => setSelectedGem(null)}
                  className="py-3 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  ปิดหน้าต่าง
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

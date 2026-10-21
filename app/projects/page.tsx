"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Code2, 
  Search, 
  Download, 
  ExternalLink, 
  FolderGit2, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  BookOpen, 
  FileCode, 
  Copy,
  Check
} from "lucide-react";

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "all" | "automation" | "line-bot" | "extension" | "web-app" | "agentic-ai";
  categoryLabel: string;
  techStack: string[];
  requiredTier: "standard" | "premium";
  githubRepo?: string;
  hasGuide: boolean;
  fileSize: string;
}

const ALL_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    slug: "omni-voice-ai",
    title: "OmniVoice AI ภาษาไทย: ระบบสร้างและโคลนเสียง AI สไตล์นักพากย์",
    description: "ซอร์สโค้ด Node.js + Python API เชื่อมต่อโมเดลสร้างเสียงภาษาไทยธรรมชาติ มีระบบตัดต่อไฟล์เสียงและส่งออกอัตโนมัติ",
    category: "web-app",
    categoryLabel: "Web & API",
    techStack: ["Node.js", "Python", "FastAPI", "TTS Model"],
    requiredTier: "premium",
    hasGuide: true,
    fileSize: "18.2 MB",
  },
  {
    id: "proj-2",
    slug: "line-order-sheets",
    title: "ระบบบันทึกคำสั่งซื้อ + แจ้งเตือน LINE Notify & Google Sheets",
    description: "ระบบหลังบ้านสำเร็จรูป รับออเดอร์จากลูกค้า บันทึกลงตารางทันที และยิงการแจ้งเตือนยอดเงินเข้ากลุ่ม LINE ทีมงาน",
    category: "line-bot",
    categoryLabel: "LINE Bot & CRM",
    techStack: ["Next.js", "Google Sheets API", "LINE OA", "Supabase"],
    requiredTier: "standard",
    hasGuide: true,
    fileSize: "4.8 MB",
  },
  {
    id: "proj-3",
    slug: "shopee-spx-extension",
    title: "SP X Chrome Extension: ดึงข้อมูลสินค้า Shopee & เช็คยอดขาย",
    description: "ส่วนขยายเบราว์เซอร์สแกนและดึงราคาสินค้า, จำนวนยอดขาย, และร้านค้าคู่แข่ง นำข้อมูลออกเป็น Excel/CSV ได้ใน 1 คลิก",
    category: "extension",
    categoryLabel: "Chrome Extension",
    techStack: ["JavaScript", "Chrome Manifest V3", "Tailwind CSS"],
    requiredTier: "standard",
    hasGuide: true,
    fileSize: "2.5 MB",
  },
  {
    id: "proj-4",
    slug: "classroom-toolkit-mcp",
    title: "Classroom Toolkit MCP Server: ควบคุมสิทธิ์ AI Agent พร้อมระบบ Token",
    description: "เซิร์ฟเวอร์ MCP ต้นแบบตามมาตรฐาน Model Context Protocol สำหรับเชื่อม Claude Desktop เข้ากับฐานข้อมูลโรงเรียน พร้อมระบบเช็คสิทธิ์",
    category: "agentic-ai",
    categoryLabel: "Agentic AI & MCP",
    techStack: ["Node.js", "MCP SDK", "TypeScript", "Supabase"],
    requiredTier: "premium",
    hasGuide: true,
    fileSize: "6.4 MB",
  },
  {
    id: "proj-5",
    slug: "line-crm-assistant",
    title: "Unlock CRM LINE: ระบบจัดการลูกค้าและแชทบอทอัจฉริยะสำหรับธุรกิจ",
    description: "ระบบ CRM บริหารลูกค้าผ่าน LINE Official Account แยกแท็กความสนใจ ตอบคำถามตามหมวดหมู่ และติดตามสถานะดีล",
    category: "line-bot",
    categoryLabel: "LINE Bot & CRM",
    techStack: ["Vue.js", "Node.js", "LINE Messaging API", "PostgreSQL"],
    requiredTier: "premium",
    hasGuide: true,
    fileSize: "28.5 MB",
  },
  {
    id: "proj-6",
    slug: "faceboom-auto-comment",
    title: "FaceBoom Auto Comment: บอทตอบความคิดเห็นหน้าเพจ Facebook อัตโนมัติ",
    description: "ระบบจับคีย์เวิร์ดใต้โพสต์ ยิงแชทดึงเข้า Messenger ป้องกันการแอบแฝงขายของ และดึงลูกค้าเข้าสู่ระบบปิดการขาย",
    category: "automation",
    categoryLabel: "Automation",
    techStack: ["Python", "Facebook Graph API", "Cloudflare Workers"],
    requiredTier: "standard",
    hasGuide: true,
    fileSize: "5.1 MB",
  },
  {
    id: "proj-7",
    slug: "coffee-pos-system",
    title: "Unlock Coffee POS: ระบบคิดเงินหน้าร้านกาแฟและร้านอาหาร",
    description: "โปรแกรม POS สไตล์มินิมอล ใช้งานง่ายทั้งบน iPad และคอมพิวเตอร์ รองรับการสแกน PromptPay QR Code และตัดสต็อกสินค้า",
    category: "web-app",
    categoryLabel: "Web & API",
    techStack: ["React", "Tailwind CSS", "Supabase", "PromptPay QR"],
    requiredTier: "standard",
    hasGuide: true,
    fileSize: "14.0 MB",
  },
  {
    id: "proj-8",
    slug: "ant-office-colony",
    title: "Ant Office Colony: ระบบรัน Multi-Agent ทำงานแทนทีมงาน 5 ตำแหน่ง",
    description: "เวิร์กโฟลว์ AI Agent 5 ตัว คุยและส่งต่องานกันเอง (Researcher -> Copywriter -> Designer -> Reviewer -> Publisher) แบบอัตโนมัติ",
    category: "agentic-ai",
    categoryLabel: "Agentic AI & MCP",
    techStack: ["Python", "LangChain / CrewAI", "Claude API", "Streamlit"],
    requiredTier: "premium",
    hasGuide: true,
    fileSize: "9.6 MB",
  },
  {
    id: "proj-9",
    slug: "auto-blogger-n8n",
    title: "Auto Blogger n8n: เขียนบทความ SEO และโพสต์ลงเว็บอัตโนมัติ",
    description: "Workflow n8n ดึงหัวข้อเทรนด์ฮิต เจนเนื้อหา 2,000 คำ พร้อมภาพประกอบ AI และโพสต์ลง WordPress ตามรอบเวลา",
    category: "automation",
    categoryLabel: "Automation",
    techStack: ["n8n Workflow", "ChatGPT API", "WordPress REST API"],
    requiredTier: "standard",
    hasGuide: true,
    fileSize: "3.2 MB",
  },
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTier, setSelectedTier] = useState<"all" | "standard" | "premium">("all");
  const [selectedModalProject, setSelectedModalProject] = useState<ProjectItem | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const categories = [
    { id: "all", name: "ทั้งหมด" },
    { id: "agentic-ai", name: "Agentic AI & MCP" },
    { id: "automation", name: "Automation & n8n" },
    { id: "line-bot", name: "LINE Bot & CRM" },
    { id: "extension", name: "Chrome Extensions" },
    { id: "web-app", name: "Web Application" },
  ];

  const filteredProjects = ALL_PROJECTS.filter((proj) => {
    const matchQuery =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchCategory = selectedCategory === "all" || proj.category === selectedCategory;
    const matchTier = selectedTier === "all" || proj.requiredTier === selectedTier;

    return matchQuery && matchCategory && matchTier;
  });

  const handleCopyCode = () => {
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="bg-brand-off-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* =========================================================================
            HEADER BANNER (ถอดแบบจากภาพต้นแบบ "โปรเจกต์พร้อมซอร์สโค้ด")
        ========================================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-slate to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-brand-emerald/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
              <Code2 className="w-4 h-4 text-brand-orange" />
              <span>คลังโปรเจกต์พร้อมซอร์สโค้ด</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              รวมโปรเจกต์และระบบพร้อมใช้งาน <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-300 to-brand-emerald">
                ดาวน์โหลดโค้ดฟรี มีคู่มือ พร้อมต่อยอด
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              เราเตรียมโค้ดเต็ม (Full Source Code) ของระบบที่ใช้งานจริง ให้คุณดาวน์โหลดไปติดตั้ง นำไปต่อยอดธุรกิจ หรือศึกษาเป็นตัวอย่างได้ทันทีในสิทธิ์สมาชิก
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" /> เอาไปใช้งานจริงได้ทันที
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" /> ศึกษาโค้ดคลีน Architecture
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" /> มีคู่มือ Setup และ Environment
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SEARCH & FILTER CONTROLS
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
                placeholder="ค้นหาชื่อโปรเจกต์, เทคโนโลยี (Next.js, Python, LINE)..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 focus:border-brand-emerald transition-all"
              />
            </div>

            {/* Tier Filter Tabs */}
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedTier("all")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                  selectedTier === "all"
                    ? "bg-brand-slate text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                ทั้งหมด ({ALL_PROJECTS.length})
              </button>
              <button
                onClick={() => setSelectedTier("standard")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedTier === "standard"
                    ? "bg-brand-emerald text-white shadow shadow-brand-emerald/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-brand-emerald-dark"></span>
                Standard โหลดได้ ({ALL_PROJECTS.filter((p) => p.requiredTier === "standard").length})
              </button>
              <button
                onClick={() => setSelectedTier("premium")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedTier === "premium"
                    ? "bg-brand-orange text-white shadow shadow-brand-orange/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-200" />
                Premium โหลดได้ ({ALL_PROJECTS.filter((p) => p.requiredTier === "premium").length})
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-indigo-600 text-white font-bold shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            PROJECTS GRID (สไตล์ UDEMY + แถบ DOUBLE BADGES ส้ม/ม่วง/เขียว)
        ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isPremium = project.requiredTier === "premium";

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-xl hover:border-brand-emerald/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Visual Header with Double Badges */}
                  <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
                    <div className="flex items-center justify-between relative z-10">
                      {/* Badge ซ้าย: พร้อมโค้ด */}
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-indigo-500/80 text-white flex items-center gap-1 shadow">
                        <Terminal className="w-3 h-3" /> พร้อมโค้ด
                      </span>

                      {/* Badge ขวา: สิทธิ์สมาชิก */}
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold shadow ${
                          isPremium
                            ? "bg-brand-orange text-white"
                            : "bg-brand-emerald text-white"
                        }`}
                      >
                        {isPremium ? "PREMIUM VIP" : "ฟรีสำหรับสมาชิก"}
                      </span>
                    </div>

                    <div className="mt-6 mb-2 relative z-10">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-400">
                        {project.categoryLabel}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-brand-orange transition-colors mt-0.5 line-clamp-1">
                        {project.title}
                      </h3>
                    </div>

                    <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Code2 className="w-24 h-24 text-white -mr-4 -mb-4" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer with Download Action */}
                <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{project.fileSize} • มีคู่มือครบ</span>
                  </div>

                  <button
                    onClick={() => setSelectedModalProject(project)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange-hover hover:to-amber-600 transition-all flex items-center gap-1.5 shadow-md shadow-brand-orange/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดูโค้ด & ดาวน์โหลด</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal แสดงรายละเอียดการดาวน์โหลดและติดตั้ง */}
        {selectedModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    {selectedModalProject.categoryLabel}
                  </span>
                  <h3 className="text-lg font-bold text-brand-slate mt-1">
                    {selectedModalProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedModalProject(null)}
                  className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>แพ็กเกจซอร์สโค้ดพร้อมใช้งาน</span>
                  <span className="text-brand-emerald font-semibold">
                    {selectedModalProject.fileSize}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedModalProject.description}
                </p>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-brand-emerald" />
                  <span>ตรวจสอบสิทธิ์ผ่าน Supabase License เรียบร้อย</span>
                </div>
              </div>

              {/* Quick Setup Code Snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>คำสั่งรันโปรเจกต์ (Terminal Setup):</span>
                  <button
                    onClick={handleCopyCode}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 text-[11px]"
                  >
                    {copiedKey ? <Check className="w-3 h-3 text-brand-emerald" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey ? "คัดลอกแล้ว!" : "คัดลอก"}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
                  <code>npm install && npm run dev</code>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("เริ่มดาวน์โหลดไฟล์ ZIP พร้อมคู่มือเรียบร้อยครับ!");
                  }}
                  className="flex-1 py-3 px-4 rounded-xl text-center text-xs font-bold text-white bg-brand-emerald hover:bg-brand-emerald-dark transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>ดาวน์โหลดไฟล์โปรเจกต์ (.ZIP)</span>
                </a>

                <button
                  onClick={() => setSelectedModalProject(null)}
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

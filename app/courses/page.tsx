"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Sparkles, 
  Star, 
  Clock, 
  BookOpen, 
  Lock, 
  PlayCircle, 
  Filter, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Zap,
  Layers
} from "lucide-react";

// ประเภทข้อมูลคอร์ส
interface CourseItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  required_tier: "standard" | "premium";
  instructor: string;
  duration_hours: number;
  episodes_count: number;
  free_preview_count: number;
  rating: number;
  review_count: number;
  is_bestseller?: boolean;
}

// ข้อมูลคอร์สจำลองที่มีคุณภาพสูง ครอบคลุมทั้งหมวด Standard และ Premium
const ALL_COURSES: CourseItem[] = [
  // --- กลุ่ม Premium Exclusive ---
  {
    id: "prem-1",
    slug: "ai-game-developer",
    title: "AI Game Developer: Vibe Coding สร้างเกม 2D/MMO ด้วย AI ใครก็ทำได้",
    description: "เจาะลึกการใช้ Claude และ AI Agent เขียนโค้ดเกมตั้งแต่เริ่มต้นจนถึงระบบ Multi-player MMO พร้อมซอร์สโค้ดครบชุด",
    category: "Coding & Agents",
    required_tier: "premium",
    instructor: "AI Academy Team",
    duration_hours: 8.5,
    episodes_count: 8,
    free_preview_count: 1,
    rating: 4.9,
    review_count: 512,
    is_bestseller: true,
  },
  {
    id: "prem-2",
    slug: "claude-masterclass",
    title: "Claude 3.5 & 3.7 Sonnet Masterclass: รัน Agentic Coding ระดับเซียน",
    description: "สั่ง Claude Code และสร้าง MCP Server เช็คสิทธิ์และเชื่อมฐานข้อมูลในระดับโปรดักชัน",
    category: "Coding & Agents",
    required_tier: "premium",
    instructor: "AI Academy Team",
    duration_hours: 6.5,
    episodes_count: 10,
    free_preview_count: 2,
    rating: 4.9,
    review_count: 680,
    is_bestseller: true,
  },
  {
    id: "prem-3",
    slug: "n8n-automation-pro",
    title: "n8n Automation Pro Workflows: ดึงข้อมูลอัตโนมัติ ยิงแชท LINE และ CRM",
    description: "สร้าง Workflow อัตโนมัติช่วยประหยัดเวลาการทำงาน ลดงานซ้ำซาก 90% ด้วยระบบ No-Code + AI",
    category: "Automation",
    required_tier: "premium",
    instructor: "AI Academy Team",
    duration_hours: 10.0,
    episodes_count: 15,
    free_preview_count: 1,
    rating: 4.8,
    review_count: 420,
  },
  {
    id: "prem-4",
    slug: "vibe-coding-fullstack",
    title: "Vibe Coding Fullstack App: สร้าง Web App สเกลจริงด้วย Next.js & Supabase",
    description: "สอนเขียน Fullstack Web Application สมัยใหม่ ไม่ต้องจำไวยากรณ์ ใช้ AI ช่วยออกแบบและโค้ดตั้งแต่หน้าแรกจนถึงขึ้น Vercel",
    category: "Coding & Agents",
    required_tier: "premium",
    instructor: "AI Academy Team",
    duration_hours: 9.0,
    episodes_count: 12,
    free_preview_count: 1,
    rating: 4.9,
    review_count: 388,
  },

  // --- กลุ่ม Standard Buffet ---
  {
    id: "std-1",
    slug: "ai-content-video-mastery",
    title: "สร้างช่อง YouTube & TikTok ด้วย AI วิดีโอสั้นปังใน 10 นาที",
    description: "สูตรลับการใช้ AI คิด Hook, เขียนสคริปต์, ตัดต่อ และสร้างเสียงบรรยายไทยที่สมจริง",
    category: "Content & Video",
    required_tier: "standard",
    instructor: "AI Academy Team",
    duration_hours: 5.0,
    episodes_count: 9,
    free_preview_count: 2,
    rating: 4.8,
    review_count: 1250,
    is_bestseller: true,
  },
  {
    id: "std-2",
    slug: "midjourney-mastery",
    title: "Midjourney Mastery: วาดภาพประกอบ ปกหนังสือ โลโก้ และสินค้าให้ขายได้",
    description: "รวมเทคนิคการเขียน Prompt คุมสไตล์ ตัวละครเดิม และการสร้างภาพความละเอียดสูง 4K",
    category: "Design & Art",
    required_tier: "standard",
    instructor: "AI Academy Team",
    duration_hours: 4.5,
    episodes_count: 8,
    free_preview_count: 1,
    rating: 4.9,
    review_count: 980,
  },
  {
    id: "std-3",
    slug: "line-chatbot-ai",
    title: "สร้างบอท LINE OA ปิดการขายอัตโนมัติด้วย ChatGPT API",
    description: "ประกอบร่างแชทบอทตอบคำถามลูกค้า รับออเดอร์ และสรุปยอดขายลง Google Sheets แบบจับมือทำ",
    category: "Marketing & Sales",
    required_tier: "standard",
    instructor: "AI Academy Team",
    duration_hours: 6.0,
    episodes_count: 11,
    free_preview_count: 2,
    rating: 4.8,
    review_count: 740,
  },
  {
    id: "std-4",
    slug: "notion-ai-productivity",
    title: "Notion AI จัดการชีวิตและธุรกิจ: บริหารเวลาและโปรเจกต์แบบมืออาชีพ",
    description: "ออกแบบระบบ Second Brain สรุปเอกสาร บันทึกการประชุม และวางแผนงานด้วย AI อัจฉริยะ",
    category: "Productivity",
    required_tier: "standard",
    instructor: "AI Academy Team",
    duration_hours: 3.5,
    episodes_count: 7,
    free_preview_count: 1,
    rating: 4.7,
    review_count: 310,
  },
  {
    id: "std-5",
    slug: "chatgpt-business-prompts",
    title: "ChatGPT for Business: 100+ สูตร Prompt ทำการตลาด ยิงแอด เขียนคอนเทนต์",
    description: "รวมคำสั่งที่ผ่านการทดสอบจริงเพื่อเร่งยอดขายและลดเวลาการทำงานสำหรับเจ้าของธุรกิจ",
    category: "Marketing & Sales",
    required_tier: "standard",
    instructor: "AI Academy Team",
    duration_hours: 4.0,
    episodes_count: 8,
    free_preview_count: 2,
    rating: 4.8,
    review_count: 890,
  },
  {
    id: "std-6",
    slug: "wordpress-ai-automation",
    title: "WordPress AI Automation: เขียนบทความ SEO และโพสต์อัตโนมัติ",
    description: "ระบบดึงคีย์เวิร์ด เจนบทความคุณภาพสูง 1,500 คำ และโพสต์ลงเว็บแบบตั้งเวลาได้เอง",
    category: "Automation",
    required_tier: "standard",
    instructor: "AI Academy Team",
    duration_hours: 5.5,
    episodes_count: 9,
    free_preview_count: 1,
    rating: 4.7,
    review_count: 290,
  },
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<"all" | "standard" | "premium">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "ทุกหมวดหมู่" },
    { id: "Coding & Agents", name: "Coding & AI Agents" },
    { id: "Automation", name: "Automation & Workflows" },
    { id: "Content & Video", name: "Content & Video" },
    { id: "Design & Art", name: "Design & Midjourney" },
    { id: "Marketing & Sales", name: "Marketing & Sales" },
    { id: "Productivity", name: "Productivity" },
  ];

  // ฟิลเตอร์คอร์สตามเงื่อนไข
  const filteredCourses = ALL_COURSES.filter((course) => {
    const matchQuery =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchTier = selectedTier === "all" || course.required_tier === selectedTier;
    const matchCategory = selectedCategory === "all" || course.category === selectedCategory;

    return matchQuery && matchTier && matchCategory;
  });

  const premiumCourses = filteredCourses.filter((c) => c.required_tier === "premium");
  const standardCourses = filteredCourses.filter((c) => c.required_tier === "standard");

  return (
    <div className="bg-brand-off-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* =========================================================================
            HEADER & HERO BANNER
        ========================================================================= */}
        <div className="bg-gradient-to-r from-brand-slate via-slate-900 to-slate-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-brand-emerald/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 bottom-0 w-80 h-80 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-emerald/20 text-brand-emerald text-xs font-bold uppercase tracking-wider border border-brand-emerald/30">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
              <span>คลังคอร์สเรียน AI ทั้งหมด</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              พัฒนาทักษะแห่งอนาคต <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-300 to-brand-emerald">
                เรียนแบบบุฟเฟต์ เข้าได้ทุกเนื้อหา
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              เลือกเรียนได้ตามจังหวะของคุณ ทุกคอร์สคัดสรรจากประสบการณ์จริง มีการบ้าน ซอร์สโค้ด และการันตีความคุ้มค่า
            </p>
          </div>
        </div>

        {/* =========================================================================
            SEARCH & FILTER CONTROLS (สไตล์ UDEMY)
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
                placeholder="ค้นหาชื่อคอร์ส, เทคโนโลยี, ผู้สอน..."
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
                ทั้งหมด ({ALL_COURSES.length})
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
                Standard ({ALL_COURSES.filter((c) => c.required_tier === "standard").length})
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
                Premium Exclusive ({ALL_COURSES.filter((c) => c.required_tier === "premium").length})
              </button>
            </div>
          </div>

          {/* Category Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Filter className="w-3.5 h-3.5" /> หมวดหมู่:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-brand-emerald/15 text-brand-emerald-dark font-bold border border-brand-emerald/30"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            SECTION 1: PREMIUM EXCLUSIVE COURSES
        ========================================================================= */}
        {(selectedTier === "all" || selectedTier === "premium") && premiumCourses.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-orange to-amber-500 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-brand-slate flex items-center gap-2">
                    Premium Masterclass & Exclusive
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-orange/15 text-brand-orange font-bold">
                      {premiumCourses.length} คอร์ส
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">คอร์สระดับสูงสำหรับผู้เรียน Premium พร้อมซอร์สโค้ดและสิทธิ์เข้าถึง MCP Server</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {premiumCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 2: STANDARD BUFFET COURSES
        ========================================================================= */}
        {(selectedTier === "all" || selectedTier === "standard") && standardCourses.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-emerald text-white flex items-center justify-center shadow-sm">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-brand-slate flex items-center gap-2">
                    Standard Buffet Courses
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-emerald/15 text-brand-emerald-dark font-bold">
                      {standardCourses.length} คอร์ส
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">คอร์สพื้นฐานและการประยุกต์ใช้ AI ในการทำงานจริง เรียนได้ไม่จำกัดในแพ็กเกจ Standard</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {standardCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}

        {/* กรณีค้นหาไม่เจอ */}
        {filteredCourses.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">ไม่พบคอร์สที่ตรงกับคำค้นหา</h3>
            <p className="text-sm text-slate-500">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นดูนะครับ</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTier("all");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 text-xs font-semibold text-brand-emerald border border-brand-emerald rounded-full hover:bg-brand-emerald/10 transition-colors"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// =========================================================================
// UDEMY-STYLE COURSE CARD COMPONENT
// =========================================================================
function CourseCard({ course }: { course: CourseItem }) {
  const isPremium = course.required_tier === "premium";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-xl hover:border-brand-emerald/50 transition-all duration-300 flex flex-col group">
      
      {/* 16:9 Thumbnail Cover */}
      <Link href={`/courses/${course.slug}`} className="relative aspect-video bg-slate-900 overflow-hidden block">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between">
          <span
            className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider shadow ${
              isPremium
                ? "bg-gradient-to-r from-brand-orange to-amber-500 text-white"
                : "bg-brand-emerald text-white"
            }`}
          >
            {isPremium ? "PREMIUM" : "STANDARD"}
          </span>

          {course.is_bestseller && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
              Bestseller
            </span>
          )}
        </div>

        {/* Bottom Time & Episodes */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between text-[11px] text-slate-200">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-brand-emerald" /> {course.duration_hours} ชม.
          </span>
          <span>{course.episodes_count} บทเรียน</span>
        </div>

        {/* Visual Cover Placeholder */}
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-400 p-4 text-center group-hover:scale-105 transition-transform duration-300">
          <PlayCircle className="w-10 h-10 text-white/40 group-hover:text-brand-orange group-hover:scale-110 transition-all mb-1" />
          <span className="text-xs font-semibold text-slate-300 line-clamp-1">{course.title}</span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[11px] font-bold text-brand-emerald uppercase tracking-wider">
            {course.category}
          </span>
          
          <Link href={`/courses/${course.slug}`}>
            <h3 className="text-sm font-bold text-brand-slate leading-snug group-hover:text-brand-emerald transition-colors line-clamp-2 mt-1">
              {course.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{course.instructor}</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-xs font-extrabold text-amber-500">{course.rating}</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="text-[11px] text-slate-400">({course.review_count})</span>
          </div>
        </div>

        {/* Card Footer Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-emerald-light text-brand-emerald-dark">
            บุฟเฟต์
          </span>

          <Link
            href={`/courses/${course.slug}`}
            className="text-xs font-bold text-slate-700 hover:text-brand-orange flex items-center gap-1 group/btn"
          >
            <span>เข้าเรียน</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

    </div>
  );
}

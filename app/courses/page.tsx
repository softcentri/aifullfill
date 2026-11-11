"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
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
  ShieldCheck,
  Zap,
  Layers,
  Laptop,
  Cpu,
  Coins
} from "lucide-react";

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

// ข้อมูล 9 คอร์สหลักตาม Master Roadmap ของอาจารย์อั๋น
const MASTER_COURSES: CourseItem[] = [
  // หมวด 1: AI Creator & Visual Production
  {
    id: "c-101",
    slug: "course-101-ai-ebook-masterclass",
    title: "Course 101: AI E-Book & Digital Asset Masterclass (ลายเซ็นอาจารย์อั๋น)",
    description: "ผลิต E-Book และสื่อดิจิทัลแบบ Full Pipeline ครบวงจรโดยแทบไม่มีต้นทุนเครื่องมือ ออกแบบปก 3D Mockup จัดรูปเล่มพร้อมขายทำเงิน",
    category: "AI Creator & Production",
    required_tier: "standard",
    instructor: "อาจารย์อั๋น (AIEbookAcademy)",
    duration_hours: 5.5,
    episodes_count: 5,
    free_preview_count: 1,
    rating: 4.9,
    review_count: 640,
    is_bestseller: true,
  },
  {
    id: "c-102",
    slug: "course-102-comfyui-zero-to-hero",
    title: "Course 102: ComfyUI Zero-to-Hero: คุมงานภาพและกราฟิกระดับเทพแบบฟรี 100%",
    description: "ปลดแอกค่าสมาชิก Midjourney ด้วย ComfyUI ในเครื่อง คุม Character หน้าตรง คุมแสง Inpainting แก้เฉพาะจุดด้วย Flux & SDXL",
    category: "AI Creator & Production",
    required_tier: "standard",
    instructor: "อาจารย์อั๋น (AIEbookAcademy)",
    duration_hours: 7.0,
    episodes_count: 8,
    free_preview_count: 1,
    rating: 4.9,
    review_count: 512,
    is_bestseller: true,
  },
  {
    id: "c-103",
    slug: "course-103-ai-video-production",
    title: "Course 103: AI Video Production: Google Flow, Grok Video & Minimax",
    description: "ผลิตคลิปไวรัลและคลิปเล่าเรื่องคุณภาพสูง ด้วยต้นทุนที่ถูกที่สุด ผ่าน Google Flow, Grok Video, Minimax (Video/Voice) และ CapCut",
    category: "AI Creator & Production",
    required_tier: "standard",
    instructor: "อาจารย์อั๋น (AIEbookAcademy)",
    duration_hours: 6.0,
    episodes_count: 7,
    free_preview_count: 1,
    rating: 4.8,
    review_count: 430,
  },

  // หมวด 2: Desktop Agents & Vibe Coding
  {
    id: "c-201",
    slug: "course-201-desktop-agent-mastery",
    title: "Course 201: Desktop Agent Mastery (Antigravity & Cowork / Codex)",
    description: "ปูพื้นฐานการใช้ Desktop Agent ทำงานแทนมนุษย์ อ่าน-แก้-สร้างไฟล์ในเครื่อง สั่งงานแบบโปรเจกต์เดียวจบ ติดตั้งสภาพแวดล้อมพร้อมใช้",
    category: "Desktop Agents & Vibe Coding",
    required_tier: "standard",
    instructor: "อาจารย์อั๋น (AIEbookAcademy)",
    duration_hours: 6.5,
    episodes_count: 6,
    free_preview_count: 1,
    rating: 4.9,
    review_count: 380,
    is_bestseller: true,
  },
  {
    id: "c-202",
    slug: "course-202-vibe-coding-web-app",
    title: "Course 202: Vibe Coding สร้าง Web Application ด้วย Desktop Agent + Supabase",
    description: "สร้างเว็บพร้อมระบบฐานข้อมูลและระบบล็อกอิน โดยสั่งงานผ่าน Desktop Agent (Antigravity / Codex) แบบ Non-coder ไร้ปัญหา N+1 Query",
    category: "Desktop Agents & Vibe Coding",
    required_tier: "premium",
    instructor: "อาจารย์อั๋น (AIEbookAcademy)",
    duration_hours: 8.5,
    episodes_count: 9,
    free_preview_count: 1,
    rating: 4.9,
    review_count: 720,
    is_bestseller: true,
  },
  {
    id: "c-203",
    slug: "course-203-micro-tools-chrome-extensions",
    title: "Course 203: สร้าง Micro-Tools & Chrome Extensions ใช้เองและแจก/ขาย",
    description: "ให้ Desktop Agent เสกเครื่องมือช่วยงานขนาดเล็ก และปลั๊กอินเบราว์เซอร์สำหรับช่วยงานเฉพาะทางเพื่อสร้างรายได้",
    category: "Desktop Agents & Vibe Coding",
    required_tier: "premium",
    instructor: "อาจารย์อั๋น (AIEbookAcademy)",
    duration_hours: 5.0,
    episodes_count: 6,
    free_preview_count: 1,
    rating: 4.8,
    review_count: 290,
  },

  // หมวด 3: Smart Automations, Hermes & Local AI
  {
    id: "c-301",
    slug: "course-301-local-llm-unleashed",
    title: "Course 301: Local LLM Unleashed: รัน AI ฟรี ไม่จำกัด ไม่ง้อเน็ต ไม่ง้อ API",
    description: "ติดตั้ง DeepSeek / Llama ผ่าน Ollama ในคอมพิวเตอร์ตัวเอง ใช้งานข้อมูลลับส่วนตัว ปลอดภัยสูงสุด และฟรี 100% ตลอดชีพ",
    category: "Automations & Local AI",
    required_tier: "standard",
    instructor: "อาจารย์อั๋น (AIEbookAcademy)",
    duration_hours: 5.5,
    episodes_count: 6,
    free_preview_count: 1,
    rating: 4.9,
    review_count: 560,
  },
  {
    id: "c-302",
    slug: "course-302-ai-automation-hermes-grokbot",
    title: "Course 302: AI Automation with Grokbot & Hermes Agent",
    description: "สร้างระบบออโตเมชันเฝ้าติดตามข้อมูล ทำคอนเทนต์อัตโนมัติ และรันงาน Background ด้วย Hermes & grokbot",
    category: "Automations & Local AI",
    required_tier: "premium",
    instructor: "อาจารย์อั๋น (AIEbookAcademy)",
    duration_hours: 6.0,
    episodes_count: 7,
    free_preview_count: 1,
    rating: 4.8,
    review_count: 310,
  },

  // หมวด 4: Monetization
  {
    id: "c-401",
    slug: "course-401-lean-ai-monetization",
    title: "Course 401: Lean AI Monetization: ลงทุนต่ำที่สุด กำไรเต็มเม็ดเต็มหน่วย",
    description: "แผนการสร้างรายได้จากทักษะ AI แบบ Cost-effective: ขาย Digital Assets, รับทำเว็บด้วย Vibe Coding, รับงานวิดีโอ พร้อม Offer Blueprint",
    category: "Lean Monetization",
    required_tier: "standard",
    instructor: "อาจารย์อั๋น (AIEbookAcademy)",
    duration_hours: 4.5,
    episodes_count: 5,
    free_preview_count: 1,
    rating: 4.9,
    review_count: 850,
    is_bestseller: true,
  },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>(MASTER_COURSES);
  const [userSubscription, setUserSubscription] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<"all" | "standard" | "premium">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const supabase = createClient();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const q = sp.get("q");
      const tier = sp.get("tier");
      if (q) setSearchQuery(q);
      if (tier === "standard" || tier === "premium") setSelectedTier(tier);
    }

    const fetchCoursesFromSupabase = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: sub } = await supabase
            .from("user_subscriptions")
            .select("tier, status, current_period_end")
            .eq("user_id", user.id)
            .eq("status", "active")
            .maybeSingle();
          setUserSubscription(sub);
        }

        const { data: dbCourses, error } = await supabase
          .from("courses")
          .select(`
            id,
            slug,
            title,
            description,
            instructor,
            required_tier,
            course_episodes (
              id,
              duration_minutes,
              is_free_preview
            )
          `)
          .eq("is_published", true)
          .order("order_number", { ascending: true });

        if (!error && dbCourses && dbCourses.length > 0) {
          const mappedCourses: CourseItem[] = dbCourses.map((c: any) => {
            const episodes = c.course_episodes || [];
            const totalMinutes = episodes.reduce((acc: number, curr: any) => acc + (curr.duration_minutes || 0), 0);
            const freeCount = episodes.filter((ep: any) => ep.is_free_preview).length;

            let cat = "AI Creator & Production";
            if (c.slug.includes("201") || c.slug.includes("202") || c.slug.includes("203")) {
              cat = "Desktop Agents & Vibe Coding";
            } else if (c.slug.includes("301") || c.slug.includes("302")) {
              cat = "Automations & Local AI";
            } else if (c.slug.includes("401")) {
              cat = "Lean Monetization";
            }

            return {
              id: c.id,
              slug: c.slug,
              title: c.title,
              description: c.description || "",
              category: cat,
              required_tier: c.required_tier,
              instructor: c.instructor || "อาจารย์อั๋น (AIEbookAcademy)",
              duration_hours: parseFloat((totalMinutes / 60).toFixed(1)) || 5.0,
              episodes_count: episodes.length || 6,
              free_preview_count: freeCount || 1,
              rating: 4.9,
              review_count: 450 + Math.floor(Math.random() * 200),
              is_bestseller: c.slug.includes("101") || c.slug.includes("202") || c.slug.includes("401"),
            };
          });

          setCourses(mappedCourses);
        }
      } catch (err) {
        console.error("Error fetching courses from Supabase:", err);
      }
    };

    fetchCoursesFromSupabase();
  }, [supabase]);

  const categories = [
    { id: "all", name: "ทุกหมวดหมู่" },
    { id: "AI Creator & Production", name: "1. AI Creator & E-Book" },
    { id: "Desktop Agents & Vibe Coding", name: "2. Desktop Agents & Vibe Coding" },
    { id: "Automations & Local AI", name: "3. Local AI & Automations" },
    { id: "Lean Monetization", name: "4. Lean AI Monetization" },
  ];

  const filteredCourses = courses.filter((course) => {
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
    <div className="bg-brand-slate text-slate-100 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* =========================================================================
            HEADER & HERO BANNER (อ้างอิงปรัชญา Maximum Output, Minimum Cost)
        ========================================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800 tactile-card">
          <div className="absolute right-0 top-0 w-96 h-96 bg-brand-emerald/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 bottom-0 w-80 h-80 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-emerald/20 text-brand-emerald text-xs font-bold uppercase tracking-wider border border-brand-emerald/30">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
              <span>หลักสูตรแม่บท aifullfill • สอนโดย อาจารย์อั๋น</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Maximum Output, Minimum Cost <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-300 to-brand-emerald">
                คลังหลักสูตร AI บุฟเฟต์ ไม่ผลักภาระค่าเครื่องมือ
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              เน้นใช้ Desktop Agents (Antigravity / Codex), Open-Source (ComfyUI / Ollama DeepSeek) และระบบฟรี ทำงานจริง สร้างรายได้จริงในคอมพิวเตอร์ของคุณ
            </p>
          </div>
        </div>

        {/* =========================================================================
            SEARCH & FILTER CONTROLS (สไตล์ UDEMY)
        ========================================================================= */}
        <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-sm tactile-card space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Box */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อคอร์ส (101, ComfyUI, Vibe Coding, Local AI)..."
                className="w-full pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 focus:border-brand-emerald transition-all"
              />
            </div>

            {/* Tier Filter Tabs */}
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedTier("all")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                  selectedTier === "all"
                    ? "bg-white text-slate-950 shadow"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                ทั้งหมด ({courses.length})
              </button>
              <button
                onClick={() => setSelectedTier("standard")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedTier === "standard"
                    ? "bg-brand-emerald text-slate-950 shadow shadow-brand-emerald/20"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-brand-emerald"></span>
                Standard ({courses.filter((c) => c.required_tier === "standard").length})
              </button>
              <button
                onClick={() => setSelectedTier("premium")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedTier === "premium"
                    ? "bg-brand-orange text-white shadow shadow-brand-orange/20"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-200" />
                Premium Exclusive ({courses.filter((c) => c.required_tier === "premium").length})
              </button>
            </div>
          </div>

          {/* Category Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Filter className="w-3.5 h-3.5" /> หมวดหมู่:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-brand-emerald/15 text-brand-emerald font-bold border border-brand-emerald/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
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
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-orange to-amber-500 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    Premium Masterclass & Exclusive (Vibe Coding & Agentic AI)
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-orange/15 text-brand-orange font-bold">
                      {premiumCourses.length} คอร์ส
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">คอร์สระดับสูงสำหรับผู้เรียน Premium พร้อมซอร์สโค้ดและสิทธิ์เข้าถึง MCP Server</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumCourses.map((course) => (
                <CourseCard key={course.id} course={course} userSub={userSubscription} />
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 2: STANDARD BUFFET COURSES
        ========================================================================= */}
        {(selectedTier === "all" || selectedTier === "standard") && standardCourses.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-emerald text-slate-950 flex items-center justify-center shadow-sm">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    Standard Buffet Courses (Core & Open Source)
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-emerald/15 text-brand-emerald font-bold">
                      {standardCourses.length} คอร์ส
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">คอร์ส E-Book, ComfyUI, วิดีโอ, Desktop Agents และ Local AI รันฟรีได้ไม่จำกัด</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {standardCourses.map((course) => (
                <CourseCard key={course.id} course={course} userSub={userSubscription} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// =========================================================================
// UDEMY-STYLE COURSE CARD COMPONENT
// =========================================================================
function CourseCard({ course, userSub }: { course: CourseItem; userSub: any }) {
  const isPremiumCourse = course.required_tier === "premium";
  
  const hasAccess = userSub
    ? userSub.tier === "premium" || (userSub.tier === "standard" && !isPremiumCourse)
    : false;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:shadow-xl hover:border-brand-emerald/50 transition-all duration-300 flex flex-col group tactile-card">
      
      {/* 16:9 Thumbnail Cover */}
      <Link href={`/courses/${course.slug}`} className="relative aspect-video bg-slate-950 overflow-hidden block border-b border-slate-800/80">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between">
          <span
            className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider shadow ${
              isPremiumCourse
                ? "bg-gradient-to-r from-brand-orange to-amber-500 text-white"
                : "bg-brand-emerald text-slate-950"
            }`}
          >
            {isPremiumCourse ? "PREMIUM" : "STANDARD"}
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
            <h3 className="text-sm font-bold text-white leading-snug group-hover:text-brand-emerald transition-colors line-clamp-2 mt-1">
              {course.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{course.instructor}</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-xs font-extrabold text-amber-400">{course.rating}</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="text-[11px] text-slate-400">({course.review_count} ผู้เรียน)</span>
          </div>
        </div>

        {/* Card Footer Action (Smart Access) */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
            บุฟเฟต์
          </span>

          <Link
            href={`/courses/${course.slug}`}
            className={`text-xs font-bold flex items-center gap-1 group/btn ${
              hasAccess ? "text-brand-emerald hover:text-emerald-300" : "text-slate-200 hover:text-brand-orange"
            }`}
          >
            <span>{hasAccess ? "เข้าเรียน ✓" : course.free_preview_count > 0 ? "ดูฟรี 1 ตอน" : "เข้าเรียน"}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

    </div>
  );
}

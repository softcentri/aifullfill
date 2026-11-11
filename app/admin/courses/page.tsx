"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Code2,
  Crown,
  Loader2,
  Play,
  FileText,
  Download,
  Copy,
  Check,
  Video,
  ListOrdered,
  Layers,
  Sparkles,
  HelpCircle,
  Film,
  FolderDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { parseVideoUrl } from "@/utils/video-helper";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  instructor: string;
  content_type: string;
  category: string;
  required_tier: "standard" | "premium";
  github_repo_url: string;
  demo_url: string;
  is_published: boolean;
  order_number: number;
  created_at: string;
  course_episodes?: { count: number }[];
  course_attachments?: { count: number }[];
}

interface PromptItem {
  id: string;
  title: string;
  prompt: string;
  description?: string;
}

interface Episode {
  id?: string;
  course_id: string;
  title: string;
  video_url: string;
  video_type?: string;
  duration_minutes: number;
  is_free_preview: boolean;
  order_number: number;
  content_html?: string;
  prompts?: PromptItem[];
}

interface Attachment {
  id?: string;
  course_id: string;
  episode_id?: string | null;
  title: string;
  file_url: string;
  file_type: string;
  file_size?: string;
  order_number: number;
}

const CATEGORY_PRESETS = [
  "AI & Vibe Coding",
  "Desktop Agents & Workflow",
  "Smart Automation & Local AI",
  "AI Creator & Content",
  "Monetization & Agency",
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // 1. Course Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseFormData, setCourseFormData] = useState({
    title: "",
    slug: "",
    description: "",
    thumbnail_url: "",
    instructor: "อาจารย์อั๋น (AIEbookAcademy)",
    content_type: "course",
    category: "AI & Vibe Coding",
    required_tier: "standard" as "standard" | "premium",
    github_repo_url: "",
    demo_url: "",
    is_published: true,
    order_number: 0,
  });
  const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);

  // 2. Studio Modal (Episodes & Attachments Management)
  const [studioCourse, setStudioCourse] = useState<Course | null>(null);
  const [studioTab, setStudioTab] = useState<"episodes" | "attachments">("episodes");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loadingStudioData, setLoadingStudioData] = useState(false);

  // 3. Episode Form Modal
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [episodeFormData, setEpisodeFormData] = useState<Episode>({
    course_id: "",
    title: "",
    video_url: "",
    duration_minutes: 15,
    is_free_preview: false,
    order_number: 1,
    content_html: "",
    prompts: [],
  });
  const [isSubmittingEpisode, setIsSubmittingEpisode] = useState(false);
  const [activeEpisodeFormTab, setActiveEpisodeFormTab] = useState<"basic" | "content" | "prompts">("basic");

  // 4. Attachment Form Modal
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<Attachment | null>(null);
  const [attachmentFormData, setAttachmentFormData] = useState<Attachment>({
    course_id: "",
    episode_id: "",
    title: "",
    file_url: "",
    file_type: "zip",
    file_size: "",
    order_number: 1,
  });
  const [isSubmittingAttachment, setIsSubmittingAttachment] = useState(false);

  // Copy Feedback
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "ไม่สามารถดึงข้อมูลคอร์สเรียนได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch episodes and attachments for Studio
  const openStudio = async (course: Course) => {
    setStudioCourse(course);
    setStudioTab("episodes");
    setLoadingStudioData(true);
    try {
      const res = await fetch(`/api/admin/courses?id=${course.id}`);
      if (res.ok) {
        const data = await res.json();
        setEpisodes(data.episodes || []);
        setAttachments(data.attachments || []);
      }
    } catch (err) {
      showAlert("error", "ไม่สามารถโหลดข้อมูลบทเรียนและไฟล์แนบได้");
    } finally {
      setLoadingStudioData(false);
    }
  };

  // Helper to generate slug from title
  const handleAutoSlug = () => {
    const generated = courseFormData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
    setCourseFormData((prev) => ({ ...prev, slug: generated || `course-${Date.now()}` }));
  };

  // ---------------- Course CRUD ----------------
  const openCreateCourseModal = () => {
    setEditingCourse(null);
    setCourseFormData({
      title: "",
      slug: "",
      description: "",
      thumbnail_url: "",
      instructor: "อาจารย์อั๋น (AIEbookAcademy)",
      content_type: "course",
      category: "AI & Vibe Coding",
      required_tier: "standard",
      github_repo_url: "",
      demo_url: "",
      is_published: true,
      order_number: courses.length + 1,
    });
    setIsCourseModalOpen(true);
  };

  const openEditCourseModal = (course: Course) => {
    setEditingCourse(course);
    setCourseFormData({
      title: course.title,
      slug: course.slug,
      description: course.description || "",
      thumbnail_url: course.thumbnail_url || "",
      instructor: course.instructor || "อาจารย์อั๋น (AIEbookAcademy)",
      content_type: course.content_type || "course",
      category: course.category || "AI & Vibe Coding",
      required_tier: course.required_tier || "standard",
      github_repo_url: course.github_repo_url || "",
      demo_url: course.demo_url || "",
      is_published: course.is_published,
      order_number: course.order_number,
    });
    setIsCourseModalOpen(true);
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCourse(true);

    try {
      const payload = {
        ...courseFormData,
        id: editingCourse?.id,
      };

      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showAlert("success", data.message);
        setIsCourseModalOpen(false);
        fetchCourses();
      } else {
        showAlert("error", data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      showAlert("error", "ไม่สามารถบันทึกข้อมูลคอร์สได้");
    } finally {
      setIsSubmittingCourse(false);
    }
  };

  const handleDeleteCourse = async (course: Course) => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบคอร์ส "${course.title}"? \nบทเรียนและไฟล์แนบทั้งหมดในคอร์สนี้จะถูกลบออกด้วย`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/courses?id=${course.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        showAlert("success", data.message);
        fetchCourses();
      } else {
        showAlert("error", data.error || "ไม่สามารถลบคอร์สได้");
      }
    } catch (err) {
      showAlert("error", "เกิดข้อผิดพลาดในการลบคอร์ส");
    }
  };

  // ---------------- Episode CRUD ----------------
  const openCreateEpisodeModal = () => {
    if (!studioCourse) return;
    setEditingEpisode(null);
    setEpisodeFormData({
      course_id: studioCourse.id,
      title: `EP.${episodes.length + 1} `,
      video_url: "",
      duration_minutes: 20,
      is_free_preview: false,
      order_number: episodes.length + 1,
      content_html: "",
      prompts: [],
    });
    setActiveEpisodeFormTab("basic");
    setIsEpisodeModalOpen(true);
  };

  const openEditEpisodeModal = (ep: Episode) => {
    setEditingEpisode(ep);
    setEpisodeFormData({
      id: ep.id,
      course_id: ep.course_id,
      title: ep.title,
      video_url: ep.video_url || "",
      duration_minutes: ep.duration_minutes || 0,
      is_free_preview: ep.is_free_preview,
      order_number: ep.order_number,
      content_html: ep.content_html || "",
      prompts: ep.prompts || [],
    });
    setActiveEpisodeFormTab("basic");
    setIsEpisodeModalOpen(true);
  };

  const handleEpisodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingEpisode(true);

    try {
      const res = await fetch("/api/admin/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(episodeFormData),
      });

      const data = await res.json();
      if (res.ok) {
        showAlert("success", data.message);
        setIsEpisodeModalOpen(false);
        if (studioCourse) openStudio(studioCourse);
        fetchCourses();
      } else {
        showAlert("error", data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      showAlert("error", "ไม่สามารถบันทึกข้อมูลตอนเรียนได้");
    } finally {
      setIsSubmittingEpisode(false);
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบทเรียนนี้?")) return;

    try {
      const res = await fetch(`/api/admin/episodes?id=${episodeId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        showAlert("success", data.message);
        if (studioCourse) openStudio(studioCourse);
        fetchCourses();
      } else {
        showAlert("error", data.error || "ไม่สามารถลบตอนเรียนได้");
      }
    } catch (err) {
      showAlert("error", "เกิดข้อผิดพลาดในการลบตอนเรียน");
    }
  };

  // Helper to add prompt inside episode
  const handleAddPromptToEpisode = () => {
    const newPrompt: PromptItem = {
      id: `p-${Date.now()}`,
      title: "System Prompt ใหม่",
      prompt: "",
      description: "คำสั่งสำหรับให้ AI ช่วยทำงาน",
    };
    setEpisodeFormData((prev) => ({
      ...prev,
      prompts: [...(prev.prompts || []), newPrompt],
    }));
  };

  const handleRemovePrompt = (idx: number) => {
    setEpisodeFormData((prev) => ({
      ...prev,
      prompts: (prev.prompts || []).filter((_, i) => i !== idx),
    }));
  };

  const handlePromptChange = (idx: number, field: keyof PromptItem, val: string) => {
    setEpisodeFormData((prev) => {
      const list = [...(prev.prompts || [])];
      list[idx] = { ...list[idx], [field]: val };
      return { ...prev, prompts: list };
    });
  };

  // Quick insertion helpers for Rich Content
  const insertContentTemplate = (type: "h3" | "bullet" | "img" | "code") => {
    let snippet = "";
    if (type === "h3") snippet = "\n<h3>หัวข้อเนื้อหาสำคัญ</h3>\n<p>พิมพ์คำอธิบายรายละเอียดที่นี่...</p>\n";
    if (type === "bullet") snippet = "\n<ul>\n  <li>ประเด็นที่ 1: รายละเอียด...</li>\n  <li>ประเด็นที่ 2: รายละเอียด...</li>\n</ul>\n";
    if (type === "img") snippet = '\n<img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800" alt="ภาพประกอบ" class="rounded-xl my-4 w-full" />\n';
    if (type === "code") snippet = '\n<pre class="bg-slate-900 p-4 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto"><code>// โค้ดตัวอย่าง\nconsole.log("Hello aifullfill");</code></pre>\n';

    setEpisodeFormData((prev) => ({
      ...prev,
      content_html: (prev.content_html || "") + snippet,
    }));
  };

  // ---------------- Attachment CRUD ----------------
  const openCreateAttachmentModal = () => {
    if (!studioCourse) return;
    setEditingAttachment(null);
    setAttachmentFormData({
      course_id: studioCourse.id,
      episode_id: "",
      title: "",
      file_url: "",
      file_type: "zip",
      file_size: "10 MB",
      order_number: attachments.length + 1,
    });
    setIsAttachmentModalOpen(true);
  };

  const openEditAttachmentModal = (att: Attachment) => {
    setEditingAttachment(att);
    setAttachmentFormData({
      id: att.id,
      course_id: att.course_id,
      episode_id: att.episode_id || "",
      title: att.title,
      file_url: att.file_url,
      file_type: att.file_type || "zip",
      file_size: att.file_size || "",
      order_number: att.order_number,
    });
    setIsAttachmentModalOpen(true);
  };

  const handleAttachmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAttachment(true);

    try {
      const res = await fetch("/api/admin/attachments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attachmentFormData),
      });

      const data = await res.json();
      if (res.ok) {
        showAlert("success", data.message);
        setIsAttachmentModalOpen(false);
        if (studioCourse) openStudio(studioCourse);
        fetchCourses();
      } else {
        showAlert("error", data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      showAlert("error", "ไม่สามารถบันทึกไฟล์แนบได้");
    } finally {
      setIsSubmittingAttachment(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์แนบนี้?")) return;

    try {
      const res = await fetch(`/api/admin/attachments?id=${attachmentId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        showAlert("success", data.message);
        if (studioCourse) openStudio(studioCourse);
        fetchCourses();
      } else {
        showAlert("error", data.error || "ไม่สามารถลบไฟล์แนบได้");
      }
    } catch (err) {
      showAlert("error", "เกิดข้อผิดพลาดในการลบไฟล์แนบ");
    }
  };

  // ---------------- Filtering ----------------
  const filteredCourses = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      (c.category && c.category.toLowerCase().includes(search.toLowerCase()));

    const matchCategory = selectedCategory === "all" || c.category === selectedCategory;
    const matchTier = selectedTier === "all" || c.required_tier === selectedTier;

    return matchSearch && matchCategory && matchTier;
  });

  return (
    <div className="space-y-8 text-slate-100">
      
      {/* Alert Banner */}
      {alert && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm font-medium border animate-in fade-in ${
            alert.type === "success"
              ? "bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30"
              : "bg-rose-500/10 text-rose-400 border-rose-500/30"
          }`}
        >
          <div className="flex items-center gap-2">
            {alert.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{alert.message}</span>
          </div>
          <button onClick={() => setAlert(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header & Overview Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-emerald/10 text-brand-emerald text-xs font-semibold uppercase tracking-wider mb-2 border border-brand-emerald/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Course & Curriculum Studio</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">ระบบจัดการคอร์สเรียน & เนื้อหา</h1>
          <p className="text-slate-400 text-sm mt-1">
            เพิ่มคอร์ส, จัดหมวดหมู่, ระบุสิทธิ์แพ็กเกจ, จัดการตอนเรียนพร้อมวิดีโอ (YouTube / Bunny.net), Rich Text และคลัง Prompt ประจำบท
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCourses}
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreateCourseModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover tactile-button-primary transition-all duration-150 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มคอร์สเรียนใหม่</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 tactile-card">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อคอร์ส, slug หรือหมวดหมู่..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-emerald"
          >
            <option value="all">ทุกหมวดหมู่ (All Categories)</option>
            {CATEGORY_PRESETS.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-emerald"
          >
            <option value="all">ทุกระดับสิทธิ์ (Standard & Premium)</option>
            <option value="standard">Standard Tier (พื้นฐาน)</option>
            <option value="premium">Premium Tier (ปลดล็อกทุกอย่าง)</option>
          </select>
        </div>
      </div>

      {/* Courses Table / List */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden tactile-card">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-emerald mb-2" />
            <span className="text-xs">กำลังโหลดข้อมูลคอร์สเรียน...</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 stroke-[1.5] text-slate-600" />
            <p className="text-sm font-semibold text-slate-400">ไม่พบคอร์สเรียนที่ตรงกับเงื่อนไข</p>
            <p className="text-xs text-slate-600 mt-1">ลองเปลี่ยนคำค้นหา หรือกดปุ่ม "เพิ่มคอร์สเรียนใหม่"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">คอร์สเรียน & ข้อมูลหลัก</th>
                  <th className="py-3.5 px-4">หมวดหมู่ & แพ็กเกจ</th>
                  <th className="py-3.5 px-4 text-center">ตอนเรียน</th>
                  <th className="py-3.5 px-4 text-center">ไฟล์แนบ</th>
                  <th className="py-3.5 px-4 text-center">สถานะ</th>
                  <th className="py-3.5 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredCourses.map((course) => {
                  const episodeCount = course.course_episodes?.[0]?.count ?? 0;
                  const attachmentCount = course.course_attachments?.[0]?.count ?? 0;

                  return (
                    <tr key={course.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4 text-center text-slate-500 font-mono">
                        {course.order_number}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-9 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {course.thumbnail_url ? (
                              <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <BookOpen className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-white text-sm truncate max-w-md">{course.title}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">/{course.slug}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">ผู้สอน: {course.instructor}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                            {course.category || "AI & Vibe Coding"}
                          </span>
                          <div>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                course.required_tier === "premium"
                                  ? "bg-brand-orange/10 text-brand-orange border border-brand-orange/30"
                                  : "bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30"
                              }`}
                            >
                              <Crown className="w-3 h-3" />
                              {course.required_tier === "premium" ? "Premium (ทุกแพ็กเกจ)" : "Standard Tier"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => openStudio(course)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                        >
                          <Film className="w-3 h-3 text-brand-emerald" />
                          <span className="font-bold">{episodeCount}</span> ตอน
                        </button>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => {
                            openStudio(course);
                            setStudioTab("attachments");
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                        >
                          <FolderDown className="w-3 h-3 text-indigo-400" />
                          <span className="font-bold">{attachmentCount}</span> ไฟล์
                        </button>
                      </td>

                      <td className="py-4 px-4 text-center">
                        {course.is_published ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Eye className="w-3 h-3" /> เผยแพร่
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                            <EyeOff className="w-3 h-3" /> ซ่อนไว้
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openStudio(course)}
                            className="p-1.5 rounded-lg bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald/20 transition-colors"
                            title="จัดการบทเรียน, เนื้อหา, วิดีโอ และ Prompt"
                          >
                            <Layers className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/courses/${course.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                            title="เปิดดูหน้านักเรียน"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEditCourseModal(course)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                            title="แก้ไขข้อมูลคอร์ส"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                            title="ลบคอร์ส"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================================
          COURSE EDIT / CREATE MODAL
      ========================================================================= */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto tactile-card">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-orange" />
                <span>{editingCourse ? "แก้ไขข้อมูลคอร์สเรียน" : "เพิ่มคอร์สเรียนใหม่"}</span>
              </h2>
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCourseSubmit} className="p-6 space-y-4">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ชื่อคอร์สเรียน <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น Course 101: AI E-Book & Digital Asset Masterclass"
                  value={courseFormData.title}
                  onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
                />
              </div>

              {/* Slug + Auto Generate */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    URL Slug <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoSlug}
                    className="text-[11px] text-brand-emerald hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> สร้างจากชื่ออัตโนมัติ
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">/courses/</span>
                  <input
                    type="text"
                    required
                    placeholder="course-101-ai-ebook"
                    value={courseFormData.slug}
                    onChange={(e) => setCourseFormData({ ...courseFormData, slug: e.target.value })}
                    className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              {/* Category & Tier Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    หมวดหมู่คอร์ส (Category)
                  </label>
                  <input
                    type="text"
                    list="categories-list"
                    placeholder="เลือกหรือพิมพ์หมวดหมู่..."
                    value={courseFormData.category}
                    onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
                  />
                  <datalist id="categories-list">
                    {CATEGORY_PRESETS.map((cat, i) => (
                      <option key={i} value={cat} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ระดับแพ็กเกจที่เข้าร่วมได้ (Required Tier)
                  </label>
                  <select
                    value={courseFormData.required_tier}
                    onChange={(e) =>
                      setCourseFormData({ ...courseFormData, required_tier: e.target.value as "standard" | "premium" })
                    }
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-emerald"
                  >
                    <option value="standard">Standard Tier (ผู้ใช้ Standard & Premium ดูได้)</option>
                    <option value="premium">Premium Tier (เฉพาะผู้ใช้ Premium & ตลอดชีพเท่านั้น)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  คำอธิบายคอร์สเรียนสั้นๆ (Description)
                </label>
                <textarea
                  rows={3}
                  placeholder="รายละเอียดสังเขป สิ่งที่ผู้เรียนจะได้รับ..."
                  value={courseFormData.description}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
                />
              </div>

              {/* Instructor & Order Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ชื่อผู้สอน (Instructor)
                  </label>
                  <input
                    type="text"
                    value={courseFormData.instructor}
                    onChange={(e) => setCourseFormData({ ...courseFormData, instructor: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ลำดับการแสดงผล (Order Number)
                  </label>
                  <input
                    type="number"
                    value={courseFormData.order_number}
                    onChange={(e) => setCourseFormData({ ...courseFormData, order_number: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              {/* Thumbnail URL with Live Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  รูปภาพปก Thumbnail URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={courseFormData.thumbnail_url}
                  onChange={(e) => setCourseFormData({ ...courseFormData, thumbnail_url: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
                />
                {courseFormData.thumbnail_url && (
                  <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-slate-700 bg-black">
                    <img src={courseFormData.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* GitHub Repo & Live Demo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ลิงก์ GitHub Repository (ถ้ามี)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={courseFormData.github_repo_url}
                    onChange={(e) => setCourseFormData({ ...courseFormData, github_repo_url: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ลิงก์ Live Demo (ถ้ามี)
                  </label>
                  <input
                    type="url"
                    placeholder="https://demo-app.com"
                    value={courseFormData.demo_url}
                    onChange={(e) => setCourseFormData({ ...courseFormData, demo_url: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              {/* Published Switch */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-white block">สถานะการเผยแพร่</span>
                  <span className="text-[11px] text-slate-400">เมื่อเปิดใช้งาน ผู้เรียนจะสามารถค้นหาและเข้าเรียนได้</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseFormData.is_published}
                    onChange={(e) => setCourseFormData({ ...courseFormData, is_published: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-emerald"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCourse}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover tactile-button-primary disabled:opacity-50"
                >
                  {isSubmittingCourse && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingCourse ? "บันทึกการแก้ไข" : "สร้างคอร์สเรียน"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          EPISODES & ATTACHMENTS STUDIO MODAL
      ========================================================================= */}
      {studioCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden shadow-2xl tactile-card">
            
            {/* Studio Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 flex items-center justify-center font-bold">
                  <Film className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-emerald uppercase tracking-wider">Curriculum Studio</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400 font-mono">/{studioCourse.slug}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-white truncate max-w-xl">
                    {studioCourse.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/courses/${studioCourse.slug}`}
                  target="_blank"
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>ดูหน้าเรียนจริง</span>
                </Link>
                <button
                  onClick={() => setStudioCourse(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Studio Navigation Tabs */}
            <div className="px-6 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStudioTab("episodes")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    studioTab === "episodes"
                      ? "bg-brand-emerald text-slate-950 shadow-md"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>ตอนเรียน & วิดีโอ & Prompts ({episodes.length})</span>
                </button>

                <button
                  onClick={() => setStudioTab("attachments")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    studioTab === "attachments"
                      ? "bg-brand-emerald text-slate-950 shadow-md"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <FolderDown className="w-3.5 h-3.5" />
                  <span>ไฟล์แนบ & ดาวน์โหลด ({attachments.length})</span>
                </button>
              </div>

              {studioTab === "episodes" ? (
                <button
                  onClick={openCreateEpisodeModal}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover tactile-button-primary"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มตอนเรียนใหม่</span>
                </button>
              ) : (
                <button
                  onClick={openCreateAttachmentModal}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover tactile-button-primary"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มไฟล์แนบใหม่</span>
                </button>
              )}
            </div>

            {/* Studio Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-950/50">
              {loadingStudioData ? (
                <div className="py-24 text-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-emerald" />
                  <span className="text-xs">กำลังโหลดเนื้อหาบทเรียน...</span>
                </div>
              ) : studioTab === "episodes" ? (
                // Episodes Tab
                episodes.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                    <Film className="w-12 h-12 mx-auto mb-3 text-slate-600 stroke-[1.5]" />
                    <h3 className="text-sm font-bold text-white">ยังไม่มีบทเรียนในคอร์สนี้</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      เริ่มสร้างบทแรก รองรับทั้งวิดีโอจาก YouTube, Bunny.net, รายละเอียดข้อความ และชุด Prompt ให้ผู้เรียน Copy
                    </p>
                    <button
                      onClick={openCreateEpisodeModal}
                      className="mt-4 px-5 py-2 rounded-full text-xs font-bold text-white bg-brand-emerald hover:bg-emerald-600 inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>เพิ่มตอนแรกเลย</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {episodes.map((ep, idx) => {
                      const video = parseVideoUrl(ep.video_url);
                      const promptCount = ep.prompts?.length || 0;

                      return (
                        <div
                          key={ep.id || idx}
                          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 tactile-card hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700 flex-shrink-0">
                              {ep.order_number}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-white text-sm truncate max-w-md">{ep.title}</h4>
                                {ep.is_free_preview && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                                    FREE PREVIEW
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Video className="w-3.5 h-3.5 text-slate-500" />
                                  <span className="font-mono text-[11px] text-slate-300 uppercase">
                                    {video.provider}
                                  </span>
                                </span>
                                <span>•</span>
                                <span>{ep.duration_minutes} นาที</span>
                                {promptCount > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="text-brand-orange font-semibold flex items-center gap-1">
                                      <Copy className="w-3 h-3" /> {promptCount} Prompts พร้อม Copy
                                    </span>
                                  </>
                                )}
                                {ep.content_html && (
                                  <>
                                    <span>•</span>
                                    <span className="text-brand-emerald flex items-center gap-1">
                                      <FileText className="w-3 h-3" /> มีเนื้อหาบทความ
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              onClick={() => openEditEpisodeModal(ep)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>แก้ไข & ดูตัวอย่าง</span>
                            </button>
                            <button
                              onClick={() => ep.id && handleDeleteEpisode(ep.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                              title="ลบตอนเรียน"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                // Attachments Tab
                attachments.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                    <FolderDown className="w-12 h-12 mx-auto mb-3 text-slate-600 stroke-[1.5]" />
                    <h3 className="text-sm font-bold text-white">ยังไม่มีไฟล์แนบในคอร์สนี้</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      สามารถเพิ่มไฟล์ Starter Code, Template, สไลด์ PDF หรือไฟล์ Prompts เพื่อให้นักเรียนดาวน์โหลดได้
                    </p>
                    <button
                      onClick={openCreateAttachmentModal}
                      className="mt-4 px-5 py-2 rounded-full text-xs font-bold text-white bg-brand-emerald hover:bg-emerald-600 inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>เพิ่มไฟล์แนบแรก</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {attachments.map((att, idx) => (
                      <div
                        key={att.id || idx}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4 tactile-card"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                            {att.file_type || "zip"}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-white text-sm truncate max-w-md">{att.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                              {att.file_size && <span>{att.file_size}</span>}
                              <span>•</span>
                              <a
                                href={att.file_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-brand-emerald hover:underline truncate max-w-xs font-mono text-[11px]"
                              >
                                {att.file_url}
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditAttachmentModal(att)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => att.id && handleDeleteAttachment(att.id)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          EPISODE EDIT / CREATE MODAL (With Live Video & Prompts & Rich Text)
      ========================================================================= */}
      {isEpisodeModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl tactile-card">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-brand-orange" />
                <span>{editingEpisode ? `แก้ไขบทเรียน: ${editingEpisode.title}` : "เพิ่มบทเรียนใหม่"}</span>
              </h3>
              <button
                onClick={() => setIsEpisodeModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs inside Episode modal */}
            <div className="px-6 py-2 border-b border-slate-800 bg-slate-900/90 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveEpisodeFormTab("basic")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  activeEpisodeFormTab === "basic" ? "bg-brand-emerald text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                1. ข้อมูลวิดีโอ & ลำดับ
              </button>
              <button
                type="button"
                onClick={() => setActiveEpisodeFormTab("content")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  activeEpisodeFormTab === "content" ? "bg-brand-emerald text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                2. เนื้อหาบทเรียน (Rich Text / Bullets)
              </button>
              <button
                type="button"
                onClick={() => setActiveEpisodeFormTab("prompts")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  activeEpisodeFormTab === "prompts" ? "bg-brand-emerald text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                3. คลัง Prompts ประจำบท ({episodeFormData.prompts?.length || 0})
              </button>
            </div>

            <form onSubmit={handleEpisodeSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* TAB 1: BASIC INFO & VIDEO */}
              {activeEpisodeFormTab === "basic" && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ชื่อตอนเรียน <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น EP.1 ติดตั้ง Antigravity และเชื่อมต่อ Claude Code"
                      value={episodeFormData.title}
                      onChange={(e) => setEpisodeFormData({ ...episodeFormData, title: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        ลำดับตอน (Order)
                      </label>
                      <input
                        type="number"
                        value={episodeFormData.order_number}
                        onChange={(e) =>
                          setEpisodeFormData({ ...episodeFormData, order_number: parseInt(e.target.value, 10) || 1 })
                        }
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-emerald"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        ระยะเวลา (นาที)
                      </label>
                      <input
                        type="number"
                        value={episodeFormData.duration_minutes}
                        onChange={(e) =>
                          setEpisodeFormData({ ...episodeFormData, duration_minutes: parseInt(e.target.value, 10) || 0 })
                        }
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-emerald"
                      />
                    </div>
                  </div>

                  {/* Video URL */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ลิงก์วิดีโอ (รองรับ YouTube และ Bunny.net Stream)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น https://www.youtube.com/watch?v=... หรือ https://iframe.mediadelivery.net/embed/..."
                      value={episodeFormData.video_url}
                      onChange={(e) => setEpisodeFormData({ ...episodeFormData, video_url: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
                    />
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                      <span>ประเภทที่ตรวจพบ:</span>
                      <span className="font-mono text-brand-emerald uppercase font-semibold">
                        {parseVideoUrl(episodeFormData.video_url).provider}
                      </span>
                    </div>
                  </div>

                  {/* Video Live Preview */}
                  {episodeFormData.video_url && (
                    <div className="pt-2">
                      <span className="text-xs font-semibold text-slate-300 mb-1 block">ตัวอย่างการแสดงผลวิดีโอจริง</span>
                      <div className="max-w-md">
                        <VideoPlayer url={episodeFormData.video_url} />
                      </div>
                    </div>
                  )}

                  {/* Free Preview Switch */}
                  <div className="pt-3 flex items-center justify-between border-t border-slate-800">
                    <div>
                      <span className="text-xs font-semibold text-white block">เปิดให้ทดลองดูฟรี (Free Preview)</span>
                      <span className="text-[11px] text-slate-400">ผู้เรียนที่ยังไม่สมัครสมาชิกสามารถดูตอนนี้ได้โดยไม่ต้องล็อกอิน</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={episodeFormData.is_free_preview}
                        onChange={(e) => setEpisodeFormData({ ...episodeFormData, is_free_preview: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-emerald"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: RICH LESSON DETAILS */}
              {activeEpisodeFormTab === "content" && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-300">
                        รายละเอียดบทเรียน (HTML / Markdown / Bullet Points)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => insertContentTemplate("h3")}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 border border-slate-700"
                        >
                          + หัวข้อ
                        </button>
                        <button
                          type="button"
                          onClick={() => insertContentTemplate("bullet")}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 border border-slate-700"
                        >
                          + Bullet
                        </button>
                        <button
                          type="button"
                          onClick={() => insertContentTemplate("img")}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 border border-slate-700"
                        >
                          + รูปภาพ
                        </button>
                        <button
                          type="button"
                          onClick={() => insertContentTemplate("code")}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 border border-slate-700"
                        >
                          + โค้ด
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={10}
                      placeholder="เขียนรายละเอียดเนื้อหา, ข้อควรระวัง, รายการที่ต้องทำ..."
                      value={episodeFormData.content_html}
                      onChange={(e) => setEpisodeFormData({ ...episodeFormData, content_html: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-emerald"
                    />
                  </div>

                  {/* Render Preview of content */}
                  {episodeFormData.content_html && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 prose prose-invert max-w-none">
                      <span className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-wider">
                        ตัวอย่างการแสดงผลเนื้อหาจริง
                      </span>
                      <div dangerouslySetInnerHTML={{ __html: episodeFormData.content_html }} />
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PROMPTS MANAGEMENT */}
              {activeEpisodeFormTab === "prompts" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">คลัง Prompts ประจำบทเรียนนี้</h4>
                      <p className="text-[11px] text-slate-400">
                        เพิ่มคำสั่ง Prompt ที่ผู้เรียนสามารถคลิกปุ่ม Copy เพื่อนำไปใช้งานได้ทันที 1-Click
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPromptToEpisode}
                      className="px-3 py-1.5 rounded-full text-xs font-bold text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/30 hover:bg-brand-emerald/20 flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>เพิ่ม Prompt</span>
                    </button>
                  </div>

                  {(!episodeFormData.prompts || episodeFormData.prompts.length === 0) ? (
                    <div className="py-12 text-center border border-dashed border-slate-800 rounded-xl">
                      <Copy className="w-8 h-8 mx-auto mb-2 text-slate-600 stroke-[1.5]" />
                      <p className="text-xs text-slate-400 font-medium">ยังไม่มี Prompt ในบทเรียนนี้</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">กดปุ่ม "+ เพิ่ม Prompt" เพื่อสร้างชุดคำสั่งให้ผู้เรียน</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {episodeFormData.prompts.map((p, pIdx) => (
                        <div key={p.id || pIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              placeholder="ชื่อ Prompt (เช่น System Prompt สั่งสร้างเว็บ)"
                              value={p.title}
                              onChange={(e) => handlePromptChange(pIdx, "title", e.target.value)}
                              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-white w-2/3 focus:outline-none focus:border-brand-emerald"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePrompt(pIdx)}
                              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> ลบ
                            </button>
                          </div>

                          <textarea
                            rows={4}
                            placeholder="พิมพ์ข้อความ Prompt เต็มที่นี่..."
                            value={p.prompt}
                            onChange={(e) => handlePromptChange(pIdx, "prompt", e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-brand-emerald"
                          />

                          <div className="flex items-center justify-between pt-1">
                            <input
                              type="text"
                              placeholder="คำอธิบายการใช้งาน (เช่น นำไปวางใน Antigravity หรือ Claude)"
                              value={p.description || ""}
                              onChange={(e) => handlePromptChange(pIdx, "description", e.target.value)}
                              className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-400 flex-1 mr-3 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(p.prompt);
                                setCopiedPromptId(p.id);
                                setTimeout(() => setCopiedPromptId(null), 2000);
                              }}
                              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 flex items-center gap-1"
                            >
                              {copiedPromptId === p.id ? (
                                <>
                                  <Check className="w-3 h-3 text-brand-emerald" />
                                  <span className="text-brand-emerald font-bold">คัดลอกแล้ว</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>ทดสอบ Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800 sticky bottom-0 bg-slate-900">
                <button
                  type="button"
                  onClick={() => setIsEpisodeModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEpisode}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover tactile-button-primary disabled:opacity-50"
                >
                  {isSubmittingEpisode && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingEpisode ? "บันทึกการแก้ไขตอน" : "เพิ่มตอนเรียน"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          ATTACHMENT EDIT / CREATE MODAL
      ========================================================================= */}
      {isAttachmentModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl tactile-card">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderDown className="w-4 h-4 text-indigo-400" />
                <span>{editingAttachment ? "แก้ไขไฟล์แนบ" : "เพิ่มไฟล์แนบใหม่"}</span>
              </h3>
              <button
                onClick={() => setIsAttachmentModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAttachmentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ชื่อไฟล์ประกอบการสอน <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น Starter Code Template (Next.js + Supabase).zip"
                  value={attachmentFormData.title}
                  onChange={(e) => setAttachmentFormData({ ...attachmentFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ลิงก์ดาวน์โหลด (URL) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/... หรือ https://.../file.zip"
                  value={attachmentFormData.file_url}
                  onChange={(e) => setAttachmentFormData({ ...attachmentFormData, file_url: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ชนิดไฟล์</label>
                  <select
                    value={attachmentFormData.file_type}
                    onChange={(e) => setAttachmentFormData({ ...attachmentFormData, file_type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="zip">ZIP Archive</option>
                    <option value="pdf">PDF Document</option>
                    <option value="code">Source Code</option>
                    <option value="link">External Link</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ขนาดไฟล์ (ระบุ)</label>
                  <input
                    type="text"
                    placeholder="เช่น 12.5 MB"
                    value={attachmentFormData.file_size || ""}
                    onChange={(e) => setAttachmentFormData({ ...attachmentFormData, file_size: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ผูกกับตอนเรียนเฉพาะ (ทางเลือก)
                </label>
                <select
                  value={attachmentFormData.episode_id || ""}
                  onChange={(e) => setAttachmentFormData({ ...attachmentFormData, episode_id: e.target.value || null })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="">สำหรับทั้งคอร์สเรียน (All Course)</option>
                  {episodes.map((ep) => (
                    <option key={ep.id} value={ep.id}>
                      {ep.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAttachmentModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAttachment}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover tactile-button-primary disabled:opacity-50"
                >
                  {isSubmittingAttachment && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingAttachment ? "บันทึกไฟล์แนบ" : "เพิ่มไฟล์แนบ"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

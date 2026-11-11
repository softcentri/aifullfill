"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { 
  Play, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Download, 
  FolderDown, 
  Menu, 
  X, 
  BookOpen, 
  Sparkles, 
  Lock, 
  Clock, 
  MessageSquare, 
  HelpCircle,
  ExternalLink,
  Layers,
  ArrowLeft,
  Loader2,
  Copy,
  Check
} from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";

interface PromptItem {
  id: string;
  title: string;
  prompt: string;
  description?: string;
}

interface Episode {
  id: string;
  order: number;
  title: string;
  duration: string;
  videoUrl: string;
  isFreePreview: boolean;
  section: string;
  contentHtml?: string;
  prompts?: PromptItem[];
}

interface Attachment {
  id: string;
  title: string;
  fileSize: string;
  fileType: string;
  downloadUrl: string;
}

interface Section {
  name: string;
  episodes: Episode[];
}

// ข้อมูลจำลองสำรองกรณีคอร์สยังไม่ถูก Seed ใน DB
const FALLBACK_COURSE_SECTIONS: Section[] = [
  {
    name: "ทฤษฎีและการเตรียมเครื่องมือ",
    episodes: [
      {
        id: "ep-1",
        order: 1,
        title: "EP.1 AI Game Developer ทฤษฎีและแนวคิด Vibe Coding",
        duration: "30 นาที",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        isFreePreview: true,
        section: "ทฤษฎีและการเตรียมเครื่องมือ",
        contentHtml: "<h3>ภาพรวมบทเรียน</h3><p>ในบทนี้เราจะมาเจาะลึกแนวคิด Vibe Coding และเตรียมเครื่องมือสำหรับสร้างเกมด้วย AI</p><ul><li>หลักการให้ AI เป็น Copilot ในการเขียน Game Logic</li><li>การกำหนด Architecture ให้ไม่เกิดหนี้ทางเทคนิค (Technical Debt)</li><li>การเตรียม Assets และ Sprite ฟรี</li></ul>",
        prompts: [
          {
            id: "p-fallback-1",
            title: "Prompt ออกแบบ Game Design Document (GDD)",
            prompt: "คุณคือนักออกแบบเกมอาวุโส ช่วยร่าง Game Design Document สำหรับเกม 2D Platformer โดยเน้น Core Mechanics, Progression System, และ Sound Design...",
            description: "ใช้ป้อนให้ Claude หรือ ChatGPT เพื่อวางกรอบก่อนเริ่มเขียนโค้ด"
          }
        ]
      },
      {
        id: "ep-2",
        order: 2,
        title: "Ep.2 การติดตั้ง Environment, Claude Code และ Game Engine",
        duration: "7 นาที",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        isFreePreview: false,
        section: "ทฤษฎีและการเตรียมเครื่องมือ",
        contentHtml: "<p>ขั้นตอนการติดตั้ง Node.js, Vite, TypeScript และเชื่อมต่อ Antigravity / Claude Code เข้ากับ Workspace</p>",
        prompts: []
      },
    ],
  },
  {
    name: "Workshop สร้างเกมจริง",
    episodes: [
      {
        id: "ep-3",
        order: 3,
        title: "Ep.3 Workshop 1 ออกแบบเกมแพลตฟอร์ม 2D ด้วย AI",
        duration: "1 ชม. 0 น.",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        isFreePreview: false,
        section: "Workshop สร้างเกมจริง",
      },
    ],
  },
];

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hasCourseAccess, setHasCourseAccess] = useState(false);

  const [courseTitle, setCourseTitle] = useState("AI Game Developer: Vibe Coding");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseId, setCourseId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [sections, setSections] = useState<Section[]>(FALLBACK_COURSE_SECTIONS);
  const allEpisodes = sections.flatMap((s) => s.episodes);

  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const currentEpisode = allEpisodes[currentEpisodeIndex] || allEpisodes[0];

  const [completedEpisodeIds, setCompletedEpisodeIds] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "prompts" | "resources" | "qa">("overview");
  const [showAttachmentsDrawer, setShowAttachmentsDrawer] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // ดึงข้อมูลคอร์สจริงจาก Supabase
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        // 1. ดึงข้อมูลคอร์สจาก Supabase ด้วย Slug
        const { data: courseData } = await supabase
          .from("courses")
          .select(`
            id,
            title,
            slug,
            description,
            required_tier,
            course_episodes (
              id,
              title,
              video_url,
              duration_minutes,
              is_free_preview,
              order_number,
              content_html,
              prompts
            ),
            course_attachments (
              id,
              title,
              file_url,
              file_type,
              file_size
            )
          `)
          .eq("slug", slug)
          .maybeSingle();

        if (courseData) {
          setCourseId(courseData.id);
          setCourseTitle(courseData.title);
          setCourseDescription(courseData.description || "");

          // แปลงไฟล์แนบ
          if (courseData.course_attachments && courseData.course_attachments.length > 0) {
            setAttachments(
              courseData.course_attachments.map((att: any) => ({
                id: att.id,
                title: att.title,
                fileSize: att.file_size || "10 MB",
                fileType: att.file_type?.toUpperCase() || "ZIP",
                downloadUrl: att.file_url,
              }))
            );
          }

          // จัดตอนเรียน
          const rawEpisodes = (courseData.course_episodes || []).sort(
            (a: any, b: any) => a.order_number - b.order_number
          );

          if (rawEpisodes.length > 0) {
            const mappedEpisodes: Episode[] = rawEpisodes.map((ep: any) => ({
              id: ep.id,
              order: ep.order_number,
              title: ep.title,
              duration: `${ep.duration_minutes || 10} นาที`,
              videoUrl: ep.video_url || "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              isFreePreview: ep.is_free_preview || false,
              section: "เนื้อหาหลักสูตร",
              contentHtml: ep.content_html || "",
              prompts: Array.isArray(ep.prompts) ? ep.prompts : [],
            }));

            setSections([
              { name: "เนื้อหาหลักสูตร", episodes: mappedEpisodes },
            ]);
          }

          // 2. ตรวจสอบสิทธิ์การเข้าถึงคอร์สจริงผ่านฟังก์ชัน has_course_access
          if (user) {
            const { data: hasAccess } = await supabase.rpc("has_course_access", {
              p_course_id: courseData.id,
              p_user_id: user.id,
            });
            setHasCourseAccess(!!hasAccess);

            // 3. ดึงความก้าวหน้าการเรียนที่เคยบันทึกไว้
            const { data: progress } = await supabase
              .from("user_episode_progress")
              .select("episode_id, completed")
              .eq("user_id", user.id)
              .eq("course_id", courseData.id)
              .eq("completed", true);

            if (progress) {
              setCompletedEpisodeIds(progress.map((p: any) => p.episode_id));
            }
          }
        }
      } catch (err) {
        console.error("Error loading course from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchCourseData();
    }
  }, [slug]);

  // สลับสถานะเรียนจบ
  const toggleComplete = async (episodeId: string) => {
    if (!currentUser || !courseId) return;

    const isAlreadyCompleted = completedEpisodeIds.includes(episodeId);
    const newCompleted = isAlreadyCompleted
      ? completedEpisodeIds.filter((id) => id !== episodeId)
      : [...completedEpisodeIds, episodeId];

    setCompletedEpisodeIds(newCompleted);

    try {
      if (isAlreadyCompleted) {
        await supabase
          .from("user_episode_progress")
          .delete()
          .eq("user_id", currentUser.id)
          .eq("episode_id", episodeId);
      } else {
        await supabase.from("user_episode_progress").upsert({
          user_id: currentUser.id,
          course_id: courseId,
          episode_id: episodeId,
          completed: true,
          completed_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const handleNext = () => {
    if (currentEpisodeIndex < allEpisodes.length - 1) {
      setCurrentEpisodeIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentEpisodeIndex > 0) {
      setCurrentEpisodeIndex((prev) => prev - 1);
    }
  };

  const handleCopyPrompt = (promptText: string, id: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const canWatchCurrent = currentEpisode?.isFreePreview || hasCourseAccess;
  const isCurrentCompleted = currentEpisode ? completedEpisodeIds.includes(currentEpisode.id) : false;
  const progressPercent = allEpisodes.length > 0 
    ? Math.round((completedEpisodeIds.length / allEpisodes.length) * 100) 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-emerald" />
        <p className="text-sm font-medium text-slate-400">กำลังเชื่อมต่อห้องเรียนและตรวจสอบสิทธิ์...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      
      {/* =========================================================================
          1. CLASSROOM TOP NAVIGATION
      ========================================================================= */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">คอร์สทั้งหมด</span>
          </Link>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md lg:max-w-xl">
            {courseTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress Bar in Header */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-slate-400">เรียนจบแล้ว</span>
            <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-emerald transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-brand-emerald">{progressPercent}%</span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-emerald" />
            <span className="hidden sm:inline">{sidebarOpen ? "ซ่อนสารบัญ" : "ดูสารบัญ"}</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          2. MAIN CLASSROOM WORKSPACE (Player + Accordion Sidebar)
      ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        
        {/* CENTER / MAIN VIDEO & CONTENT AREA */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-y-auto">
          
          {/* Video Player Box (Theatre View) */}
          <div className="w-full bg-black relative aspect-video max-h-[72vh] flex items-center justify-center border-b border-slate-800 shadow-2xl">
            {canWatchCurrent ? (
              <VideoPlayer 
                url={currentEpisode?.videoUrl} 
                title={currentEpisode?.title} 
                className="w-full h-full rounded-none"
              />
            ) : (
              // Locked Backdrop สำหรับผู้เรียนที่ไม่มีสิทธิ์
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange shadow-lg">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-md">
                  <h3 className="text-lg font-bold text-white">ตอนนี้สำหรับสมาชิกบุฟเฟต์เท่านั้น</h3>
                  <p className="text-xs text-slate-400">
                    ปลดล็อกการเข้าถึงทุกคอร์ส คลังซอร์สโค้ด และสิทธิ์ MCP Server ด้วยแพ็กเกจบุฟเฟต์ aifullfill
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    href="/pricing"
                    className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover tactile-button-primary shadow-lg transition-transform hover:scale-105"
                  >
                    สมัครบุฟเฟต์เพื่อดูตอนนี้ (เริ่มต้น 599.-)
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Player Bottom Control Action Bar */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentEpisodeIndex === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> ก่อนหน้า
              </button>

              <button
                onClick={() => currentEpisode && toggleComplete(currentEpisode.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  isCurrentCompleted
                    ? "bg-brand-emerald text-slate-950 font-bold"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCurrentCompleted ? "เรียนจบแล้ว ✓" : "ทำเครื่องหมายว่าเรียนจบ"}</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentEpisodeIndex === allEpisodes.length - 1}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-emerald hover:bg-emerald-600 disabled:opacity-40 text-slate-950 transition-colors font-bold"
              >
                ถัดไป <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {attachments.length > 0 && (
              <button
                onClick={() => setShowAttachmentsDrawer(!showAttachmentsDrawer)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-colors"
              >
                <FolderDown className="w-4 h-4 text-brand-orange" />
                <span>📁 ไฟล์ที่เกี่ยวข้อง ({attachments.length} ไฟล์)</span>
              </button>
            )}
          </div>

          {/* Attachments Drawer */}
          {showAttachmentsDrawer && (
            <div className="bg-amber-950/30 border-b border-amber-500/20 px-4 sm:px-8 py-4 space-y-2.5 animate-in slide-in-from-top duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> ดาวน์โหลดไฟล์และซอร์สโค้ดประกอบบทเรียน:
                </span>
                <button
                  onClick={() => setShowAttachmentsDrawer(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ปิด ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between gap-3 hover:border-brand-emerald transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center flex-shrink-0 font-bold text-xs uppercase">
                        {file.fileType}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-200 truncate">{file.title}</div>
                        <div className="text-[10px] text-slate-400">{file.fileSize} • {file.fileType}</div>
                      </div>
                    </div>
                    <a
                      href={file.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-emerald text-slate-950 hover:bg-emerald-600 transition-colors flex items-center gap-1 flex-shrink-0"
                    >
                      <Download className="w-3 h-3" /> โหลด
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lesson Tabs: Overview, Prompts, Resources, Q&A */}
          <div className="p-4 sm:p-8 space-y-6">
            
            {/* Tab Headers */}
            <div className="flex items-center gap-6 border-b border-slate-800 text-sm font-semibold flex-wrap">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
                  activeTab === "overview"
                    ? "text-brand-emerald border-b-2 border-brand-emerald"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>ภาพรวม & รายละเอียดบทเรียน</span>
              </button>

              <button
                onClick={() => setActiveTab("prompts")}
                className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
                  activeTab === "prompts"
                    ? "text-brand-emerald border-b-2 border-brand-emerald"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Copy className="w-4 h-4 text-brand-orange" />
                <span>คลัง Prompt ประจำบท</span>
                {(currentEpisode?.prompts?.length ?? 0) > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-brand-orange/20 text-brand-orange font-bold">
                    {currentEpisode?.prompts?.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("resources")}
                className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
                  activeTab === "resources"
                    ? "text-brand-emerald border-b-2 border-brand-emerald"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <FolderDown className="w-4 h-4" />
                <span>ไฟล์และโค้ดดาวน์โหลด ({attachments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("qa")}
                className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
                  activeTab === "qa"
                    ? "text-brand-emerald border-b-2 border-brand-emerald"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>ถาม-ตอบ (Q&A)</span>
              </button>
            </div>

            {/* TAB 1: OVERVIEW & RICH CONTENT */}
            {activeTab === "overview" && (
              <div className="space-y-4 max-w-3xl animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/20 px-2 py-0.5 rounded-full font-semibold">
                    EP.{currentEpisode?.order}
                  </span>
                  <span className="text-xs text-slate-400">• {currentEpisode?.duration}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">{currentEpisode?.title}</h3>

                {currentEpisode?.contentHtml ? (
                  <div 
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300 leading-relaxed space-y-3 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentEpisode.contentHtml }} 
                  />
                ) : (
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-300 leading-relaxed font-light">
                    {courseDescription || "เรียนรู้เนื้อหาสำคัญในบทเรียนนี้ พร้อมทดลองทำตามได้ทันที"}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PROMPTS WITH 1-CLICK COPY */}
            {activeTab === "prompts" && (
              <div className="space-y-4 max-w-3xl animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-orange" />
                      <span>ชุด Prompt สำหรับบทเรียนนี้</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">คลิกปุ่ม Copy เพื่อนำคำสั่งไปใช้งานกับ AI ทันที</p>
                  </div>
                </div>

                {currentEpisode?.prompts && currentEpisode.prompts.length > 0 ? (
                  <div className="space-y-4">
                    {currentEpisode.prompts.map((p, idx) => {
                      const isCopied = copiedPromptId === (p.id || `p-${idx}`);
                      return (
                        <div key={p.id || idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 tactile-card">
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="font-bold text-sm text-white">{p.title}</h4>
                            <button
                              onClick={() => handleCopyPrompt(p.prompt, p.id || `p-${idx}`)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                isCopied
                                  ? "bg-brand-emerald text-slate-950 shadow-md font-bold"
                                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>คัดลอกแล้ว! ✓</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-brand-orange" />
                                  <span>Copy Prompt</span>
                                </>
                              )}
                            </button>
                          </div>

                          {p.description && (
                            <p className="text-xs text-slate-400 font-normal leading-relaxed">{p.description}</p>
                          )}

                          <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-emerald-300 whitespace-pre-wrap break-words border border-slate-800/80 leading-relaxed selection:bg-brand-orange/30">
                            {p.prompt}
                          </pre>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-10 text-center text-slate-500 bg-slate-900 rounded-2xl border border-slate-800">
                    <Copy className="w-8 h-8 mx-auto mb-2 text-slate-600 stroke-[1.5]" />
                    <p className="text-sm font-semibold text-slate-400">บทเรียนนี้ไม่มี Prompt เสริม</p>
                    <p className="text-xs text-slate-500 mt-1">สามารถดูเนื้อหาคำสั่งจากวิดีโอและเอกสารแนบได้ครับ</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: RESOURCES */}
            {activeTab === "resources" && (
              <div className="space-y-4 max-w-3xl animate-in fade-in">
                <h3 className="text-base font-bold text-white">ไฟล์และซอร์สโค้ดสำหรับคอร์สนี้</h3>
                {attachments.length === 0 ? (
                  <div className="p-10 text-center text-slate-500 bg-slate-900 rounded-2xl border border-slate-800">
                    <FolderDown className="w-8 h-8 mx-auto mb-2 text-slate-600 stroke-[1.5]" />
                    <p className="text-sm font-semibold text-slate-400">ไม่มีไฟล์แนบในคอร์สนี้</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attachments.map((file) => (
                      <div
                        key={file.id}
                        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 tactile-card"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center font-bold text-xs uppercase">
                            {file.fileType}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{file.title}</div>
                            <div className="text-xs text-slate-400">{file.fileSize} • {file.fileType}</div>
                          </div>
                        </div>
                        <a
                          href={file.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-emerald text-slate-950 hover:bg-emerald-600 transition-colors flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" /> ดาวน์โหลด
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Q&A */}
            {activeTab === "qa" && (
              <div className="space-y-4 max-w-3xl animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">คำถามที่พบบ่อยและข้อสงสัย</h3>
                  <button className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-orange text-white hover:bg-brand-orange-hover tactile-button-primary transition-colors">
                    + ตั้งคำถามใหม่
                  </button>
                </div>
                <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
                  หากคุณติดปัญหาในบทเรียน สามารถกดปุ่มตั้งคำถามเพื่อคุยกับทีมผู้สอนได้ตลอดเวลาครับ
                </div>
              </div>
            )}

          </div>
        </div>

        {/* =========================================================================
            3. RIGHT SIDEBAR: สารบัญบทเรียนแบบ ACCORDION
        ========================================================================= */}
        {sidebarOpen && (
          <aside className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-auto lg:h-[calc(100vh-3.5rem)] lg:sticky lg:top-14 overflow-y-auto">
            
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 sticky top-0 z-10">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-emerald" />
                สารบัญเนื้อหาคอร์ส
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {completedEpisodeIds.length}/{allEpisodes.length} ตอนจบแล้ว
              </span>
            </div>

            {/* Episodes List */}
            <div className="divide-y divide-slate-800/80 flex-1">
              {allEpisodes.map((ep, idx) => {
                const isActive = idx === currentEpisodeIndex;
                const isCompleted = completedEpisodeIds.includes(ep.id);
                const canWatch = ep.isFreePreview || hasCourseAccess;

                return (
                  <button
                    key={ep.id}
                    onClick={() => setCurrentEpisodeIndex(idx)}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                      isActive
                        ? "bg-slate-800/90 text-white ring-1 ring-brand-emerald/30 shadow-sm"
                        : "hover:bg-slate-800/40 text-slate-300"
                    }`}
                  >
                    {/* Checkbox / Completion Icon */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComplete(ep.id);
                      }}
                      className="mt-0.5 cursor-pointer"
                      title={isCompleted ? "ทำเครื่องหมายว่ายังไม่จบ" : "ทำเครื่องหมายว่าจบแล้ว"}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-brand-emerald flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0 hover:border-brand-emerald" />
                      )}
                    </div>

                    {/* Episode Text & Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-mono text-slate-500 font-semibold">{ep.order}.</span>
                        <span className={`text-xs font-semibold leading-snug line-clamp-2 ${isActive ? "text-white" : "text-slate-300"}`}>
                          {ep.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ep.duration}</span>
                        {ep.isFreePreview && (
                          <span className="text-brand-emerald font-bold px-1.5 py-0.2 rounded bg-brand-emerald/10 text-[9px]">
                            FREE
                          </span>
                        )}
                        {!canWatch && (
                          <span className="text-brand-orange flex items-center gap-0.5 text-[10px]">
                            <Lock className="w-2.5 h-2.5" /> ล็อก
                          </span>
                        )}
                        {ep.prompts && ep.prompts.length > 0 && (
                          <span className="text-amber-400 text-[10px]">
                            ⚡ {ep.prompts.length} Prompts
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

          </aside>
        )}

      </div>

    </div>
  );
}

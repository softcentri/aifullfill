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
  Loader2
} from "lucide-react";

interface Episode {
  id: string;
  order: number;
  title: string;
  duration: string;
  videoUrl: string;
  isFreePreview: boolean;
  section: string;
}

interface Attachment {
  id: string;
  title: string;
  fileSize: string;
  fileType: string;
  downloadUrl: string;
}

// ข้อมูลจำลองสำรองกรณีคอร์สยังไม่ถูก Seed ใน DB
const FALLBACK_COURSE_SECTIONS = [
  {
    name: "ทฤษฎีและการเตรียมเครื่องมือ",
    episodes: [
      {
        id: "ep-1",
        order: 1,
        title: "EP.1 AI Game Developer ทฤษฎีและแนวคิด Vibe Coding",
        duration: "30 นาที",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0",
        isFreePreview: true,
        section: "ทฤษฎีและการเตรียมเครื่องมือ",
      },
      {
        id: "ep-2",
        order: 2,
        title: "Ep.2 การติดตั้ง Environment, Claude Code และ Game Engine",
        duration: "7 นาที",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0",
        isFreePreview: false,
        section: "ทฤษฎีและการเตรียมเครื่องมือ",
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
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0",
        isFreePreview: false,
        section: "Workshop สร้างเกมจริง",
      },
      {
        id: "ep-4",
        order: 4,
        title: "Ep.4 Workshop 2 ออกแบบกราฟิก Pixel Art ตัวละครและฉาก",
        duration: "15 นาที",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0",
        isFreePreview: false,
        section: "Workshop สร้างเกมจริง",
      },
      {
        id: "ep-5",
        order: 5,
        title: "Ep.5 Workshop 3 ระบบเกม Clicker / Idle และระบบ Inventory",
        duration: "37 นาที",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0",
        isFreePreview: false,
        section: "Workshop สร้างเกมจริง",
      },
      {
        id: "ep-6",
        order: 6,
        title: "Ep.6 Workshop 4 พัฒนาระบบ MMO Multiplayer Real-time",
        duration: "2 ชม. 25 น.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0",
        isFreePreview: false,
        section: "Workshop สร้างเกมจริง",
      },
      {
        id: "ep-7",
        order: 7,
        title: "Ep.7 สรุปโปรเจกต์และแนวทางการ Deploy สู่ Steam & Web",
        duration: "9 นาที",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0",
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
  const [courseId, setCourseId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([
    {
      id: "att-1",
      title: "ซอร์สโค้ดเกม AI Game Developer (Complete Engine & Assets).zip",
      fileSize: "24.5 MB",
      fileType: "ZIP / TypeScript",
      downloadUrl: "#",
    },
  ]);

  const [sections, setSections] = useState(FALLBACK_COURSE_SECTIONS);
  const allEpisodes = sections.flatMap((s) => s.episodes);

  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const currentEpisode = allEpisodes[currentEpisodeIndex] || allEpisodes[0];

  const [completedEpisodeIds, setCompletedEpisodeIds] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "resources" | "qa">("overview");
  const [showAttachmentsDrawer, setShowAttachmentsDrawer] = useState(false);

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
            required_tier,
            course_episodes (
              id,
              title,
              video_url,
              duration_minutes,
              is_free_preview,
              order_number
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

          // จัดตอนเรียนลง Section
          const rawEpisodes = (courseData.course_episodes || []).sort(
            (a: any, b: any) => a.order_number - b.order_number
          );

          if (rawEpisodes.length > 0) {
            const mappedEpisodes: Episode[] = rawEpisodes.map((ep: any) => ({
              id: ep.id,
              order: ep.order_number,
              title: ep.title,
              duration: `${ep.duration_minutes || 10} นาที`,
              videoUrl: ep.video_url || "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0",
              isFreePreview: ep.is_free_preview || false,
              section: ep.order_number <= 2 ? "ทฤษฎีและการเตรียมเครื่องมือ" : "Workshop สร้างเกมจริง",
            }));

            // แยกกลุ่ม Section
            const sec1 = mappedEpisodes.filter((e) => e.section === "ทฤษฎีและการเตรียมเครื่องมือ");
            const sec2 = mappedEpisodes.filter((e) => e.section === "Workshop สร้างเกมจริง");

            setSections([
              { name: "ทฤษฎีและการเตรียมเครื่องมือ", episodes: sec1.length > 0 ? sec1 : mappedEpisodes.slice(0, 2) },
              { name: "Workshop สร้างเกมจริง", episodes: sec2.length > 0 ? sec2 : mappedEpisodes.slice(2) },
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

    fetchCourseData();
  }, [slug, supabase]);

  // สลับสถานะเรียนจบ บันทึกลง Supabase จริง!
  const toggleComplete = async (episodeId: string) => {
    const isCompleted = completedEpisodeIds.includes(episodeId);
    const newCompleted = isCompleted
      ? completedEpisodeIds.filter((id) => id !== episodeId)
      : [...completedEpisodeIds, episodeId];

    setCompletedEpisodeIds(newCompleted);

    // บันทึกลง Supabase ถ้าล็อกอินอยู่
    if (currentUser && courseId) {
      await supabase.from("user_episode_progress").upsert({
        user_id: currentUser.id,
        course_id: courseId,
        episode_id: episodeId,
        completed: !isCompleted,
        completed_at: new Date().toISOString(),
      });
    }
  };

  const handlePrev = () => {
    if (currentEpisodeIndex > 0) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentEpisodeIndex < allEpisodes.length - 1) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  };

  const isCurrentCompleted = completedEpisodeIds.includes(currentEpisode?.id);
  const canWatchCurrent = hasCourseAccess || currentEpisode?.isFreePreview;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3 font-sans text-white">
        <Loader2 className="w-8 h-8 text-brand-emerald animate-spin" />
        <p className="text-xs text-slate-400">กำลังเชื่อมต่อข้อมูลบทเรียนจาก Supabase...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* =========================================================================
          1. TOP NAVIGATION BAR (สไตล์ UDEMY CLASSROOM)
      ========================================================================= */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
        
        {/* Left Title & Sidebar Toggle */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="เปิด/ปิด สารบัญบทเรียน"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-sm text-white hidden sm:inline truncate">
              {courseTitle}
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-xs text-brand-emerald font-medium truncate">
              {currentEpisode?.title}
            </span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>คอร์สทั้งหมด</span>
          </Link>
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
              <iframe
                src={currentEpisode?.videoUrl}
                title={currentEpisode?.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
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
                    className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange-hover hover:to-amber-600 shadow-lg shadow-brand-orange/25 transition-transform hover:scale-105"
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
                    ? "bg-brand-emerald text-white hover:bg-brand-emerald-dark"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCurrentCompleted ? "เรียนจบแล้ว ✓" : "ทำเครื่องหมายว่าเรียนจบ"}</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentEpisodeIndex === allEpisodes.length - 1}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-emerald hover:bg-brand-emerald-dark disabled:opacity-40 disabled:hover:bg-brand-emerald text-slate-950 transition-colors"
              >
                ถัดไป <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Attachment Button under Player */}
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

          {/* Quick Attachments Drawer */}
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
                      <div className="w-8 h-8 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center flex-shrink-0 font-bold text-xs">
                        {file.fileType.includes("ZIP") ? "ZIP" : "PDF"}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-200 truncate">{file.title}</div>
                        <div className="text-[10px] text-slate-400">{file.fileSize} • {file.fileType}</div>
                      </div>
                    </div>
                    <a
                      href={file.downloadUrl}
                      onClick={() => alert("กำลังดาวน์โหลดไฟล์...")}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-emerald text-slate-950 hover:bg-brand-emerald-dark transition-colors flex items-center gap-1 flex-shrink-0"
                    >
                      <Download className="w-3 h-3" /> โหลด
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Tabs (สไตล์ Udemy: Overview, Resources, Q&A) */}
          <div className="p-4 sm:p-8 space-y-6">
            
            {/* Tab Headers */}
            <div className="flex items-center gap-6 border-b border-slate-800 text-sm font-semibold">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 transition-colors relative ${
                  activeTab === "overview"
                    ? "text-brand-emerald border-b-2 border-brand-emerald"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ภาพรวมบทเรียน (Overview)
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
                  activeTab === "resources"
                    ? "text-brand-emerald border-b-2 border-brand-emerald"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>ไฟล์และโค้ดดาวน์โหลด</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-brand-orange">
                  {attachments.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("qa")}
                className={`pb-3 transition-colors relative ${
                  activeTab === "qa"
                    ? "text-brand-emerald border-b-2 border-brand-emerald"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ถาม-ตอบ (Q&A)
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-xl font-bold text-white">{currentEpisode?.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  ในตอนนี้เราจะมาเรียนรู้การวางโครงสร้างโปรเจกต์ด้วยเทคนิค Vibe Coding โดยใช้ Claude Code 
                  เป็นคู่หูในการเขียนสคริปต์ ออกแบบสถาปัตยกรรมตัวละคร และเชื่อมต่อ Event Loop ของ Game Engine 
                  เพื่อให้ระบบรันได้อย่างลื่นไหลและพร้อมรองรับการขยายขนาดในอนาคต
                </p>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 mt-4">
                  <h4 className="text-xs font-bold text-brand-emerald uppercase tracking-wider">
                    สิ่งที่คุณจะได้ลงมือทำในตอนนี้:
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
                      <span>โครงสร้าง Clean Architecture ไร้ N+1 Query</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
                      <span>การป้อน System Prompt ให้ Claude จัดการ Game Loop</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
                      <span>บันทึกความคืบหน้าตรงเข้า Supabase ทันที</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-base font-bold text-white">ไฟล์และซอร์สโค้ดทั้งหมดสำหรับคอร์สนี้</h3>
                <div className="space-y-3">
                  {attachments.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center font-bold text-xs">
                          {file.fileType.includes("ZIP") ? "ZIP" : "PDF"}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{file.title}</div>
                          <div className="text-xs text-slate-400">{file.fileSize} • {file.fileType}</div>
                        </div>
                      </div>
                      <a
                        href={file.downloadUrl}
                        onClick={() => alert("เริ่มดาวน์โหลดไฟล์แล้วครับ")}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-emerald text-slate-950 hover:bg-brand-emerald-dark transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> ดาวน์โหลด
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "qa" && (
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">คำถามที่พบบ่อยและข้อสงสัย</h3>
                  <button className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-orange text-white hover:bg-brand-orange-hover transition-colors">
                    + ตั้งคำถามใหม่
                  </button>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
                  ยังไม่มีคำถามในตอนนี้ หากคุณติดปัญหาในบทเรียน สามารถกดปุ่มตั้งคำถามเพื่อคุยกับทีมผู้สอนได้ตลอดเวลาครับ
                </div>
              </div>
            )}

          </div>
        </div>

        {/* =========================================================================
            3. RIGHT / LEFT SIDEBAR: สารบัญบทเรียนแบบ ACCORDION (UDEMY STYLE)
        ========================================================================= */}
        {sidebarOpen && (
          <aside className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-auto lg:h-[calc(100vh-3.5rem)] lg:sticky lg:top-14 overflow-y-auto">
            
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-emerald" />
                สารบัญเนื้อหาคอร์ส
              </span>
              <span className="text-xs text-slate-400">
                {completedEpisodeIds.length}/{allEpisodes.length} ตอนจบแล้ว
              </span>
            </div>

            {/* Top Quick Resource Badge in Sidebar */}
            {attachments.length > 0 && (
              <div className="p-3 border-b border-slate-800/80 bg-amber-500/5">
                <button
                  onClick={() => setShowAttachmentsDrawer(true)}
                  className="w-full p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center justify-between text-xs font-bold"
                >
                  <span className="flex items-center gap-2">
                    <FolderDown className="w-4 h-4 text-brand-orange" />
                    ไฟล์ที่เกี่ยวข้อง ({attachments.length} ไฟล์)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            )}

            {/* Sections Accordion */}
            <div className="divide-y divide-slate-800/80 flex-1">
              {sections.map((section, sIdx) => (
                <div key={sIdx} className="p-2">
                  <div className="px-3 py-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>{section.name}</span>
                    <span className="text-[10px] font-normal text-slate-500">{section.episodes.length} บทเรียน</span>
                  </div>

                  <div className="space-y-1 mt-1">
                    {section.episodes.map((ep) => {
                      const isCurrent = ep.id === currentEpisode?.id;
                      const isCompleted = completedEpisodeIds.includes(ep.id);
                      const epGlobalIndex = allEpisodes.findIndex((e) => e.id === ep.id);

                      return (
                        <button
                          key={ep.id}
                          onClick={() => setCurrentEpisodeIndex(epGlobalIndex)}
                          className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 relative ${
                            isCurrent
                              ? "bg-brand-emerald/15 text-white border border-brand-emerald/40 shadow-sm"
                              : "hover:bg-slate-800/80 text-slate-300"
                          }`}
                        >
                          {/* Active Indicator Bar */}
                          {isCurrent && (
                            <div className="absolute left-0 top-2 bottom-2 w-1 bg-brand-emerald rounded-r-full" />
                          )}

                          {/* Checkbox Icon */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComplete(ep.id);
                            }}
                            className="mt-0.5 flex-shrink-0 cursor-pointer"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-600 hover:border-brand-emerald" />
                            )}
                          </div>

                          {/* Episode Title & Duration */}
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-semibold leading-snug line-clamp-2 ${isCurrent ? "text-brand-emerald" : ""}`}>
                              {ep.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <Play className="w-2.5 h-2.5" /> {ep.duration}
                              </span>
                              {ep.isFreePreview ? (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-orange/20 text-brand-orange">
                                  ดูฟรี
                                </span>
                              ) : !hasCourseAccess ? (
                                <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                                  <Lock className="w-2.5 h-2.5" /> ล็อก
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </aside>
        )}

      </div>
    </div>
  );
}

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
  Check,
  Award,
  Send,
  ShieldCheck
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
  const [userProfile, setUserProfile] = useState<any>(null);
  const [hasCourseAccess, setHasCourseAccess] = useState(false);

  const [courseTitle, setCourseTitle] = useState("AI Game Developer: Vibe Coding");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseInstructor, setCourseInstructor] = useState("อาจารย์อั๋น (AIEbookAcademy)");
  const [courseId, setCourseId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // Q&A State
  const [questions, setQuestions] = useState<any[]>([]);
  const [showAskForm, setShowAskForm] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [submittingReplyId, setSubmittingReplyId] = useState<string | null>(null);

  // Certificate State (Opt-in when 100% completed)
  const [userCertificate, setUserCertificate] = useState<any | null>(null);
  const [declinedCertificate, setDeclinedCertificate] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [recipientNameInput, setRecipientNameInput] = useState("");
  const [isIssuingCert, setIsIssuingCert] = useState(false);

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

        if (user) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();
          setUserProfile(prof);
          setRecipientNameInput(prof?.full_name || user.email?.split("@")[0] || "");
        }

        // 1. ดึงข้อมูลคอร์สจาก Supabase ด้วย Slug
        const { data: courseData } = await supabase
          .from("courses")
          .select(`
            id,
            title,
            slug,
            description,
            instructor,
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
          if (courseData.instructor) setCourseInstructor(courseData.instructor);

          if (typeof window !== "undefined") {
            const declined = localStorage.getItem(`cert_declined_${courseData.id}`);
            if (declined === "true") setDeclinedCertificate(true);
          }

          // ดึงรายการคำถาม-คำตอบ (Q&A) ของคอร์สนี้
          const { data: qaData } = await supabase
            .from("course_questions")
            .select(`
              *,
              profiles:user_id (full_name, email, role),
              course_answers (
                *,
                profiles:user_id (full_name, email, role)
              )
            `)
            .eq("course_id", courseData.id)
            .order("created_at", { ascending: false });

          if (qaData) {
            setQuestions(qaData);
          }

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

            // 4. ตรวจสอบว่าผู้เรียนเคยกดรับใบประกาศนียบัตรของคอร์สนี้แล้วหรือยัง
            const { data: existingCert } = await supabase
              .from("course_certificates")
              .select("*")
              .eq("user_id", user.id)
              .eq("course_id", courseData.id)
              .maybeSingle();

            if (existingCert) {
              setUserCertificate(existingCert);
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

  // ตั้งคำถามใหม่ใน Q&A
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !courseId || !questionTitle.trim() || !questionContent.trim()) return;
    setIsSubmittingQuestion(true);

    try {
      const epTag = currentEpisode ? `EP.${currentEpisode.order}: ${currentEpisode.title}` : null;
      const { data: newQ, error } = await supabase
        .from("course_questions")
        .insert({
          course_id: courseId,
          episode_title: epTag,
          user_id: currentUser.id,
          title: questionTitle.trim(),
          content: questionContent.trim(),
        })
        .select(`
          *,
          profiles:user_id (full_name, email, role),
          course_answers (
            *,
            profiles:user_id (full_name, email, role)
          )
        `)
        .single();

      if (!error && newQ) {
        setQuestions([newQ, ...questions]);
        setQuestionTitle("");
        setQuestionContent("");
        setShowAskForm(false);
      }
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  // ตอบคำถามใน Q&A
  const handleReplyQuestion = async (questionId: string) => {
    const text = (replyInputs[questionId] || "").trim();
    if (!currentUser || !text) return;
    setSubmittingReplyId(questionId);

    try {
      const isInstructor = userProfile?.role === "admin";
      const { data: newAns, error } = await supabase
        .from("course_answers")
        .insert({
          question_id: questionId,
          user_id: currentUser.id,
          content: text,
          is_instructor_reply: isInstructor,
        })
        .select(`
          *,
          profiles:user_id (full_name, email, role)
        `)
        .single();

      if (!error && newAns) {
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === questionId
              ? { ...q, course_answers: [...(q.course_answers || []), newAns] }
              : q
          )
        );
        setReplyInputs((prev) => ({ ...prev, [questionId]: "" }));
      }
    } finally {
      setSubmittingReplyId(null);
    }
  };

  // สลับสถานะแก้ไขแล้ว (Resolved) ของคำถาม
  const handleToggleResolved = async (questionId: string, currentResolved: boolean) => {
    const { error } = await supabase
      .from("course_questions")
      .update({ is_resolved: !currentResolved })
      .eq("id", questionId);

    if (!error) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, is_resolved: !currentResolved } : q))
      );
    }
  };

  // ผู้เรียนเลือกไม่รับใบเซอร์ตอนนี้
  const handleDeclineCertificate = () => {
    setDeclinedCertificate(true);
    setShowCertModal(false);
    if (courseId && typeof window !== "undefined") {
      localStorage.setItem(`cert_declined_${courseId}`, "true");
    }
  };

  // ออกใบประกาศนียบัตร (เมื่อเรียนจบ 100% และผู้เรียนกดยืนยันรับใบเซอร์)
  const handleClaimCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !courseId || !recipientNameInput.trim()) return;
    setIsIssuingCert(true);

    try {
      const yearStr = new Date().getFullYear();
      const randStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      const certCode = `CERT-${yearStr}-${randStr}`;

      const { data: cert, error } = await supabase
        .from("course_certificates")
        .upsert(
          {
            certificate_code: userCertificate?.certificate_code || certCode,
            user_id: currentUser.id,
            course_id: courseId,
            recipient_name: recipientNameInput.trim(),
            course_title: courseTitle,
            instructor_name: courseInstructor,
          },
          { onConflict: "user_id,course_id" }
        )
        .select()
        .single();

      if (!error && cert) {
        setUserCertificate(cert);
        setShowCertModal(false);
        router.push(`/certificates/${cert.certificate_code}`);
      }
    } finally {
      setIsIssuingCert(false);
    }
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

          {/* ปุ่มรับ / ดูใบประกาศนียบัตร เมื่อเรียนจบ 100% */}
          {progressPercent === 100 && currentUser && courseId && (
            userCertificate ? (
              <Link
                href={`/certificates/${userCertificate.certificate_code}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-emerald/20 hover:bg-brand-emerald/30 text-xs font-extrabold text-brand-emerald border border-brand-emerald/40 transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-brand-orange" />
                <span>ดูใบเซอร์ของคุณ</span>
              </Link>
            ) : (
              <button
                onClick={() => setShowCertModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-hover text-xs font-extrabold text-white shadow transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                <span>ขอรับใบเซอร์</span>
              </button>
            )
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-emerald" />
            <span className="hidden sm:inline">{sidebarOpen ? "ซ่อนสารบัญ" : "ดูสารบัญ"}</span>
          </button>
        </div>
      </header>

      {/* แถบแจ้งเตือนเมื่อเรียนจบ 100% ให้ผู้เรียนเลือกได้ว่าจะรับใบประกาศนียบัตรหรือไม่ */}
      {progressPercent === 100 && currentUser && courseId && !userCertificate && !declinedCertificate && (
        <div className="bg-gradient-to-r from-brand-emerald/20 via-slate-900 to-brand-orange/20 border-b border-brand-emerald/40 px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <div className="w-8 h-8 rounded-full bg-brand-emerald text-slate-950 flex items-center justify-center shrink-0 font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-white">
                🎉 ยินดีด้วย! คุณเรียนจบคอร์สนี้ครบ 100% แล้ว
              </span>
              <span className="text-slate-300 ml-2">
                คุณต้องการรับใบประกาศนียบัตร (Certificate of Completion) สำหรับคอร์สนี้หรือไม่?
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCertModal(true)}
              className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-brand-orange hover:bg-brand-orange-hover text-white shadow transition-all flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5" />
              <span>รับใบประกาศนียบัตร</span>
            </button>
            <button
              onClick={handleDeclineCertificate}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              ยังไม่รับ / ไม่ต้องการรับ
            </button>
          </div>
        </div>
      )}

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
                {questions.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-brand-emerald/20 text-brand-emerald font-bold">
                    {questions.length}
                  </span>
                )}
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

            {/* TAB 4: Q&A (ระบบถาม-ตอบจริงใต้บทเรียน) */}
            {activeTab === "qa" && (
              <div className="space-y-6 max-w-3xl animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-brand-emerald" />
                      <span>กระดานถาม-ตอบประจำหลักสูตร ({questions.length} คำถาม)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      สอบถามข้อสงสัยเกี่ยวกับเนื้อหา โค้ด หรือเครื่องมือในบทเรียนนี้กับอาจารย์ผู้สอนและเพื่อนร่วมคลาส
                    </p>
                  </div>

                  {currentUser && courseId ? (
                    <button
                      onClick={() => setShowAskForm(!showAskForm)}
                      className="px-4 py-2 rounded-full text-xs font-bold bg-brand-orange text-white hover:bg-brand-orange-hover tactile-button-primary transition-colors self-start sm:self-auto"
                    >
                      {showAskForm ? "ยกเลิกการตั้งคำถาม" : "+ ตั้งคำถามใหม่"}
                    </button>
                  ) : (
                    <Link
                      href={`/login?next=/courses/${slug}`}
                      className="px-4 py-2 rounded-full text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 self-start sm:self-auto"
                    >
                      เข้าสู่ระบบเพื่อตั้งคำถาม →
                    </Link>
                  )}
                </div>

                {/* ฟอร์มตั้งคำถามใหม่ */}
                {showAskForm && currentUser && (
                  <form
                    onSubmit={handleAskQuestion}
                    className="p-5 rounded-2xl bg-slate-900 border border-brand-orange/40 space-y-4 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-orange">
                        ตั้งคำถามสำหรับ {currentEpisode ? `EP.${currentEpisode.order}: ${currentEpisode.title}` : "คอร์สนี้"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        หัวข้อคำถาม / ปัญหาที่พบ <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={questionTitle}
                        onChange={(e) => setQuestionTitle(e.target.value)}
                        placeholder="เช่น ติดปัญหาตอนรันคำสั่งเชื่อมต่อ Supabase หรือตั้งค่า Prompt..."
                        className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-emerald"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        รายละเอียดคำถาม <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={questionContent}
                        onChange={(e) => setQuestionContent(e.target.value)}
                        placeholder="อธิบายอาการ Error หรือสิ่งที่ต้องการทราบเพิ่มเติม..."
                        className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-emerald"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAskForm(false)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingQuestion}
                        className="px-5 py-2 rounded-xl text-xs font-extrabold bg-brand-emerald text-slate-950 hover:bg-emerald-600 disabled:opacity-50"
                      >
                        {isSubmittingQuestion ? "กำลังส่งคำถาม..." : "โพสต์คำถามทันที"}
                      </button>
                    </div>
                  </form>
                )}

                {/* รายการคำถามและคำตอบ */}
                {questions.length === 0 ? (
                  <div className="p-10 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                    <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-300">ยังไม่มีคำถามในคอร์สนี้</p>
                    <p className="text-xs text-slate-500">
                      หากคุณมีข้อสงสัยหรือติดปัญหาในบทเรียน สามารถกดปุ่ม "+ ตั้งคำถามใหม่" เป็นคนแรกได้เลยครับ
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((q) => {
                      const canResolve =
                        currentUser &&
                        (currentUser.id === q.user_id || userProfile?.role === "admin");

                      return (
                        <div
                          key={q.id}
                          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                {q.episode_title && (
                                  <span className="px-2 py-0.5 rounded bg-slate-800 text-brand-emerald font-mono text-[10px] font-bold">
                                    {q.episode_title}
                                  </span>
                                )}
                                {q.is_resolved && (
                                  <span className="px-2 py-0.5 rounded-full bg-brand-emerald/20 text-brand-emerald text-[10px] font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> ได้รับคำตอบแล้ว
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-sm text-white pt-1">{q.title}</h4>
                              <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                                {q.content}
                              </p>
                              <div className="text-[11px] text-slate-500 pt-1">
                                ถามโดย{" "}
                                <strong className="text-slate-300">
                                  {q.profiles?.full_name || q.profiles?.email?.split("@")[0] || "ผู้เรียน"}
                                </strong>{" "}
                                • {new Date(q.created_at).toLocaleDateString("th-TH")}
                              </div>
                            </div>

                            {canResolve && (
                              <button
                                onClick={() => handleToggleResolved(q.id, q.is_resolved)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 border transition-colors ${
                                  q.is_resolved
                                    ? "bg-slate-800 text-slate-400 border-slate-700"
                                    : "bg-brand-emerald/15 text-brand-emerald border-brand-emerald/30 hover:bg-brand-emerald/25"
                                }`}
                              >
                                {q.is_resolved ? "เปิดคำถามอีกครั้ง" : "✓ ทำเครื่องหมายว่าได้คำตอบแล้ว"}
                              </button>
                            )}
                          </div>

                          {/* รายการคำตอบ */}
                          {Array.isArray(q.course_answers) && q.course_answers.length > 0 && (
                            <div className="pl-4 border-l-2 border-slate-800 space-y-3 pt-2">
                              {q.course_answers.map((ans: any) => (
                                <div
                                  key={ans.id}
                                  className={`p-3.5 rounded-xl text-xs space-y-1.5 ${
                                    ans.is_instructor_reply
                                      ? "bg-brand-orange/10 border border-brand-orange/30"
                                      : "bg-slate-950 border border-slate-800/80"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-white">
                                      {ans.profiles?.full_name ||
                                        ans.profiles?.email?.split("@")[0] ||
                                        "สมาชิก"}
                                    </span>
                                    {ans.is_instructor_reply && (
                                      <span className="px-2 py-0.5 rounded-full bg-brand-orange text-white text-[9px] font-extrabold uppercase flex items-center gap-1">
                                        <ShieldCheck className="w-2.5 h-2.5" /> อาจารย์ผู้สอน / Admin
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-500">
                                      {new Date(ans.created_at).toLocaleDateString("th-TH")}
                                    </span>
                                  </div>
                                  <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                                    {ans.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* ช่องพิมพ์ตอบกลับ */}
                          {currentUser && (
                            <div className="flex items-center gap-2 pt-2">
                              <input
                                type="text"
                                value={replyInputs[q.id] || ""}
                                onChange={(e) =>
                                  setReplyInputs((prev) => ({ ...prev, [q.id]: e.target.value }))
                                }
                                placeholder="พิมพ์คำตอบหรือคำแนะนำเพิ่มเติม..."
                                className="flex-1 px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-emerald"
                              />
                              <button
                                type="button"
                                onClick={() => handleReplyQuestion(q.id)}
                                disabled={
                                  submittingReplyId === q.id || !(replyInputs[q.id] || "").trim()
                                }
                                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-brand-emerald hover:text-slate-950 text-slate-200 disabled:opacity-40 transition-colors flex items-center gap-1"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>ตอบกลับ</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
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

      {/* Modal ยืนยันการรับใบประกาศนียบัตร (เลือกได้ว่าจะรับหรือไม่ + แก้ไขชื่อบนใบเซอร์ได้) */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-brand-orange/20 border border-brand-orange/40 text-brand-orange flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    ออกใบประกาศนียบัตรสำเร็จหลักสูตร
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    คุณเรียนจบครบ 100% แล้ว สามารถเลือกรับใบเซอร์หรือข้ามได้ตามต้องการ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCertModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleClaimCertificate} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="text-slate-400">หลักสูตรที่สำเร็จการศึกษา:</div>
                <div className="font-bold text-brand-emerald">{courseTitle}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ชื่อ-นามสกุล ที่ต้องการให้ปรากฏบนใบประกาศนียบัตร <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={recipientNameInput}
                  onChange={(e) => setRecipientNameInput(e.target.value)}
                  placeholder="ระบุชื่อ-นามสกุล (ภาษาไทย หรือ ภาษาอังกฤษ)"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-brand-emerald"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  สามารถพิมพ์ได้ทั้งชื่อภาษาไทยและภาษาอังกฤษตามที่คุณต้องการนำไปใช้งาน
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isIssuingCert || !recipientNameInput.trim()}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-extrabold bg-brand-emerald hover:bg-emerald-600 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-brand-emerald/20 disabled:opacity-50"
                >
                  <Award className="w-4 h-4" />
                  <span>{isIssuingCert ? "กำลังออกใบเซอร์..." : "ยืนยันรับใบประกาศนียบัตร"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeclineCertificate}
                  className="py-3 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  ไม่รับใบเซอร์
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

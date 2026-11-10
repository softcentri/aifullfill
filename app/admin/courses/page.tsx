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
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  instructor: string;
  content_type: string;
  required_tier: "standard" | "premium";
  github_repo_url: string;
  demo_url: string;
  is_published: boolean;
  order_number: number;
  created_at: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    thumbnail_url: "",
    instructor: "AI Academy",
    content_type: "course",
    required_tier: "standard",
    github_repo_url: "",
    demo_url: "",
    is_published: true,
    order_number: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      thumbnail_url: "",
      instructor: "AI Academy",
      content_type: "course",
      required_tier: "standard",
      github_repo_url: "",
      demo_url: "",
      is_published: true,
      order_number: courses.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      slug: course.slug,
      description: course.description || "",
      thumbnail_url: course.thumbnail_url || "",
      instructor: course.instructor || "AI Academy",
      content_type: course.content_type || "course",
      required_tier: course.required_tier || "standard",
      github_repo_url: course.github_repo_url || "",
      demo_url: course.demo_url || "",
      is_published: course.is_published,
      order_number: course.order_number,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
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
        setIsModalOpen(false);
        fetchCourses();
      } else {
        showAlert("error", data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      showAlert("error", "ไม่สามารถบันทึกข้อมูลคอร์สได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!confirm(`ยืนยันการลบคอร์ส "${course.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/courses?id=${course.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        showAlert("success", data.message);
        fetchCourses();
      } else {
        showAlert("error", data.error || "ไม่สามารถลบได้");
      }
    } catch (err) {
      showAlert("error", "เกิดข้อผิดพลาดในการลบคอร์ส");
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...course,
          is_published: !course.is_published,
        }),
      });

      if (res.ok) {
        showAlert("success", `${course.is_published ? "ซ่อนคอร์ส (Draft)" : "เผยแพร่คอร์ส (Published)"} เรียบร้อยแล้ว`);
        fetchCourses();
      }
    } catch (err) {
      showAlert("error", "เกิดข้อผิดพลาด");
    }
  };

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Content & E-Learning
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            จัดการคอร์สเรียน & คลังโปรเจกต์
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            เพิ่มคอร์ส AI, กำหนดสิทธิ์ระดับสมาชิก (Standard vs Premium Buffet) และซิงค์ซอร์สโค้ด GitHub
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCourses}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-purple-400" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="py-2 px-4 rounded-xl text-xs font-bold bg-brand-orange hover:bg-brand-orange-hover text-white flex items-center gap-1.5 shadow-lg shadow-brand-orange/20"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างคอร์สใหม่</span>
          </button>
        </div>
      </div>

      {alert && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-3 animate-in slide-in-from-top ${
            alert.type === "success"
              ? "bg-brand-emerald/15 border border-brand-emerald/30 text-brand-emerald"
              : "bg-rose-500/15 border border-rose-500/30 text-rose-400"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span className="font-medium">{alert.message}</span>
        </div>
      )}

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อคอร์ส หรือ slug..."
          className="w-full text-xs bg-transparent border-none text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Course List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-xs text-slate-500">
            {loading ? "กำลังโหลดคอร์ส..." : "ยังไม่มีคอร์สเรียนในระบบ กดปุ่ม 'สร้างคอร์สใหม่' เพื่อเริ่มต้น"}
          </div>
        ) : (
          filtered.map((course) => (
            <div
              key={course.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail / Header */}
                <div className="h-36 bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 relative p-4 flex flex-col justify-between border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        course.required_tier === "premium"
                          ? "bg-brand-orange/20 text-brand-orange border border-brand-orange/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {course.required_tier === "premium" ? "👑 Premium (Buffet)" : "Standard"}
                    </span>

                    <button
                      onClick={() => handleTogglePublish(course)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        course.is_published
                          ? "bg-brand-emerald/20 text-brand-emerald"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {course.is_published ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>เผยแพร่อยู่</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>ร่าง (Draft)</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-white text-base leading-snug line-clamp-2">
                      {course.title}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      /{course.slug}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 space-y-2 text-xs text-slate-400">
                  <p className="line-clamp-2 leading-relaxed">
                    {course.description || "ไม่มีคำอธิบายคอร์ส"}
                  </p>
                  {course.github_repo_url && (
                    <div className="flex items-center gap-1 text-[11px] text-indigo-400 truncate">
                      <Code2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">{course.github_repo_url}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <Link
                  href={`/courses/${course.slug}`}
                  target="_blank"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <span>พรีวิว</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(course)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(course)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: เพิ่ม / แก้ไขคอร์ส */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingCourse ? "แก้ไขข้อมูลคอร์สเรียน" : "สร้างคอร์สเรียนใหม่"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">ชื่อคอร์ส (Title) *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = editingCourse ? formData.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    setFormData({ ...formData, title, slug });
                  }}
                  placeholder="เช่น Master AI Agent & MCP Integration"
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Slug URL (สำหรับลิงก์) *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="master-ai-agent"
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">คำอธิบายคอร์ส (Description)</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="เนื้อหาหลัก สิ่งที่จะได้เรียนรู้..."
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">ระดับสิทธิ์ที่ต้องการ</label>
                  <select
                    value={formData.required_tier}
                    onChange={(e: any) => setFormData({ ...formData, required_tier: e.target.value })}
                    className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="standard">Standard (เข้าถึงได้ทุกคน)</option>
                    <option value="premium">👑 Premium (เฉพาะบุฟเฟต์)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">ประเภทเนื้อหา</label>
                  <select
                    value={formData.content_type}
                    onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                    className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="course">คอร์สเรียน (Course)</option>
                    <option value="project">ซอร์สโค้ดโปรเจกต์ (Project)</option>
                    <option value="tool">เครื่องมือสำเร็จรูป (Tool)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">GitHub Repo URL (ถ้ามี)</label>
                <input
                  type="url"
                  value={formData.github_repo_url}
                  onChange={(e) => setFormData({ ...formData, github_repo_url: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
                />
                <label htmlFor="is_published" className="text-slate-300 font-medium">
                  เผยแพร่คอร์สเรียนนี้ทันที (Published)
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <span>{editingCourse ? "บันทึกการแก้ไข" : "สร้างคอร์ส"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

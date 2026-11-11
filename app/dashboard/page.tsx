"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { 
  User, 
  Sparkles, 
  ShieldCheck, 
  KeyRound, 
  Terminal, 
  Copy, 
  Check, 
  BookOpen, 
  Code2, 
  Wrench, 
  FileText, 
  HelpCircle, 
  Bell, 
  MessageCircle, 
  Users, 
  Share2, 
  RefreshCw, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Laptop,
  PlayCircle,
  Loader2
} from "lucide-react";

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  fullKey?: string;
  createdAt: string;
  lastUsed: string;
  status: "active" | "revoked";
}

interface McpServerItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  version: string;
  status: "licensed" | "locked";
  requiredTier: "standard" | "premium";
}

export default function MemberDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [paymentOrders, setPaymentOrders] = useState<any[]>([]);
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [myAttachments, setMyAttachments] = useState<any[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [activeTab, setActiveTab] = useState<"overview" | "mcp-keys" | "my-courses" | "my-projects">("overview");

  // State สำหรับ API Keys
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [justCreatedKey, setJustCreatedKey] = useState<string | null>(null);
  const [isCreatingKey, setIsCreatingKey] = useState(false);

  const handleCopy = (id: string, key: string) => {
    navigator.clipboard?.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // ดึงข้อมูลผู้ใช้และ API Keys จาก Supabase จริง
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingUser(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?next=/dashboard");
        return;
      }

      setCurrentUser(user);

      // 1. ดึงข้อมูล Profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setUserProfile(profile);
      setProfileNameInput(profile?.full_name || user.email?.split("@")[0] || "");

      // 2. ดึงข้อมูล Subscription
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setSubscription(sub);

      // 2.5 ดึงประวัติการแจ้งโอนเงิน (Payment Orders)
      const { data: pOrders } = await supabase
        .from("payment_orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (pOrders) {
        setPaymentOrders(pOrders);
      }

      // 2.6 ดึงรายการคอร์ส + ความก้าวหน้าการเรียน + ไฟล์แนบซอร์สโค้ด + ใบประกาศนียบัตร
      const [{ data: dbCourses }, { data: progressRows }, { data: attRows }, { data: certRows }] = await Promise.all([
        supabase
          .from("courses")
          .select("id, slug, title, description, category, required_tier, course_episodes(id)")
          .eq("is_published", true)
          .order("order_number", { ascending: true }),
        supabase
          .from("user_episode_progress")
          .select("course_id, episode_id, completed")
          .eq("user_id", user.id)
          .eq("completed", true),
        supabase
          .from("course_attachments")
          .select("id, title, file_url, file_type, file_size, courses:course_id(title, slug, required_tier)")
          .order("created_at", { ascending: false }),
        supabase
          .from("course_certificates")
          .select("course_id, certificate_code")
          .eq("user_id", user.id),
      ]);

      if (dbCourses) {
        const progList = progressRows || [];
        const certList = certRows || [];
        const mapped = dbCourses.map((c: any) => {
          const totalEps = Array.isArray(c.course_episodes) ? c.course_episodes.length : 0;
          const doneEps = progList.filter((p: any) => p.course_id === c.id).length;
          const pct = totalEps > 0 ? Math.round((doneEps / totalEps) * 100) : 0;
          const certObj = certList.find((cert: any) => cert.course_id === c.id);
          return {
            ...c,
            totalEps: totalEps || 6,
            doneEps,
            progressPercent: pct,
            certificateCode: certObj?.certificate_code || null,
          };
        });
        setMyCourses(mapped);
      }

      if (attRows) {
        setMyAttachments(attRows);
      }

      // 3. ดึง API Keys จริงของผู้ใช้
      const { data: keys } = await supabase
        .from("user_api_keys")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (keys) {
        setApiKeys(
          keys.map((k: any) => ({
            id: k.id,
            name: k.name,
            prefix: k.key_prefix,
            createdAt: new Date(k.created_at).toLocaleDateString("th-TH"),
            lastUsed: k.last_used_at
              ? new Date(k.last_used_at).toLocaleDateString("th-TH")
              : "ยังไม่เคยใช้งาน",
            status: k.is_active ? "active" : "revoked",
          }))
        );
      }

      setIsLoadingUser(false);
    };

    fetchUserData();
  }, [router, supabase]);

  const handleSaveProfile = async () => {
    if (!currentUser || !profileNameInput.trim()) return;
    setIsSavingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileNameInput.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", currentUser.id);
      if (!error) {
        setUserProfile((prev: any) => ({ ...prev, full_name: profileNameInput.trim() }));
        setIsEditingProfile(false);
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  // สร้าง API Key ลง Supabase จริง
  const handleCreateKey = async () => {
    if (!newKeyName.trim() || !currentUser) return;
    setIsCreatingKey(true);

    try {
      const randomHex = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      const generatedFullKey = `ak_live_${randomHex}`;
      const prefix = `${generatedFullKey.substring(0, 12)}...`;

      // ยิง Insert ลงตาราง user_api_keys บน Supabase
      const { data, error } = await supabase
        .from("user_api_keys")
        .insert({
          user_id: currentUser.id,
          name: newKeyName.trim(),
          key_prefix: prefix,
          key_hash: generatedFullKey, // สำหรับ MVP เก็บตรงเพื่อแสดงผล ใน Production แนะนำ hash
          is_active: true,
        })
        .select()
        .single();

      if (!error && data) {
        const newItem: ApiKeyItem = {
          id: data.id,
          name: data.name,
          prefix: data.key_prefix,
          fullKey: generatedFullKey,
          createdAt: "วันนี้",
          lastUsed: "ยังไม่เคยใช้งาน",
          status: "active",
        };

        setApiKeys([newItem, ...apiKeys]);
        setJustCreatedKey(generatedFullKey);
        setNewKeyName("");
      } else {
        alert("ไม่สามารถสร้างคีย์ได้: " + (error?.message || "โปรดลองใหม่"));
      }
    } finally {
      setIsCreatingKey(false);
    }
  };

  // เพิกถอนสิทธิ์ Key บน Supabase จริง
  const handleRevokeKey = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการเพิกถอนสิทธิ์ API Key นี้? เครื่องมือหรือ MCP ที่ใช้คีย์นี้จะหยุดทำงานทันที")) {
      return;
    }

    const { error } = await supabase
      .from("user_api_keys")
      .update({ is_active: false })
      .eq("id", id);

    if (!error) {
      setApiKeys(apiKeys.map((k) => (k.id === id ? { ...k, status: "revoked" } : k)));
    } else {
      alert("เกิดข้อผิดพลาดในการระงับคีย์: " + error.message);
    }
  };

  const mcpServers: McpServerItem[] = [
    {
      id: "mcp-1",
      slug: "classroom-toolkit",
      name: "Classroom Toolkit MCP Server",
      description: "เชื่อมโยงฐานข้อมูลการเรียนการสอน, คลังความรู้ และสิทธิ์นักเรียนเข้ากับ Claude Desktop",
      version: "v1.2.0",
      status: "licensed",
      requiredTier: "premium",
    },
    {
      id: "mcp-2",
      slug: "seo-article-writer",
      name: "SEO Auto-Research & Schema MCP",
      description: "เอเจนต์ดึงข้อมูลเทรนด์ Google Search และสร้าง JSON-LD Schema อัตโนมัติ",
      version: "v1.0.4",
      status: "licensed",
      requiredTier: "standard",
    },
    {
      id: "mcp-3",
      slug: "n8n-bridge-agent",
      name: "n8n Workflow Execution Bridge",
      description: "สั่งรันและตรวจสอบการทำงานของ n8n workflows ผ่านข้อความแชทใน Cursor / Claude",
      version: "v2.0.1",
      status: "licensed",
      requiredTier: "premium",
    },
  ];

  const claudeConfigSnippet = `{
  "mcpServers": {
    "classroom-toolkit": {
      "command": "node",
      "args": ["D:\\\\LocalAi\\\\Classroom_Toolkit\\\\server.js"],
      "env": {
        "AIFULLFILL_API_KEY": "${justCreatedKey || (apiKeys[0]?.prefix ? "ak_live_your_active_key" : "ak_live_generate_first")}"
      }
    }
  }
}`;

  const handleCopyConfig = () => {
    navigator.clipboard?.writeText(claudeConfigSnippet);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-[70vh] bg-brand-slate text-slate-100 flex flex-col items-center justify-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 text-brand-emerald animate-spin" />
        <p className="text-xs text-slate-400 font-medium">กำลังโหลดข้อมูลสมาชิกจาก Supabase...</p>
      </div>
    );
  }

  // กำหนดป้ายสิทธิ์
  const userTierName = subscription ? subscription.tier.toUpperCase() : "STANDARD PREVIEW";
  const userIntervalName = subscription
    ? subscription.interval === "lifetime"
      ? "ตลอดชีพ (LIFETIME)"
      : subscription.interval === "yearly"
      ? "รายปี (YEARLY)"
      : "รายเดือน (MONTHLY)"
    : "ยังไม่สมัครบุฟเฟต์";

  const displayName = userProfile?.full_name || currentUser?.email?.split("@")[0] || "ผู้ใช้งาน";

  return (
    <div className="bg-brand-slate text-slate-100 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* =========================================================================
            1. TOP PROFILE & QUICK ENGAGEMENT CARDS (ต่อฐานข้อมูลจริง)
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* User Profile Card (4 Columns) */}
          <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm flex flex-col justify-between tactile-card">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-emerald to-teal-400 text-slate-950 font-extrabold text-2xl flex items-center justify-center shadow-md flex-shrink-0">
                {displayName[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-extrabold text-white truncate">
                    {displayName}
                  </h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${subscription?.tier === 'premium' ? 'bg-brand-orange text-white' : 'bg-brand-emerald text-slate-950'}`}>
                    {userTierName}
                  </span>
                </div>
                <div className="text-xs text-brand-emerald font-semibold flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" /> {userIntervalName}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-slate-400 truncate">{currentUser?.email}</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="text-[11px] font-bold text-brand-orange hover:underline"
                  >
                    แก้ไขชื่อ
                  </button>
                </div>
                {isEditingProfile && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={profileNameInput}
                      onChange={(e) => setProfileNameInput(e.target.value)}
                      className="px-2.5 py-1 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 w-full"
                      placeholder="ชื่อ-นามสกุล"
                    />
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="px-2.5 py-1 rounded-lg bg-brand-emerald text-slate-950 text-xs font-bold shrink-0"
                    >
                      บันทึก
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-6 mt-4 border-t border-slate-800 text-center">
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-lg font-bold text-white">{myCourses.length || 9}</div>
                <div className="text-[10px] text-slate-400">คอร์สเรียน</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-lg font-bold text-brand-emerald">{myAttachments.length || 9}</div>
                <div className="text-[10px] text-slate-400">ซอร์สโค้ด</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-lg font-bold text-brand-orange">{apiKeys.filter(k => k.status === 'active').length}</div>
                <div className="text-[10px] text-slate-400">API Keys</div>
              </div>
            </div>
          </div>

          {/* 3 Quick Action Banners (8 Columns) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
            
            {/* Card 1: LINE Connect */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-5 flex flex-col justify-between shadow-md shadow-emerald-700/10 hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
                  L
                </div>
                <h4 className="text-sm font-bold pt-2">เชื่อมต่อ LINE</h4>
                <p className="text-[11px] text-emerald-100 font-light">รับการแจ้งเตือนคอร์สใหม่ สิทธิพิเศษ และโค้ดอัปเดต</p>
              </div>
              <button className="mt-4 w-full py-1.5 px-3 rounded-xl bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-colors">
                เชื่อมต่อบัญชี
              </button>
            </div>

            {/* Card 2: LINE Community */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-5 flex flex-col justify-between shadow-md shadow-blue-700/10 hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold pt-2">เข้ากลุ่ม LINE นักเรียน</h4>
                <p className="text-[11px] text-blue-100 font-light">พูดคุย ปรึกษา ถามตอบกับผู้สอนและเพื่อนร่วมคลาส</p>
              </div>
              <a
                href="https://line.me"
                target="_blank"
                rel="noreferrer"
                className="mt-4 w-full py-1.5 px-3 rounded-xl bg-white text-blue-800 text-xs font-bold text-center hover:bg-blue-50 transition-colors block"
              >
                เข้ากลุ่มชุมชน ↗
              </a>
            </div>

            {/* Card 3: Affiliate / สร้างรายได้ */}
            <div className="bg-gradient-to-br from-rose-600 to-brand-orange text-white rounded-3xl p-5 flex flex-col justify-between shadow-md shadow-rose-700/10 hover:scale-[1.01] transition-transform">
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold pt-2">สร้างรายได้บอกต่อ</h4>
                <p className="text-[11px] text-rose-100 font-light">แนะนำเพื่อนสมัครบุฟเฟต์ รับค่าคอมมิชชั่น 25% ตลอดชีพ</p>
              </div>
              <Link
                href="/dashboard/affiliate"
                className="mt-4 w-full py-1.5 px-3 rounded-xl bg-white text-rose-800 text-xs font-bold text-center hover:bg-rose-50 transition-colors block"
              >
                รับลิงก์แนะนำ ↗
              </Link>
            </div>

          </div>

        </div>

        {/* =========================================================================
            2. DASHBOARD NAVIGATION TABS
        ========================================================================= */}
        <div className="bg-slate-900 rounded-2xl p-2 border border-slate-800 shadow-sm flex items-center gap-1 overflow-x-auto tactile-card">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4 text-brand-emerald" />
            <span>ภาพรวม & ประกาศอัปเดต</span>
          </button>

          <button
            onClick={() => setActiveTab("mcp-keys")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === "mcp-keys"
                ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <KeyRound className="w-4 h-4 text-amber-300" />
            <span>คีย์ AI Agent & สิทธิ์ MCP Server</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono">
              {apiKeys.filter((k) => k.status === "active").length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("my-courses")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === "my-courses"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <PlayCircle className="w-4 h-4 text-brand-emerald" />
            <span>คอร์สของฉัน</span>
          </button>

          <button
            onClick={() => setActiveTab("my-projects")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === "my-projects"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>คลังโค้ด & ดาวน์โหลด</span>
          </button>
        </div>


        {/* =========================================================================
            3. TAB CONTENT: MCP LICENSE & API KEY CONTROL (เชื่อม Supabase จริง)
        ========================================================================= */}
        {activeTab === "mcp-keys" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Banner อธิบายการใช้งาน */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-slate rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 tactile-card">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold border border-brand-orange/30">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Agentic AI Protection & MCP License</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  ระบบควบคุมสิทธิ์ Model Context Protocol (MCP)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  สร้าง API Key ประจำเครื่องของคุณ เพื่อนำไปใส่ใน <strong>Claude Desktop</strong> หรือ <strong>Cursor</strong> สำหรับเชื่อมต่อ Classroom Toolkit 
                  โดยสิทธิ์ถูกบันทึกลงฐานข้อมูล Supabase โดยตรง
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-brand-orange to-amber-500 hover:from-brand-orange-hover hover:to-amber-600 transition-all flex items-center gap-2 shadow-lg shadow-brand-orange/30 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ สร้าง API Key ใหม่</span>
              </button>
            </div>

            {/* Quick 1-Click Setup for Claude Desktop / Cursor */}
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-sm space-y-4 tactile-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h4 className="font-bold text-base text-white flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-brand-emerald" />
                    <span>ตัวอย่างการตั้งค่า Claude Desktop (`claude_desktop_config.json`)</span>
                  </h4>
                  <p className="text-xs text-slate-400">คัดลอกโค้ดนี้ไปวางในไฟล์ Config ของโปรแกรม Claude เพื่อเริ่มใช้งาน Classroom Toolkit</p>
                </div>
                <button
                  onClick={handleCopyConfig}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  {copiedConfig ? <Check className="w-3.5 h-3.5 text-brand-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedConfig ? "คัดลอก Config สำเร็จ!" : "1-Click Copy Config"}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto relative">
                <pre>{claudeConfigSnippet}</pre>
              </div>
            </div>

            {/* ตาราง API Keys ของสมาชิก (ดึงจาก Supabase) */}
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-sm space-y-5 tactile-card">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-brand-orange" />
                    <span>รายการ API Keys ประจำอุปกรณ์ของคุณ ({apiKeys.length} คีย์)</span>
                  </h4>
                  <p className="text-xs text-slate-400">ข้อมูลเชื่อมต่อตรงกับตาราง user_api_keys บน Supabase</p>
                </div>
              </div>

              {apiKeys.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                  <KeyRound className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">คุณยังไม่มี API Key สำหรับ AI Agent</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover"
                  >
                    + สร้าง API Key แรกของคุณ
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                        <th className="pb-3">ชื่อคีย์ / อุปกรณ์</th>
                        <th className="pb-3">Token Prefix</th>
                        <th className="pb-3">สร้างเมื่อ</th>
                        <th className="pb-3">ใช้งานล่าสุด</th>
                        <th className="pb-3">สถานะ</th>
                        <th className="pb-3 text-right">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {apiKeys.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 font-bold text-white flex items-center gap-2">
                            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{item.name}</span>
                          </td>
                          <td className="py-4 font-mono text-slate-300">{item.prefix}</td>
                          <td className="py-4 text-slate-400">{item.createdAt}</td>
                          <td className="py-4 text-slate-400">{item.lastUsed}</td>
                          <td className="py-4">
                            {item.status === "active" ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
                                Active
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                                Revoked (ระงับ)
                              </span>
                            )}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {item.fullKey && (
                                <button
                                  onClick={() => handleCopy(item.id, item.fullKey!)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                  title="คัดลอกคีย์เต็ม"
                                >
                                  {copiedKeyId === item.id ? <Check className="w-3.5 h-3.5 text-brand-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              )}
                              {item.status === "active" && (
                                <button
                                  onClick={() => handleRevokeKey(item.id)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                                  title="เพิกถอนสิทธิ์"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ตาราง MCP Tools & Servers ที่เชื่อมต่อ */}
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-sm space-y-4 tactile-card">
              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-teal-400" />
                <span>MCP Servers ที่ได้รับอนุญาตให้เข้าถึง (Licensed MCP Tools)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {mcpServers.map((mcp) => (
                  <div
                    key={mcp.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-brand-emerald/40 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{mcp.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {mcp.version}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{mcp.description}</p>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30 flex-shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> สิทธิ์ใช้งาน
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            4. TAB CONTENT: OVERVIEW
        ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link href="/courses" className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm hover:shadow hover:border-brand-emerald transition-all text-center group tactile-card">
                <div className="w-10 h-10 rounded-xl bg-brand-emerald/15 text-brand-emerald flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-white">คอร์สของฉัน</div>
                <div className="text-[10px] text-slate-400 mt-0.5">เข้าเรียนต่อ</div>
              </Link>

              <Link href="/projects" className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm hover:shadow hover:border-brand-emerald transition-all text-center group tactile-card">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Code2 className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-white">ซอร์สโค้ด</div>
                <div className="text-[10px] text-slate-400 mt-0.5">ดาวน์โหลดโค้ด</div>
              </Link>

              <button onClick={() => setActiveTab("mcp-keys")} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm hover:shadow hover:border-brand-emerald transition-all text-center group tactile-card">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-white">MCP License</div>
                <div className="text-[10px] text-slate-400 mt-0.5">จัดการ API Key</div>
              </button>

              <Link href="/tools" className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm hover:shadow hover:border-brand-emerald transition-all text-center group tactile-card">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Wrench className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-white">เครื่องมือ AI</div>
                <div className="text-[10px] text-slate-400 mt-0.5">AI Gems & Apps</div>
              </Link>
            </div>

            {/* Bottom Row: Onboarding Video Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-brand-slate text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs text-brand-emerald font-bold uppercase tracking-wider">
                  <PlayCircle className="w-4 h-4" />
                  <span>มาใหม่? พาทัวร์ระบบบุฟเฟต์</span>
                </div>
                <h3 className="text-xl font-bold">วิดีโอแนะนำวิธีใช้ระบบบุฟเฟต์ คลังโค้ด และการเชื่อม MCP</h3>
                <p className="text-xs text-slate-300 font-light">เริ่มต้นใช้งานระบบ เชื่อมต่อคีย์ และเริ่มเรียนรู้อย่างคุ้มค่าที่สุดใน 5 นาที</p>
              </div>

              <Link
                href="/courses/course-101-ai-ebook-masterclass"
                className="px-6 py-3 rounded-2xl text-xs font-bold text-slate-950 bg-brand-emerald hover:bg-brand-emerald-dark transition-colors flex items-center gap-2 flex-shrink-0 shadow-lg shadow-brand-emerald/20"
              >
                <PlayCircle className="w-4 h-4" />
                <span>เริ่มเรียนคอร์สแรก</span>
              </Link>
            </div>

            {/* สถานะการแจ้งโอนเงินและตรวจสลิป (ถ้ามี) */}
            {paymentOrders.length > 0 && (
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4 tactile-card">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-emerald" />
                    <span>ประวัติการแจ้งชำระเงิน & สถานะการตรวจสลิป</span>
                  </h4>
                  <Link href="/pricing" className="text-xs font-bold text-brand-orange hover:underline">
                    + อัปเกรด / ต่ออายุแพ็กเกจ
                  </Link>
                </div>

                <div className="divide-y divide-slate-800 text-xs">
                  {paymentOrders.map((po) => (
                    <div key={po.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-white">{po.order_no}</span>
                        <span className="mx-2 text-slate-600">•</span>
                        <span className="font-bold text-slate-300">{po.plan_name}</span>
                        <span className="ml-2 text-slate-400">(฿{Number(po.transfer_amount).toLocaleString()})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {po.status === "pre_approved" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            ⚡ อนุมัติเบื้องต้นแล้ว (เข้าเรียนได้ทันที • รอแอดมินตรวจซ้ำ)
                          </span>
                        )}
                        {po.status === "pending_review" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                            ⏳ รอแอดมินตรวจสอบสลิป
                          </span>
                        )}
                        {po.status === "approved" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
                            ✓ อนุมัติสมบูรณ์
                          </span>
                        )}
                        {po.status === "rejected" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            ✕ สลิปไม่ผ่านการตรวจสอบ
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            5. TAB CONTENT: MY COURSES (คอร์สของฉัน & ความก้าวหน้าจริง)
        ========================================================================= */}
        {activeTab === "my-courses" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-white">คอร์สเรียนและความก้าวหน้าของคุณ</h3>
                <p className="text-xs text-slate-400">คลิกที่คอร์สเพื่อเข้าสู่ห้องเรียนและเรียนต่อจากตอนล่าสุดได้ทันที</p>
              </div>
              <Link
                href="/courses"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 self-start sm:self-auto"
              >
                ดูคลังคอร์สทั้งหมด →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myCourses.map((course) => {
                const isPremiumCourse = course.required_tier === "premium";
                const canAccess = subscription
                  ? subscription.tier === "premium" || (subscription.tier === "standard" && !isPremiumCourse)
                  : false;

                return (
                  <div
                    key={course.id}
                    className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm hover:border-brand-emerald/40 transition-all flex flex-col justify-between space-y-4 tactile-card"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isPremiumCourse
                              ? "bg-brand-orange/15 text-brand-orange border border-brand-orange/30"
                              : "bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30"
                          }`}
                        >
                          {isPremiumCourse ? "PREMIUM" : "STANDARD"}
                        </span>
                        <span className="text-xs font-bold text-brand-emerald">
                          เรียนแล้ว {course.progressPercent}%
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-white line-clamp-2">{course.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-emerald transition-all"
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">
                          จบแล้ว {course.doneEps}/{course.totalEps} บทเรียน
                        </span>
                        <div className="flex items-center gap-1.5">
                          {course.certificateCode && (
                            <Link
                              href={`/certificates/${course.certificateCode}`}
                              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-colors"
                            >
                              🏅 ดูใบเซอร์
                            </Link>
                          )}
                          <Link
                            href={`/courses/${course.slug}`}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                              canAccess
                                ? "bg-brand-emerald text-slate-950 hover:bg-emerald-400"
                                : "bg-slate-800 text-slate-200 hover:bg-brand-orange hover:text-white"
                            }`}
                          >
                            {canAccess ? "เข้าเรียนต่อ →" : "ดูตัวอย่างฟรี →"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            6. TAB CONTENT: MY PROJECTS (คลังโค้ด & ดาวน์โหลด)
        ========================================================================= */}
        {activeTab === "my-projects" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-white">คลังซอร์สโค้ด & ไฟล์ประกอบบทเรียน</h3>
                <p className="text-xs text-slate-400">ดาวน์โหลดซอร์สโค้ดโปรเจกต์และไฟล์แนบทั้งหมดตามสิทธิ์แพ็กเกจของคุณ</p>
              </div>
              <Link
                href="/projects"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 self-start sm:self-auto"
              >
                ไปที่คลังโปรเจกต์ทั้งหมด →
              </Link>
            </div>

            {myAttachments.length === 0 ? (
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 text-center space-y-3 tactile-card">
                <Code2 className="w-10 h-10 text-indigo-400 mx-auto" />
                <h4 className="font-bold text-sm text-white">สำรวจคลังซอร์สโค้ดพร้อมรัน 9+ โปรเจกต์หลัก</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  คุณสามารถเลือกดาวน์โหลดซอร์สโค้ดระบบบอท LINE, Chrome Extension, Web App และ MCP Server ได้ที่หน้าคลังโค้ด
                </p>
                <Link
                  href="/projects"
                  className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-orange text-white hover:bg-brand-orange-hover"
                >
                  เปิดดูคลังซอร์สโค้ดทั้งหมด →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myAttachments.map((att: any) => (
                  <div
                    key={att.id}
                    className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex items-center justify-between gap-4 tactile-card"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{att.title}</div>
                      <div className="text-[11px] text-slate-400">
                        {att.courses?.title || "ไฟล์ประกอบคอร์ส"} • {(att.file_type || "ZIP").toUpperCase()}
                      </div>
                    </div>
                    <a
                      href={att.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-emerald text-slate-950 hover:bg-emerald-400 shrink-0"
                    >
                      ดาวน์โหลด
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal สำหรับสร้าง API Key ใหม่ */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative tactile-card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">สร้าง API Key ประจำเครื่องใหม่</h3>
                  <p className="text-xs text-slate-400 mt-1">บันทึกสิทธิ์ลงตาราง user_api_keys บน Supabase</p>
                </div>
                <button onClick={() => { setShowCreateModal(false); setJustCreatedKey(null); }} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {justCreatedKey ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 space-y-2">
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
                      <span>สร้างและบันทึกลง Supabase สำเร็จแล้ว!</span>
                    </div>
                    <p className="text-[11px] text-slate-300">กรุณาคัดลอกคีย์นี้ไปใส่ใน Claude Desktop Config หรือ .env ของคุณ</p>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-brand-orange font-mono text-xs break-all select-all">
                      {justCreatedKey}
                    </div>
                  </div>
                  <button
                    onClick={() => { setShowCreateModal(false); setJustCreatedKey(null); }}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">ชื่ออุปกรณ์ / จุดประสงค์</label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="เช่น Claude Desktop บน MacBook, Cursor PC..."
                      className="w-full px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleCreateKey}
                      disabled={!newKeyName.trim() || isCreatingKey}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-40 transition-colors shadow"
                    >
                      {isCreatingKey ? "กำลังบันทึก..." : "สร้างคีย์ทันที"}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Laptop,
  ShieldCheck,
  RefreshCw,
  Search,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sliders,
  Cpu,
  Clock,
  KeyRound,
} from "lucide-react";

export default function AdminLicensesPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const fetchLicenses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "ไม่สามารถดึงข้อมูลคีย์และอุปกรณ์ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleReset = async (user: any) => {
    if (!user.apiKey) return;
    if (!confirm(`ยืนยันการล้างรายการอุปกรณ์ของ ${user.email}? คอมพิวเตอร์ที่เคยผูกไว้จะหลุดทั้งหมดและสามารถผูกเครื่องใหม่ได้ทันที`)) return;

    try {
      const res = await fetch("/api/admin/users/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyId: user.apiKey.id,
          action: "reset",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showAlert("success", data.message);
        fetchLicenses();
      } else {
        showAlert("error", data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      showAlert("error", "ไม่สามารถรีเซ็ตอุปกรณ์ได้");
    }
  };

  const filtered = users.filter((u) => {
    if (!u.apiKey) return false;
    const q = search.toLowerCase();
    const matchEmail = u.email.toLowerCase().includes(q);
    const matchName = u.full_name.toLowerCase().includes(q);
    const matchDevice = (u.apiKey.devices || []).some((d: any) =>
      d.name?.toLowerCase().includes(q) || d.id?.toLowerCase().includes(q)
    );
    return matchEmail || matchName || matchDevice;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30">
              License & Device Lock Monitor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ควบคุมสิทธิ์โปรแกรม & อุปกรณ์คอมพิวเตอร์
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            ตรวจสอบรายการเครื่องที่เชื่อมต่อกับ Studio (Cine Movie, MV, Portrait) และ MCP Tools พร้อมปุ่มรีเซ็ตด่วน
          </p>
        </div>

        <button
          onClick={fetchLicenses}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-brand-emerald" : ""}`} />
          <span>รีเฟรชข้อมูล</span>
        </button>
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
          placeholder="ค้นหาด้วยอีเมล, ชื่อสมาชิก หรือชื่อคอมพิวเตอร์ (Device Name)..."
          className="w-full text-xs bg-transparent border-none text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Licenses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-xs text-slate-500">
            {loading ? "กำลังค้นหาข้อมูลอุปกรณ์..." : "ไม่พบคีย์หรืออุปกรณ์ที่ตรงตามเงื่อนไข"}
          </div>
        ) : (
          filtered.map((u) => {
            const key = u.apiKey;
            const devices = key.devices || [];
            const isFull = devices.length >= key.max_devices;

            return (
              <div
                key={u.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-brand-emerald/15 text-brand-emerald flex items-center justify-center font-bold text-xs shrink-0">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-sm truncate">{u.full_name}</h3>
                        <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isFull
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30"
                        }`}
                      >
                        <Laptop className="w-3 h-3" />
                        {devices.length} / {key.max_devices} เครื่อง {isFull ? "(เต็ม)" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Key Info */}
                  <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Key Prefix: <strong className="text-white">{key.prefix}••••••••</strong></span>
                    <span className="text-[10px] text-slate-500">
                      {key.last_used_at
                        ? `ใช้งานล่าสุด: ${new Date(key.last_used_at).toLocaleDateString("th-TH")}`
                        : "ยังไม่เคยเรียกใช้งาน"}
                    </span>
                  </div>

                  {/* Devices List */}
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-brand-orange" />
                      <span>รายการเครื่องที่ผูกไว้จริง ({devices.length})</span>
                    </h4>

                    {devices.length === 0 ? (
                      <p className="text-xs text-slate-500 italic bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
                        ยังไม่มีอุปกรณ์ผูกกับคีย์นี้ (พร้อมให้เปิดใช้งานจากเครื่องใหม่ได้ทันที)
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {devices.map((d: any, i: number) => (
                          <div
                            key={d.id || i}
                            className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <Laptop className="w-4 h-4 text-brand-emerald shrink-0" />
                              <div className="flex flex-col">
                                <span className="font-bold text-white text-[11px]">
                                  {d.name || "Unnamed Computer"}
                                </span>
                                <span className="text-[9px] text-slate-500 font-mono">
                                  ID: {d.id?.substring(0, 16)}...
                                </span>
                              </div>
                            </div>

                            <div className="text-right text-[10px] text-slate-400">
                              <div>{d.last_active ? new Date(d.last_active).toLocaleDateString("th-TH") : "Active"}</div>
                              <span className="text-[9px] text-brand-emerald">ผูกแล้ว</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    href={`/admin/users?search=${encodeURIComponent(u.email)}`}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>ปรับโควตาเครื่อง</span>
                  </Link>

                  <button
                    onClick={() => handleReset(u)}
                    disabled={devices.length === 0}
                    className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>ล้างอุปกรณ์ทั้งหมด</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

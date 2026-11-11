import React from "react";
import { ShieldCheck, Cpu, Code2, Database, Terminal, Zap, Bot, Layers } from "lucide-react";

export function TrustMarquee() {
  const techLogos = [
    { name: "Google Antigravity", icon: Bot, tag: "Desktop Agent" },
    { name: "Claude 3.7 Sonnet", icon: Cpu, tag: "Anthropic API" },
    { name: "DeepSeek V3 / R1", icon: Zap, tag: "Local Reasoning" },
    { name: "Supabase & Postgres", icon: Database, tag: "Auth & DB (Free Tier)" },
    { name: "ComfyUI Local", icon: Layers, tag: "Image/Video Gen" },
    { name: "Ollama Offline", icon: Terminal, tag: "100% Free Local AI" },
    { name: "Next.js 15 App Router", icon: Code2, tag: "Production Web" },
  ];

  return (
    <div className="border-y border-slate-800/80 bg-slate-950/60 py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Guarantee Pill */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
            <span className="font-semibold text-slate-300 uppercase tracking-wider">
              เทคโนโลยี AI ที่เราสอนและผสานระบบจริง
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 text-brand-emerald">
              <ShieldCheck className="w-3.5 h-3.5" /> ซอร์สโค้ดผ่านการทดสอบรันได้ 100%
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-slate-300">
              คุ้มครองสิทธิ์ด้วย MCP Protocol
            </span>
          </div>
        </div>

        {/* Tech Badges Row */}
        <div className="pt-5 flex flex-wrap items-center justify-center lg:justify-between gap-4 sm:gap-6">
          {techLogos.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div 
                key={idx}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <Icon className="w-4 h-4 text-brand-emerald" />
                <span className="text-xs font-semibold text-slate-200">{tech.name}</span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                  {tech.tag}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

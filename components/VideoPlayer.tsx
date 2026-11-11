"use client";

import React, { useState } from "react";
import { parseVideoUrl } from "@/utils/video-helper";
import { AlertCircle, Play, Video } from "lucide-react";

interface VideoPlayerProps {
  url: string | null | undefined;
  title?: string;
  className?: string;
  autoPlay?: boolean;
}

export function VideoPlayer({ url, title = "Course Video", className = "", autoPlay = false }: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false);
  const videoInfo = parseVideoUrl(url);

  if (!url || !videoInfo.isValid) {
    return (
      <div className={`w-full aspect-video bg-slate-950 flex flex-col items-center justify-center text-slate-500 border border-slate-800 rounded-xl p-6 ${className}`}>
        <Video className="w-12 h-12 mb-2 text-slate-600 stroke-[1.5]" />
        <p className="text-sm font-medium text-slate-400">ยังไม่มีการระบุวิดีโอสำหรับตอนนี้</p>
        <span className="text-xs text-slate-600 mt-1">รองรับลิงก์ YouTube และ Bunny.net Stream</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`w-full aspect-video bg-slate-950 flex flex-col items-center justify-center text-rose-400 border border-rose-900/40 rounded-xl p-6 ${className}`}>
        <AlertCircle className="w-10 h-10 mb-2 text-rose-500" />
        <p className="text-sm font-semibold">ไม่สามารถโหลดวิดีโอนี้ได้</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm text-center">
          กรุณาตรวจสอบว่าลิงก์ YouTube เป็น Unlisted/Public หรือสิทธิ์การเข้าถึงของ Bunny.net ถูกต้อง
        </p>
      </div>
    );
  }

  // 1. Direct HTML5 Video
  if (videoInfo.provider === "direct") {
    return (
      <div className={`relative w-full aspect-video bg-black overflow-hidden rounded-xl ${className}`}>
        <video
          src={videoInfo.embedUrl}
          controls
          autoPlay={autoPlay}
          className="w-full h-full object-contain"
          onError={() => setHasError(true)}
        >
          เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ HTML5
        </video>
      </div>
    );
  }

  // 2. Bunny.net Stream or YouTube Iframe
  const srcWithAutoplay = autoPlay && !videoInfo.embedUrl.includes("autoplay")
    ? `${videoInfo.embedUrl}${videoInfo.embedUrl.includes("?") ? "&" : "?"}autoplay=1`
    : videoInfo.embedUrl;

  return (
    <div className={`relative w-full aspect-video bg-black overflow-hidden rounded-xl ${className}`}>
      <iframe
        src={srcWithAutoplay}
        title={title}
        className="w-full h-full border-0 absolute inset-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onError={() => setHasError(true)}
      />
    </div>
  );
}

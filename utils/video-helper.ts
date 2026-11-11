/**
 * Video Helper Utility for aifullfill.com
 * Supports YouTube (Standard, Short, Embed) and Bunny.net Stream (iframe/embed)
 */

export interface VideoInfo {
  embedUrl: string;
  provider: "youtube" | "bunny" | "direct" | "unknown";
  isValid: boolean;
  rawUrl: string;
}

export function parseVideoUrl(url: string | null | undefined): VideoInfo {
  if (!url || typeof url !== "string") {
    return { embedUrl: "", provider: "unknown", isValid: false, rawUrl: "" };
  }

  const trimmed = url.trim();

  // 1. YouTube Detection
  // Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytWatchMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytWatchMatch && ytWatchMatch[1]) {
    const videoId = ytWatchMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
      provider: "youtube",
      isValid: true,
      rawUrl: trimmed,
    };
  }

  // 2. Bunny.net Stream Detection
  // Matches: iframe.mediadelivery.net/embed/LIBRARY_ID/VIDEO_ID or direct mediadelivery URLs
  const bunnyMatch = trimmed.match(/iframe\.mediadelivery\.net\/embed\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/);
  if (bunnyMatch) {
    return {
      embedUrl: trimmed,
      provider: "bunny",
      isValid: true,
      rawUrl: trimmed,
    };
  }

  // Handle bunny video ID or alternate bunny stream URL: https://video.bunnycdn.com/play/LIBRARY_ID/VIDEO_ID
  const bunnyAltMatch = trimmed.match(/mediadelivery\.net\/play\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/);
  if (bunnyAltMatch) {
    return {
      embedUrl: `https://iframe.mediadelivery.net/embed/${bunnyAltMatch[1]}/${bunnyAltMatch[2]}`,
      provider: "bunny",
      isValid: true,
      rawUrl: trimmed,
    };
  }

  // 3. Direct HTML5 Video (.mp4, .webm)
  if (/\.(mp4|webm|ogg)($|\?)/i.test(trimmed)) {
    return {
      embedUrl: trimmed,
      provider: "direct",
      isValid: true,
      rawUrl: trimmed,
    };
  }

  // Fallback / Custom iframe embed
  return {
    embedUrl: trimmed,
    provider: trimmed.includes("bunny") ? "bunny" : "unknown",
    isValid: trimmed.length > 5,
    rawUrl: trimmed,
  };
}

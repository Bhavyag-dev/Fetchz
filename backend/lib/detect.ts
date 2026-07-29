import type { Platform } from "@/types/media";

const PATTERNS: { platform: Platform; re: RegExp }[] = [
  { platform: "x", re: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/i },
  { platform: "instagram", re: /^https?:\/\/(www\.)?instagram\.com\/(p|reel|reels|tv)\/[\w-]+/i },
  { platform: "threads", re: /^https?:\/\/(www\.)?threads\.(net|com)\/@?[\w.\-_]+\/post\/[\w-]+/i },
  { platform: "pinterest", re: /^https?:\/\/(www\.)?(pinterest\.(com|ca|co\.uk|fr|de|jp)|pin\.it)\//i },
];

export function detectPlatform(url: string): Platform {
  const trimmed = url.trim();
  if (!trimmed) return "unknown";
  for (const { platform, re } of PATTERNS) {
    if (re.test(trimmed)) return platform;
  }
  return "unknown";
}

export function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export const PLATFORM_LABEL: Record<Platform, string> = {
  x: "X",
  instagram: "Instagram",
  threads: "Threads",
  pinterest: "Pinterest",
  unknown: "Link",
};

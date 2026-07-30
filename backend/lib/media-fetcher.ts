import type { MediaInfo, Platform } from "@/types/media";
import { detectPlatform } from "@/lib/detect";
import { fetchMediaInfo as cobaltFetch, CobaltError, getDownloadUrl as cobaltDownload } from "@/lib/cobalt";
import { fetchMediaInfo as ytdlpFetch, YtDlpError } from "@/lib/ytdlp";
import { fetchMediaInfo as threadsFetch, ThreadsError, getDownloadUrl as threadsDownload } from "@/lib/threads";

const YOUTUBE_CACHE_TTL_MS = 5 * 60_000;
const youtubeInfoCache = new Map<string, { value: MediaInfo; expiresAt: number }>();
const youtubeInfoInflight = new Map<string, Promise<MediaInfo>>();

/**
 * Hybrid media fetcher that tries the best provider for each platform
 */
export async function fetchMediaInfo(url: string): Promise<MediaInfo> {
  const platform: Platform = detectPlatform(url);
  
  if (platform === "unknown") {
    throw new Error("That URL doesn't look like a supported post.");
  }

  console.log(`Fetching media info for ${platform} URL: ${url}`);

  // Use native Threads provider
  if (platform === "threads") {
    console.log(`Using native Threads provider...`);
    try {
      const result = await threadsFetch(url);
      console.log(`Native Threads provider succeeded`);
      return result;
    } catch (error) {
      console.log(`Native Threads provider failed:`, error instanceof Error ? error.message : error);
      throw error;
    }
  }

  // YouTube's signed, short-lived media URLs are best handled directly by
  // yt-dlp. This also keeps the format IDs returned here compatible with the
  // download endpoint.
  if (platform === "youtube") {
    const cached = youtubeInfoCache.get(url);
    if (cached && cached.expiresAt > Date.now()) return cached.value;

    const inflight = youtubeInfoInflight.get(url);
    if (inflight) return inflight;

    const request = ytdlpFetch(url)
      .then((info) => {
        youtubeInfoCache.set(url, { value: info, expiresAt: Date.now() + YOUTUBE_CACHE_TTL_MS });
        return info;
      })
      .finally(() => youtubeInfoInflight.delete(url));
    youtubeInfoInflight.set(url, request);
    return request;
  }

  // For other platforms, try Cobalt API first, then yt-dlp fallback
  try {
    console.log(`Attempting Cobalt API for ${platform}...`);
    const result = await cobaltFetch(url);
    console.log(`Cobalt API succeeded for ${platform}`);
    return result;
  } catch (error) {
    console.log(`Cobalt API failed for ${platform}:`, error instanceof Error ? error.message : error);
    
    if (error instanceof CobaltError) {
      // For certain errors, don't try fallback
      if (error.code === "auth_required" || error.code === "unavailable") {
        throw error;
      }
    }

    // Fall back to yt-dlp
    console.log(`Attempting yt-dlp fallback for ${platform}...`);
    try {
      const result = await ytdlpFetch(url);
      console.log(`yt-dlp fallback succeeded for ${platform}`);
      return result;
    } catch (ytdlpError) {
      console.log(`yt-dlp fallback failed for ${platform}:`, ytdlpError instanceof Error ? ytdlpError.message : ytdlpError);
      
      // If both fail, prefer the yt-dlp error as it's usually more descriptive
      if (ytdlpError instanceof YtDlpError) {
        throw ytdlpError;
      }
      
      // Otherwise, throw the original Cobalt error
      throw error;
    }
  }
}

/**
 * Hybrid download function that uses the appropriate provider
 */
export async function getDownloadUrl(url: string, formatId: string): Promise<{ downloadUrl: string; filename: string }> {
  const platform: Platform = detectPlatform(url);
  
  console.log(`Getting download URL for ${platform} with format ${formatId}`);

  // Use native Threads provider
  if (platform === "threads") {
    console.log(`Using native Threads download...`);
    return await threadsDownload(url, formatId);
  }

  // YouTube downloads are streamed by the route using yt-dlp. Returning a
  // normal URL here would send yt-dlp format IDs to Cobalt, which cannot use
  // them.
  if (platform === "youtube") {
    throw new YtDlpError("stream_required", "This download must be streamed with yt-dlp.");
  }

  // Try Cobalt for other platforms
  try {
    console.log(`Attempting Cobalt download for ${platform}...`);
    const result = await cobaltDownload(url, formatId);
    console.log(`Cobalt download succeeded for ${platform}`);
    return result;
  } catch (error) {
    console.log(`Cobalt download failed for ${platform}:`, error instanceof Error ? error.message : error);
    
    if (error instanceof CobaltError) {
      // For certain errors, don't try fallback
      if (error.code === "auth_required" || error.code === "unavailable") {
        throw error;
      }
    }

    // For now, just re-throw the original error
    // yt-dlp download would require streaming which is more complex
    throw error;
  }
}

export { CobaltError, YtDlpError, ThreadsError };

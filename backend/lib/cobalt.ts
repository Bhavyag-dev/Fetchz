import type { MediaInfo, MediaFormat, Platform } from "@/types/media";
import { detectPlatform } from "@/lib/detect";

const COBALT_API = (process.env.COBALT_API_URL?.trim() || "https://dwnld.nichind.dev").replace(/\/+$/, "");

interface CobaltRequest {
  url: string;
  videoQuality?: string;
  downloadMode?: "auto" | "audio" | "mute";
  audioFormat?: string;
  audioBitrate?: string;
  filenameStyle?: string;
}

interface CobaltTunnelResponse {
  status: "tunnel" | "redirect";
  url: string;
  filename: string;
}

interface CobaltPickerItem {
  type: "photo" | "video" | "gif";
  url: string;
  thumb?: string;
}

interface CobaltPickerResponse {
  status: "picker";
  picker: CobaltPickerItem[];
  audio?: string;
  audioFilename?: string;
}

interface CobaltErrorResponse {
  status: "error";
  error: { code: string; context?: { service?: string; limit?: number } };
}

type CobaltResponse = CobaltTunnelResponse | CobaltPickerResponse | CobaltErrorResponse;

export class CobaltError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "CobaltError";
  }
}

async function cobaltFetch(body: CobaltRequest): Promise<CobaltResponse> {
  const res = await fetch(`${COBALT_API}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "Fetchz/1.0",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    throw new CobaltError("api_error", `Cobalt API returned ${res.status}`);
  }

  return res.json() as Promise<CobaltResponse>;
}

const QUALITY_LABELS: Record<string, string> = {
  "2160": "4K · MP4",
  "1440": "1440p · MP4", 
  "1080": "1080p · MP4",
  "720":  "720p · MP4",
  "480":  "480p · MP4",
  "360":  "360p · MP4",
  "240":  "240p · MP4",
  "144":  "144p · MP4",
};

const VIDEO_QUALITIES = ["2160", "1440", "1080", "720", "480", "360", "240", "144"];
const AUDIO_BITRATES  = ["320", "256", "128", "96", "64"];

export async function fetchMediaInfo(url: string): Promise<MediaInfo> {
  const platform: Platform = detectPlatform(url);

  let previewProbe: CobaltResponse;
  
  try {
    // First, try to get the best quality video for preview (360p is faster to retrieve)
    previewProbe = await cobaltFetch({
      url,
      videoQuality: "360", 
      downloadMode: "auto",
      filenameStyle: "pretty",
    });

    if (previewProbe.status === "error") {
      const errorResponse = previewProbe as CobaltErrorResponse;
      const code = errorResponse.error.code;
      
      // Log the error for debugging
      console.error(`Cobalt API error for ${platform} URL: ${code}`, errorResponse.error);
      
      if (code.includes("content.unavailable") || code.includes("fetch.empty")) {
        throw new CobaltError("unavailable", "This post is private or unavailable.");
      }
      if (code.includes("content.age")) {
        throw new CobaltError("auth_required", "Age-restricted content cannot be downloaded.");
      }
      if (code.includes("content.no_valid_content")) {
        // This often happens with Threads - throw a specific error to trigger fallback
        throw new CobaltError("no_valid_content", `No valid content found for ${platform} URL`);
      }
      throw new CobaltError("cobalt_error", `Could not fetch media: ${code}`);
    }
  } catch (error) {
    // If it's already a CobaltError, re-throw it
    if (error instanceof CobaltError) {
      throw error;
    }
    // For network/timeout errors, throw a specific error to allow fallback
    console.error(`Network error when fetching from Cobalt API for ${platform}:`, error);
    throw new CobaltError("network_error", `Failed to connect to Cobalt API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Handle picker responses (multiple items)
  if (previewProbe.status === "picker") {
    const p = previewProbe as CobaltPickerResponse;
    const firstItem = p.picker[0];
    return {
      platform,
      url,
      title: "Media",
      isImage: firstItem?.type === "photo",
      thumbnail: firstItem?.thumb || firstItem?.url,
      imageUrl: firstItem?.type === "photo" ? firstItem?.url : undefined,
      videoUrl: firstItem?.type !== "photo" ? firstItem?.url : undefined,
      formats: [],
    };
  }

  // Handle single video/audio
  const tunnelResponse = previewProbe as CobaltTunnelResponse;
  const videoUrl = tunnelResponse.url;

  // Build quality options
  const videoFormats: MediaFormat[] = [];
  const audioFormats: MediaFormat[] = [];

  for (const q of VIDEO_QUALITIES) {
    videoFormats.push({
      id: `video-${q}`,
      label: QUALITY_LABELS[q] ?? `${q}p · MP4`,
      ext: "mp4",
      sizeBytes: 0,
      isVideo: true,
      isAudio: false,
      height: parseInt(q),
    });
  }

  for (const bitrate of AUDIO_BITRATES) {
    audioFormats.push({
      id: `audio-${bitrate}`,
      label: `MP3 · ${bitrate}kbps`,
      ext: "mp3",
      sizeBytes: 0,
      isVideo: false,
      isAudio: true,
      abr: parseInt(bitrate),
    });
  }

  // Extract title from filename 
  const filename = tunnelResponse.filename ?? "";
  const title = filename
    .replace(/\.[a-z0-9]{2,4}$/i, "")
    .replace(/[-_]/g, " ")
    .trim() || "Video";

  return {
    platform,
    url,
    title,
    isImage: false,
    videoUrl, // Store the actual video URL for preview
    formats: [...videoFormats, ...audioFormats],
  };
}

export async function getDownloadUrl(
  url: string,
  formatId: string
): Promise<{ downloadUrl: string; filename: string }> {
  const isAudio = formatId.startsWith("audio-");
  const quality = formatId.split("-")[1] ?? "1080";

  const body: CobaltRequest = {
    url,
    filenameStyle: "pretty",
    ...(isAudio
      ? { downloadMode: "audio", audioFormat: "mp3", audioBitrate: quality }
      : { downloadMode: "auto", videoQuality: quality }),
  };

  const result = await cobaltFetch(body);

  if (result.status === "error") {
    const code = (result as CobaltErrorResponse).error.code;
    throw new CobaltError("download_failed", `Download failed: ${code}`);
  }

  if (result.status === "picker") {
    const p = result as CobaltPickerResponse;
    const item = p.picker[0];
    if (!item) throw new CobaltError("no_media", "No media found in this post.");
    return { downloadUrl: item.url, filename: "fetchz-media.jpg" };
  }

  const r = result as CobaltTunnelResponse;
  return { downloadUrl: r.url, filename: r.filename };
}
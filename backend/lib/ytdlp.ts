import { spawn, execFile } from "node:child_process";
import { detectPlatform } from "@/lib/detect";
import { slugify } from "@/lib/format";
import type { MediaInfo, MediaFormat, Platform } from "@/types/media";

const YTDLP_BIN = process.env.YTDLP_PATH?.trim() || "yt-dlp";
const FFMPEG_LOCATION = process.env.FFMPEG_PATH?.trim() || undefined;

interface YtDlpFormat {
  format_id: string;
  ext: string;
  height?: number | null;
  width?: number | null;
  fps?: number | null;
  vcodec?: string | "none" | null;
  acodec?: string | "none" | null;
  abr?: number | null;
  tbr?: number | null;
  filesize?: number | null;
  filesize_approx?: number | null;
  format_note?: string;
  protocol?: string;
  dynamic_range?: string | null;
}

interface YtDlpJson {
  id?: string;
  title?: string;
  description?: string;
  uploader?: string;
  uploader_id?: string;
  creator?: string;
  channel?: string;
  duration?: number;
  thumbnail?: string;
  thumbnails?: { url: string; preference?: number }[];
  ext?: string;
  formats?: YtDlpFormat[];
  url?: string;
  webpage_url?: string;
  is_live?: boolean;
  _filename?: string;
}

export class YtDlpError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "YtDlpError";
  }
}

function pickThumbnail(meta: YtDlpJson): string | undefined {
  if (meta.thumbnail) return meta.thumbnail;
  if (meta.thumbnails && meta.thumbnails.length) {
    const sorted = [...meta.thumbnails].sort(
      (a, b) => (b.preference ?? 0) - (a.preference ?? 0)
    );
    return sorted[0]?.url;
  }
  return undefined;
}

function hasVideo(f: YtDlpFormat): boolean {
  if (!f.vcodec || f.vcodec === "none") return false;
  if (f.height && f.height >= 2160 && (f.dynamic_range || "").toLowerCase().includes("hdr")) return true;
  return true;
}

function hasAudio(f: YtDlpFormat): boolean {
  return !!f.acodec && f.acodec !== "none";
}

function isImageOnlyPost(meta: YtDlpJson): boolean {
  // yt-dlp marks a single image with ext=jpeg/png and no playable formats
  if (!meta.formats || meta.formats.length === 0) {
    return ["jpg", "jpeg", "png", "webp"].includes((meta.ext || "").toLowerCase());
  }
  return false;
}

/** Pick the single best video format per unique height, preferring mp4. */
function buildVideoFormats(formats: YtDlpFormat[]): MediaFormat[] {
  const videos = formats.filter((f) => hasVideo(f) && f.height);
  const byHeight = new Map<number, YtDlpFormat[]>();
  for (const f of videos) {
    const h = f.height as number;
    if (!byHeight.has(h)) byHeight.set(h, []);
    byHeight.get(h)!.push(f);
  }

  const out: MediaFormat[] = [];
  for (const [height, group] of [...byHeight.entries()].sort((a, b) => b[0] - a[0])) {
    // Prefer mp4, then webm, then any
    const sorted = [...group].sort((a, b) => {
      const extScore = (e: string) => (e === "mp4" ? 0 : e === "webm" ? 1 : 2);
      return extScore(a.ext) - extScore(b.ext);
    });
    const f = sorted[0];
    out.push({
      id: f.format_id,
      label: `${height}p · ${f.ext.toUpperCase()}`,
      ext: f.ext,
      sizeBytes: f.filesize ?? f.filesize_approx ?? 0,
      isVideo: true,
      isAudio: false,
      height,
    });
  }
  return out;
}

function buildAudioFormats(formats: YtDlpFormat[]): MediaFormat[] {
  const audios = formats
    .filter((f) => hasAudio(f) && !hasVideo(f))
    .sort((a, b) => (b.abr ?? 0) - (a.abr ?? 0));

  const seen = new Set<number>();
  const out: MediaFormat[] = [];
  for (const f of audios) {
    const abr = Math.round(f.abr ?? 0);
    if (seen.has(abr)) continue;
    seen.add(abr);
    out.push({
      id: f.format_id,
      label: `Audio · ${abr}kbps`,
      ext: f.ext,
      sizeBytes: f.filesize ?? f.filesize_approx ?? 0,
      isVideo: false,
      isAudio: true,
      abr,
    });
  }
  return out;
}

export async function fetchMediaInfo(url: string): Promise<MediaInfo> {
  const platform: Platform = detectPlatform(url);
  if (platform === "unknown") {
    throw new YtDlpError("unsupported", "That URL doesn't look like a supported post.");
  }

  const args = ["-J", "--no-warnings", "--no-playlist", url];
  if (FFMPEG_LOCATION) args.push("--ffmpeg-location", FFMPEG_LOCATION);

  const stdout = await new Promise<string>((resolve, reject) => {
    execFile(
      YTDLP_BIN,
      args,
      { maxBuffer: 64 * 1024 * 1024, timeout: 60_000 },
      (err, out, stderr) => {
        if (err) {
          const msg = (stderr || err.message || "").toString();
          if (/Sign in to confirm|cookies|not a bot|login required/i.test(msg)) {
            return reject(new YtDlpError("auth_required", "This post requires sign-in or cookies."));
          }
          if (/Private|unavailable|removed|not available/i.test(msg)) {
            return reject(new YtDlpError("unavailable", "This post is private or unavailable."));
          }
          if (/HTTP Error 404|Video unavailable/i.test(msg)) {
            return reject(new YtDlpError("not_found", "We couldn't find that post."));
          }
          return reject(new YtDlpError("ytdlp_failed", msg.slice(0, 300) || "yt-dlp failed."));
        }
        resolve(out);
      }
    );
  });

  let meta: YtDlpJson;
  try {
    meta = JSON.parse(stdout) as YtDlpJson;
  } catch {
    throw new YtDlpError("parse_error", "Couldn't read the response from yt-dlp.");
  }

  const formats = meta.formats ?? [];
  const isImage = isImageOnlyPost(meta);
  const videoFormats = isImage ? [] : buildVideoFormats(formats);
  const audioFormats = isImage ? [] : buildAudioFormats(formats);

  if (!isImage && videoFormats.length === 0 && audioFormats.length === 0) {
    throw new YtDlpError("no_media", "We couldn't find a downloadable video or audio in this post.");
  }

  const author = meta.uploader || meta.creator || meta.channel || meta.uploader_id;

  return {
    platform,
    url: meta.webpage_url || url,
    title: meta.title || "Untitled",
    author: author || undefined,
    description: meta.description || undefined,
    durationSec: meta.duration,
    thumbnail: pickThumbnail(meta),
    imageUrl: isImage ? meta.url || meta.thumbnail : undefined,
    isImage,
    formats: [...videoFormats, ...audioFormats],
  };
}

export interface DownloadOptions {
  url: string;
  /** yt-dlp format selector: e.g. "137+140" for 1080p+audio, "bestaudio" for MP3 */
  formatId: string;
  /** Force output extension, e.g. "mp3" */
  remuxTo?: "mp3" | "mp4";
  /** Optional filename override (without extension) */
  filename?: string;
}

export function startDownload(opts: DownloadOptions): {
  proc: ReturnType<typeof spawn>;
  ext: string;
  filename: string;
} {
  const args: string[] = [
    "--no-warnings",
    "--no-playlist",
    "-f", opts.formatId,
    "-o", "-", // stream to stdout
  ];

  if (opts.remuxTo === "mp3") {
    args.push("-x", "--audio-format", "mp3");
  } else if (opts.remuxTo === "mp4") {
    args.push("--remux-video", "mp4");
  }

  if (FFMPEG_LOCATION) args.push("--ffmpeg-location", FFMPEG_LOCATION);
  args.push(opts.url);

  const proc = spawn(YTDLP_BIN, args, { stdio: ["ignore", "pipe", "pipe"] });

  const ext = opts.remuxTo || "mp4";
  const filename = `${slugify(opts.filename || "fetchz-media")}.${ext}`;

  return { proc, ext, filename };
}

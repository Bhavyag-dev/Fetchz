export type Platform = "x" | "instagram" | "threads" | "pinterest" | "youtube" | "unknown";

export interface MediaFormat {
  /** yt-dlp format id (e.g. "137+140" or "bestaudio") */
  id: string;
  /** Human label: "1080p · MP4", "Audio (320kbps)" */
  label: string;
  /** Container extension: mp4, webm, mp3 */
  ext: string;
  /** Approximate file size in bytes (0 if unknown) */
  sizeBytes: number;
  /** Best available thumbnail for the format */
  thumbnail?: string;
  /** Provider URL retained server-side for direct-media providers. */
  directUrl?: string;
  /** True if this is a video format */
  isVideo: boolean;
  /** True if this is an audio-only format (MP3 candidate) */
  isAudio: boolean;
  /** Vertical resolution in px (for video) */
  height?: number;
  /** Bitrate in kbps (for audio) */
  abr?: number;
}

export interface MediaInfo {
  platform: Platform;
  url: string;
  title: string;
  author?: string;
  description?: string;
  durationSec?: number;
  thumbnail?: string;
  /** Image URL for static-image posts (e.g. IG image, Pinterest pin) */
  imageUrl?: string;
  /** Direct video URL for preview */
  videoUrl?: string;
  /** True when the post is a single image, not a video */
  isImage: boolean;
  formats: MediaFormat[];
}

export interface InfoRequest {
  url: string;
}

export interface InfoError {
  error: string;
  /** Suggested user-facing message */
  message: string;
}

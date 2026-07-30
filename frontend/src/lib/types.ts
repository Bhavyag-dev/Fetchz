export type Platform = "x" | "instagram" | "threads" | "pinterest" | "youtube" | "unknown";

export interface MediaFormat {
  id: string;
  label: string;
  ext: string;
  sizeBytes: number;
  thumbnail?: string;
  isVideo: boolean;
  isAudio: boolean;
  height?: number;
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
  imageUrl?: string;
  videoUrl?: string;
  isImage: boolean;
  formats: MediaFormat[];
}

export interface ApiError {
  error: string;
  message: string;
}

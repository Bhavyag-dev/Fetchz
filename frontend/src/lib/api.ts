import type { MediaInfo, ApiError } from "./types";

export const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8080").replace(/\/+$/, "");

/**
 * POST /api/info — fetch media information for a given URL.
 * Returns title, available formats, thumbnail, etc.
 */
export async function fetchMediaInfo(url: string, signal?: AbortSignal): Promise<MediaInfo> {
  const res = await fetch(`${API_BASE}/api/info`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
    signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(35_000)]) : AbortSignal.timeout(35_000),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  return res.json() as Promise<MediaInfo>;
}

/**
 * Build the download URL for GET /api/download.
 * The browser will start a file download when navigated to this URL.
 */
export function getDownloadUrl(url: string, formatId: string): string {
  const params = new URLSearchParams({ url, format_id: formatId });
  return `${API_BASE}/api/download?${params.toString()}`;
}

/**
 * Build the thumbnail proxy URL for GET /api/thumbnail.
 */
export function getThumbnailUrl(url: string): string {
  const params = new URLSearchParams({ url });
  return `${API_BASE}/api/thumbnail?${params.toString()}`;
}

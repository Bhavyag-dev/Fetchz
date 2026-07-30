import { NextRequest, NextResponse } from "next/server";
import { getDownloadUrl } from "@/lib/media-fetcher";
import { CobaltError, ThreadsError, YtDlpError } from "@/lib/media-fetcher";
import { detectPlatform, isValidUrl } from "@/lib/detect";
import { startDownload as startYtDlpDownload } from "@/lib/ytdlp";
import { Readable } from "node:stream";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isSafeRemoteMediaUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password) return false;

    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || host.endsWith(".localhost") || host === "::1") return false;
    if (/^127\./.test(host) || /^0\./.test(host) || /^169\.254\./.test(host)) return false;
    if (/^10\./.test(host) || /^192\.168\./.test(host)) return false;
    const private172 = host.match(/^172\.(\d{1,3})\./);
    if (private172 && Number(private172[1]) >= 16 && Number(private172[1]) <= 31) return false;
    if (/^(fc|fd|fe80):/i.test(host)) return false;
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url      = searchParams.get("url")?.trim();
  const formatId = searchParams.get("format_id")?.trim();

  if (!url || !isValidUrl(url)) {
    return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  }
  if (!formatId) {
    return NextResponse.json({ error: "missing_format_id" }, { status: 400 });
  }
  if (detectPlatform(url) === "unknown") {
    return NextResponse.json({ error: "unsupported" }, { status: 400 });
  }

  try {
    if (detectPlatform(url) === "youtube") {
      const isAudio = formatId.startsWith("audio:");
      const { proc, filename } = startYtDlpDownload({
        url,
        formatId: isAudio ? formatId.slice("audio:".length) : formatId,
        remuxTo: isAudio ? "mp3" : "mp4",
      });
      proc.stderr?.resume();
      proc.once("error", () => proc.kill());
      req.signal.addEventListener("abort", () => proc.kill(), { once: true });

      if (!proc.stdout) {
        throw new YtDlpError("stream_failed", "yt-dlp did not create a download stream.");
      }

      return new NextResponse(Readable.toWeb(proc.stdout) as ReadableStream, {
        headers: {
          "Content-Type": isAudio ? "audio/mpeg" : "video/mp4",
          "Content-Disposition": `attachment; filename="${filename.replace(/\"/g, "")}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const { downloadUrl, filename } = await getDownloadUrl(url, formatId);

    if (!isSafeRemoteMediaUrl(downloadUrl)) {
      return NextResponse.json({ error: "unsafe_upstream" }, { status: 502 });
    }

    // Proxy the file through our server so the browser sees a clean download.
    // Video elements request byte ranges while they buffer and seek; forwarding
    // the range request is especially important for Threads' CDN videos, which
    // otherwise download as a non-playable attachment instead of autoplaying.
    const range = req.headers.get("range");
    const upstream = await fetch(downloadUrl, {
      headers: range ? { Range: range } : undefined,
      signal: AbortSignal.timeout(55_000),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "upstream_failed", message: `Upstream returned ${upstream.status}` },
        { status: 502 }
      );
    }

    const contentType =
      upstream.headers.get("content-type") ?? "application/octet-stream";

    const safeFilename = filename.replace(/"/g, "");
    const inline = searchParams.get("inline") === "true";
    const upstreamHeaders = upstream.headers;
    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": inline ? "inline" : `attachment; filename="${safeFilename}"`,
      "Cache-Control": "no-store",
    });

    // Preserve the media headers browsers require for buffered playback.
    for (const header of ["accept-ranges", "content-length", "content-range"]) {
      const value = upstreamHeaders.get(header);
      if (value) headers.set(header, value);
    }

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (err) {
    if (err instanceof CobaltError || err instanceof ThreadsError || err instanceof YtDlpError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: 422 });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "internal", message: message.slice(0, 200) },
      { status: 500 }
    );
  }
}

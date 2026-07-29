import { NextRequest, NextResponse } from "next/server";
import { getDownloadUrl, CobaltError } from "@/lib/cobalt";
import { detectPlatform, isValidUrl } from "@/lib/detect";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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
    const { downloadUrl, filename } = await getDownloadUrl(url, formatId);

    // Proxy the file through our server so the browser sees a clean download
    const upstream = await fetch(downloadUrl, {
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

    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": inline ? "inline" : `attachment; filename="${safeFilename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    if (err instanceof CobaltError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: 422 });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "internal", message: message.slice(0, 200) },
      { status: 500 }
    );
  }
}

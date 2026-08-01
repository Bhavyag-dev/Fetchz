import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function isSafeUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host)) return false;
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("src") || searchParams.get("url");

  if (!imageUrl || !isSafeUrl(imageUrl)) {
    return NextResponse.json({ error: "missing_or_unsafe_url" }, { status: 400 });
  }

  const range = req.headers.get("range");

  try {
    const response = await fetch(imageUrl, {
      signal: AbortSignal.timeout(25_000),
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Referer": "https://www.instagram.com/",
        ...(range ? { Range: range } : {}),
      },
    });

    if (!response.ok && response.status !== 206) {
      return NextResponse.json({ error: "fetch_failed", status: response.status }, { status: 502 });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const responseHeaders = new Headers({
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    });

    for (const h of ["content-length", "content-range", "accept-ranges"]) {
      const v = response.headers.get(h);
      if (v) responseHeaders.set(h, v);
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err) {
    return NextResponse.json({ error: "proxy_failed", detail: String(err) }, { status: 502 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { fetchMediaInfo, CobaltError } from "@/lib/cobalt";
import { detectPlatform, isValidUrl } from "@/lib/detect";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "bad_request", message: "Send a JSON body with a `url` field." },
      { status: 400 }
    );
  }

  const url = body.url?.trim();

  if (!url) {
    return NextResponse.json(
      { error: "missing_url", message: "Please paste a link." },
      { status: 400 }
    );
  }
  if (!isValidUrl(url)) {
    return NextResponse.json(
      { error: "invalid_url", message: "That doesn't look like a valid URL." },
      { status: 400 }
    );
  }
  if (detectPlatform(url) === "unknown") {
    return NextResponse.json(
      { error: "unsupported", message: "Paste a link from X, Instagram, Threads, or Pinterest." },
      { status: 400 }
    );
  }

  try {
    const info = await fetchMediaInfo(url);
    return NextResponse.json(info);
  } catch (err) {
    if (err instanceof CobaltError) {
      const status =
        err.code === "auth_required" ? 403 :
        err.code === "unavailable"   ? 403 :
        err.code === "no_media"      ? 404 : 422;
      return NextResponse.json({ error: err.code, message: err.message }, { status });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "internal", message: `Something went wrong: ${message.slice(0, 200)}` },
      { status: 500 }
    );
  }
}

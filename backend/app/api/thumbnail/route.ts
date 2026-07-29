import { NextRequest, NextResponse } from "next/server";
import { detectPlatform } from "@/lib/detect";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface ThumbnailExtractor {
  platform: string;
  extract: (url: string) => string | null;
}

const extractors: ThumbnailExtractor[] = [
  {
    platform: "x",
    extract: (url: string) => {
      // X/Twitter video thumbnails from tweet embeds
      const tweetMatch = url.match(/status\/(\d+)/);
      if (tweetMatch) {
        return `https://syndication.twitter.com/srv/thumbnails/oembed.json?url=${encodeURIComponent(url)}`;
      }
      return null;
    },
  },
  {
    platform: "instagram",
    extract: (url: string) => {
      // Instagram uses post IDs for media
      const postMatch = url.match(/\/p\/([A-Za-z0-9_-]+)/);
      if (postMatch) {
        return `https://www.instagram.com/p/${postMatch[1]}/media/?size=m`;
      }
      return null;
    },
  },
  {
    platform: "threads",
    extract: (url: string) => {
      // Threads posts share the same media infrastructure as Instagram
      const postMatch = url.match(/\/post\/([A-Za-z0-9_-]+)/);
      if (postMatch) {
        return `https://www.threads.net/post/${postMatch[1]}/media/?size=m`;
      }
      return null;
    },
  },
  {
    platform: "pinterest",
    extract: (url: string) => {
      // Pinterest pin thumbnails via pin ID
      const pinMatch = url.match(/\/pin\/(\d+)/);
      if (pinMatch) {
        return `https://i.pinimg.com/736x/${pinMatch[1].slice(0, 2)}/${pinMatch[1].slice(2, 4)}/${pinMatch[1].slice(4, 6)}/${pinMatch[1]}.jpg`;
      }
      return null;
    },
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const originalUrl = searchParams.get("url");

  if (!originalUrl) {
    return NextResponse.json({ error: "missing_url" }, { status: 400 });
  }

  const platform = detectPlatform(originalUrl);
  const extractor = extractors.find((e) => e.platform === platform);

  if (!extractor) {
    return NextResponse.json({ error: "unsupported_platform" }, { status: 400 });
  }

  const thumbnailUrl = extractor.extract(originalUrl);
  if (!thumbnailUrl) {
    return NextResponse.json({ error: "no_thumbnail" }, { status: 404 });
  }

  try {
    // Fetch the thumbnail and proxy it
    const response = await fetch(thumbnailUrl, {
      signal: AbortSignal.timeout(25_000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Fetchz/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    });
  } catch {
    return NextResponse.json({ error: "thumbnail_unavailable" }, { status: 502 });
  }
}
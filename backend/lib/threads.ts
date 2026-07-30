import type { MediaInfo, MediaFormat, Platform } from "@/types/media";
import { detectPlatform } from "@/lib/detect";

export class ThreadsError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "ThreadsError";
  }
}

interface ThreadsMediaItem {
  type: "video" | "image";
  url: string;
  thumbnail?: string;
  width?: number;
  height?: number;
}

interface ThreadsPostData {
  title?: string;
  author?: string;
  media: ThreadsMediaItem[];
  thumbnail?: string;
}

function decodeHtmlValue(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\\u0026/g, "&")
    .replace(/\\\\\//g, "/");
}

function metaContent(html: string, key: string): string | undefined {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const keyMatch = tag.match(/(?:property|name)=["']([^"']+)["']/i);
    if (keyMatch?.[1].toLowerCase() !== key.toLowerCase()) continue;
    const contentMatch = tag.match(/content=["']([^"']*)["']/i);
    if (contentMatch?.[1]) return decodeHtmlValue(contentMatch[1]);
  }
  return undefined;
}

function urlsNearKey(html: string, key: string): string[] {
  const urls = new Set<string>();
  let position = 0;
  while ((position = html.indexOf(key, position)) !== -1) {
    const fragment = html.slice(position, position + 20_000);
    for (const match of fragment.matchAll(/https?(?::|%3A)(?:\\\/|%2F|\/){2}[^"'\\\s<>]+/gi)) {
      const value = decodeHtmlValue(match[0]).replace(/\\["']/g, "");
      if (/\.(mp4|m4v|jpg|jpeg|png|webp)(?:[?#]|$)/i.test(value)) urls.add(value);
    }
    position += key.length;
  }
  return [...urls];
}

/**
 * Extract Threads post data from page HTML
 * Threads embeds data in JSON-LD script tags and meta tags
 */
async function extractThreadsData(url: string): Promise<ThreadsPostData> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
    },
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new ThreadsError("not_found", "This Threads post was not found.");
    }
    throw new ThreadsError("fetch_failed", `Failed to fetch Threads post: ${response.status}`);
  }

  const html = await response.text();

  // Extract JSON-LD structured data
  const jsonLdMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  let structuredData: any = null;
  if (jsonLdMatch) {
    try {
      structuredData = JSON.parse(jsonLdMatch[1]);
    } catch (e) {
      console.error("Failed to parse JSON-LD:", e);
    }
  }

  // Extract media from meta tags
  const ogVideo = metaContent(html, "og:video");
  const ogImage = metaContent(html, "og:image");
  const twitterPlayer = metaContent(html, "twitter:player:stream");
  const ogTitle = metaContent(html, "og:title");
  const ogDescription = metaContent(html, "og:description");

  // Try to extract from embedded JSON data
  const embedDataMatch = html.match(/window\.__RELAY_STORE__\s*=\s*({[\s\S]+?});/);
  let embedData: any = null;
  if (embedDataMatch) {
    try {
      embedData = JSON.parse(embedDataMatch[1]);
    } catch (e) {
      console.error("Failed to parse embed data:", e);
    }
  }

  const media: ThreadsMediaItem[] = [];
  
  // Priority 1: Twitter player stream (usually best quality)
  if (twitterPlayer) {
    media.push({
      type: "video",
      url: twitterPlayer,
    });
  }
  
  // Priority 2: OG video tag
  if (ogVideo && !media.some(m => m.url === ogVideo)) {
    media.push({
      type: "video",
      url: ogVideo,
    });
  }

  // Priority 3: Check structured data
  if (structuredData?.video?.contentUrl && !media.some(m => m.url === structuredData.video.contentUrl)) {
    media.push({
      type: "video",
      url: structuredData.video.contentUrl,
      thumbnail: structuredData.video.thumbnailUrl,
    });
  }

  // Priority 4: Parse embedded data for video URLs
  if (embedData) {
    Object.values(embedData).forEach((item: any) => {
      if (item?.video_versions) {
        item.video_versions.forEach((version: any) => {
          if (version.url && !media.some(m => m.url === version.url)) {
            media.push({
              type: "video",
              url: version.url,
              width: version.width,
              height: version.height,
            });
          }
        });
      }
      if (item?.image_versions2?.candidates) {
        item.image_versions2.candidates.forEach((img: any) => {
          if (img.url && !media.some(m => m.url === img.url)) {
            media.push({
              type: "image",
              url: img.url,
              width: img.width,
              height: img.height,
            });
          }
        });
      }
    });
  }

  // Threads frequently ships the Relay payload inside an inline script rather
  // than `window.__RELAY_STORE__`. Pull the media URLs from those payloads too.
  for (const videoUrl of urlsNearKey(html, "video_versions")) {
    if (!media.some((item) => item.url === videoUrl)) media.push({ type: "video", url: videoUrl });
  }
  for (const imageUrl of urlsNearKey(html, "image_versions2")) {
    if (!media.some((item) => item.url === imageUrl)) media.push({ type: "image", url: imageUrl });
  }

  if (media.length === 0) {
    throw new ThreadsError("no_media", "No downloadable video was found in this Threads post.");
  }

  const title = ogTitle || ogDescription || "Threads Post";
  const author = extractAuthorFromTitle(title) || extractAuthorFromUrl(url);

  return {
    title: cleanTitle(title),
    author,
    media,
    thumbnail: ogImage,
  };
}

function extractAuthorFromTitle(title: string): string | undefined {
  // Threads titles often contain "Username on Threads:" or similar
  const match = title.match(/^(.+?)\s+on\s+Threads/i) || title.match(/^@?(\w+)/);
  return match?.[1];
}

function extractAuthorFromUrl(url: string): string | undefined {
  // Extract from URL: threads.net/@username/post/...
  const match = url.match(/threads\.(?:net|com)\/@([^\/]+)/);
  return match?.[1];
}

function cleanTitle(title: string): string {
  // Remove "on Threads:" suffix and trim
  return title
    .replace(/\s+on\s+Threads:?\s*/i, "")
    .replace(/\s*\|\s*Threads$/i, "")
    .trim() || "Threads Post";
}

/**
 * Fetch media info from a Threads post URL
 */
export async function fetchMediaInfo(url: string): Promise<MediaInfo> {
  const platform: Platform = detectPlatform(url);
  
  if (platform !== "threads") {
    throw new ThreadsError("invalid_platform", "This is not a Threads URL.");
  }

  console.log(`Fetching Threads post data from: ${url}`);

  const data = await extractThreadsData(url);
  
  const videoMedia = data.media.filter(m => m.type === "video");
  const imageMedia = data.media.filter(m => m.type === "image");

  if (videoMedia.length === 0) {
    throw new ThreadsError("no_media", "This Threads post does not contain a downloadable video.");
  }
  
  // Build format list from available videos
  const formats: MediaFormat[] = [];
  
  if (videoMedia.length > 0) {
    // Sort by quality if height is available
    const sortedVideos = [...videoMedia].sort((a, b) => (b.height || 0) - (a.height || 0));
    
    sortedVideos.forEach((video, index) => {
      const height = video.height || 720;
      const label = video.height 
        ? `${video.height}p · MP4`
        : index === 0 
          ? "Best Quality · MP4" 
          : `Quality ${index + 1} · MP4`;
      
      formats.push({
        id: `threads-video-${index}`,
        label,
        ext: "mp4",
        sizeBytes: 0,
        isVideo: true,
        isAudio: false,
        height,
        directUrl: video.url,
      });
    });
  }

  return {
    platform,
    url,
    title: data.title || "Threads Post",
    author: data.author,
    thumbnail: data.thumbnail || videoMedia[0]?.thumbnail,
    videoUrl: videoMedia[0]?.url,
    isImage: false,
    formats,
  };
}

/**
 * Get direct download URL for a specific format
 */
export async function getDownloadUrl(url: string, formatId: string): Promise<{ downloadUrl: string; filename: string }> {
  // For Threads, we already have the direct URL in the format from fetchMediaInfo
  // We need to re-fetch to get the URL (since we can't pass it through the API easily)
  
  const info = await fetchMediaInfo(url);
  const format = info.formats.find(f => f.id === formatId);
  
  if (!format) {
    throw new ThreadsError("format_not_found", "The requested format was not found.");
  }

  const directUrl = format.directUrl;
  
  if (!directUrl) {
    throw new ThreadsError("no_url", "Could not find direct URL for this format.");
  }

  // Generate a reasonable filename
  const author = info.author || "threads";
  const ext = format.ext || "mp4";
  const filename = `${author}_threads_${Date.now()}.${ext}`;

  return {
    downloadUrl: directUrl,
    filename,
  };
}

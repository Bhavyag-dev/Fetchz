import { NextRequest, NextResponse } from "next/server";

const LOCAL_ORIGINS = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "null", // Allow sandboxed frames (e.g., Lovable preview)
]);

function corsHeaders(origin: string | null): HeadersInit | null {
  const rawOriginEnv = process.env.FRONTEND_ORIGIN ?? "";
  const configuredOrigins = rawOriginEnv
    .split(",")
    .map((value) => value.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  // If no Origin header is sent (SSR, direct request, or stripped by proxy/CDN)
  if (!origin) {
    const fallbackOrigin = configuredOrigins[0] || "*";
    return {
      "Access-Control-Allow-Origin": fallbackOrigin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    };
  }

  const normalizedOrigin = origin.trim().replace(/\/+$/, "");

  const isLocal = LOCAL_ORIGINS.has(normalizedOrigin);
  const isAllowed = configuredOrigins.includes(normalizedOrigin) || configuredOrigins.includes("*");

  if (!isLocal && !isAllowed) {
    console.warn(
      `[CORS Blocked] Origin "${origin}" is not allowed. ` +
      `Local: ${isLocal}, Configured: [${configuredOrigins.join(", ")}]. ` +
      `Raw FRONTEND_ORIGIN: "${rawOriginEnv}"`
    );
    return null;
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function middleware(req: NextRequest) {
  const headers = corsHeaders(req.headers.get("origin"));

  if (req.method === "OPTIONS") {
    return headers
      ? new NextResponse(null, { status: 204, headers })
      : NextResponse.json({ error: "cors_not_allowed" }, { status: 403 });
  }

  const response = NextResponse.next();
  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      response.headers.set(key, value);
    }
  }
  return response;
}

/*
 * CORS is restricted to local development origins and FRONTEND_ORIGIN. Set
 * FRONTEND_ORIGIN to a comma-separated list when the Vercel production and
 * preview domains both need API access.
 */

export const config = {
  matcher: "/api/:path*",
};

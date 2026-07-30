import { NextRequest, NextResponse } from "next/server";

const LOCAL_ORIGINS = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function corsHeaders(origin: string | null): HeadersInit | null {
  const configuredOrigins = (process.env.FRONTEND_ORIGIN ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!origin || (!LOCAL_ORIGINS.has(origin) && !configuredOrigins.includes(origin))) {
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

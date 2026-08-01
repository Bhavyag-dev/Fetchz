import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Fetchz Backend API",
    endpoints: {
      health: "/api/health",
      info: "/api/info",
      download: "/api/download",
      thumbnail: "/api/thumbnail"
    }
  });
}

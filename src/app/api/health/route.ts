/**
 * Health Check / Ping API — /api/health
 * Lightweight endpoint used to wake the Render.com server from cold start.
 * Also verifies database connectivity with a minimal query.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Lightweight DB ping to also warm up the database connection
    await prisma.$queryRawUnsafe("SELECT 1");

    return NextResponse.json(
      { status: "ok", timestamp: Date.now() },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "Database connection failed" },
      { status: 500 }
    );
  }
}

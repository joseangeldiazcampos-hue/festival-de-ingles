/**
 * Admin API – Countries
 * GET    /api/admin/countries        → list all countries
 * POST   /api/admin/countries        → create a country
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  const countries = await prisma.country.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { questions: true, attempts: true } } },
  });

  return NextResponse.json(countries);
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const { name, slug, flagEmoji, monument, order } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
      { status: 400 }
    );
  }

  try {
    const country = await prisma.country.create({
      data: { name, slug, flagEmoji, monument, order: order ?? 0 },
    });
    return NextResponse.json(country, { status: 201 });
  } catch (error: unknown) {
    const e = error as { code?: string };
    if (e.code === "P2002") {
      return NextResponse.json({ error: "A country with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

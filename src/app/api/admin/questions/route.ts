/**
 * Admin API – Questions
 * GET    /api/admin/questions?countryId=xxx  → list questions for a country
 * POST   /api/admin/questions                → create a question
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

export async function GET(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const countryId = searchParams.get("countryId");

  if (!countryId) {
    return NextResponse.json({ error: "countryId query param is required" }, { status: 400 });
  }

  const questions = await prisma.question.findMany({
    where: { countryId },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(questions);
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const { countryId, text, optionA, optionB, optionC, optionD, correctOption, order } = body;

  if (!countryId || !text || !optionA || !optionB || !optionC || !optionD || !correctOption) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (!["A", "B", "C", "D"].includes(correctOption)) {
    return NextResponse.json({ error: "correctOption must be A, B, C, or D" }, { status: 400 });
  }

  try {
    const question = await prisma.question.create({
      data: { countryId, text, optionA, optionB, optionC, optionD, correctOption, order: order ?? 0 },
    });
    return NextResponse.json(question, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

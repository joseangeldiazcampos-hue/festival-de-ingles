/**
 * Admin API – Questions
 * GET    /api/admin/questions?gradeGroupId=xxx  → list questions for a grade group
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
  const gradeGroupId = searchParams.get("gradeGroupId");

  if (!gradeGroupId) {
    return NextResponse.json({ error: "gradeGroupId query param is required" }, { status: 400 });
  }

  const questions = await prisma.question.findMany({
    where: { gradeGroupId },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(questions);
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const { gradeGroupId, text, optionA, optionB, optionC, optionD, correctOption, order, level, type, isBonus, correctAnswer } = body;

  if (!gradeGroupId || !text || !type || !level) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  if (type === "choice" && correctOption && !["A", "B", "C", "D"].includes(correctOption)) {
    return NextResponse.json({ error: "correctOption must be A, B, C, or D" }, { status: 400 });
  }

  try {
    const question = await prisma.question.create({
      data: { 
        gradeGroupId, text, optionA, optionB, optionC, optionD, correctOption, 
        order: order ?? 0,
        level, type, isBonus: isBonus ?? false, correctAnswer
      },
    });
    return NextResponse.json(question, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

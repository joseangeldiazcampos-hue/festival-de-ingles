/**
 * GET /api/quiz/[slug]
 * Returns the questions for a given grade group slug.
 * IMPORTANT: The correctOption and correctAnswer fields are NEVER included in the response.
 * Answer validation happens only server-side in /api/quiz/submit.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const gradeGroup = await prisma.gradeGroup.findUnique({
      where: { slug },
      include: {
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            text: true,
            type: true,
            level: true,
            isBonus: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            order: true,
            // ⚠️ correctOption and correctAnswer are intentionally excluded
          },
        },
      },
    });

    if (!gradeGroup) {
      return NextResponse.json({ error: "Grade group not found" }, { status: 404 });
    }

    if (!gradeGroup.isActive) {
      return NextResponse.json({ error: "Quiz is currently unavailable" }, { status: 403 });
    }

    return NextResponse.json({
      id: gradeGroup.id,
      name: gradeGroup.name,
      slug: gradeGroup.slug,
      emoji: gradeGroup.emoji,
      levels: gradeGroup.levels,
      description: gradeGroup.description,
      questions: gradeGroup.questions,
    });
  } catch (error) {
    console.error("Quiz fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

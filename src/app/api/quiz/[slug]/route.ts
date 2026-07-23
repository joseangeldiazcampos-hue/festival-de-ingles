/**
 * GET /api/quiz/[slug]
 * Returns the questions for a given country slug.
 * IMPORTANT: The correctOption field is NEVER included in the response.
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
    const country = await prisma.country.findUnique({
      where: { slug },
      include: {
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            text: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            order: true,
            // ⚠️ correctOption is intentionally excluded
          },
        },
      },
    });

    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    if (!country.isActive) {
      return NextResponse.json({ error: "Quiz is currently unavailable" }, { status: 403 });
    }

    return NextResponse.json({
      id: country.id,
      name: country.name,
      slug: country.slug,
      flagEmoji: country.flagEmoji,
      monument: country.monument,
      questions: country.questions,
    });
  } catch (error) {
    console.error("Quiz fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

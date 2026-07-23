/**
 * Admin API – AI Review
 * POST /api/admin/ai-review
 * Reviews a quiz question using Google Gemini for grammar, spelling, and answer validity.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { reviewQuestionWithAI } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { question, optionA, optionB, optionC, optionD, correctOption } = body;

  if (!question || !optionA || !optionB || !optionC || !optionD || !correctOption) {
    return NextResponse.json({ error: "All fields are required for review" }, { status: 400 });
  }

  try {
    const result = await reviewQuestionWithAI({
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("AI review API error:", error);
    return NextResponse.json({ error: "AI review failed" }, { status: 500 });
  }
}

/**
 * POST /api/quiz/submit
 *
 * Receives student name and answers, validates name and grades answers server-side,
 * saves the attempt in DB, and sends notification email to the admin.
 *
 * Body: { countrySlug: string, studentName: string, answers: Record<questionId, "A"|"B"|"C"|"D"> }
 * Response: { success: true } — students never see individual results.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendQuizResultEmail } from "@/lib/email";
import { validateStudentName } from "@/lib/nameValidator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { countrySlug, studentName, answers } = body as {
      countrySlug: string;
      studentName: string;
      answers: Record<string, string>;
    };

    if (!countrySlug || !answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Server-side student name validation
    const nameValidation = validateStudentName(studentName);
    if (!nameValidation.isValid) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 });
    }

    const cleanStudentName = studentName.trim();

    // Fetch country and its questions with correct answers (server-side only)
    const country = await prisma.country.findUnique({
      where: { slug: countrySlug },
      include: {
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            correctOption: true,
          },
        },
      },
    });

    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    if (!country.isActive) {
      return NextResponse.json({ error: "Quiz is unavailable" }, { status: 403 });
    }

    // Grade the answers
    let correct = 0;
    let incorrect = 0;

    for (const question of country.questions) {
      const studentAnswer = answers[question.id];
      if (studentAnswer === question.correctOption) {
        correct++;
      } else {
        incorrect++;
      }
    }

    const total = country.questions.length;
    const isPerfect = correct === total;

    // Save attempt with student name
    await prisma.attempt.create({
      data: {
        countryId: country.id,
        studentName: cleanStudentName,
        correct,
        incorrect,
        total,
        isPerfect,
      },
    });

    // Send email to admin
    sendQuizResultEmail({
      countryName: country.name,
      studentName: cleanStudentName,
      correct,
      incorrect,
      total,
      isPerfect,
      submittedAt: new Date(),
    }).catch((err) => {
      console.error("Failed to send quiz result email:", err);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

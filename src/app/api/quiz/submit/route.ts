/**
 * POST /api/quiz/submit
 *
 * Receives student name, grade, and answers, validates and grades answers server-side,
 * saves the attempt in DB, and sends notification email to the admin.
 *
 * Body: {
 *   gradeGroupSlug: string,
 *   studentName: string,
 *   studentGrade: string,
 *   answers: Record<questionId, "A"|"B"|"C"|"D">,  // for choice questions
 *   bonusAnswers: Record<questionId, string>        // for open-ended bonus questions
 * }
 * Response: { success: true } — students never see individual results.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendQuizResultEmail } from "@/lib/email";
import { validateStudentName } from "@/lib/nameValidator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gradeGroupSlug, studentName, studentGrade, answers, bonusAnswers } = body as {
      gradeGroupSlug: string;
      studentName: string;
      studentGrade: string;
      answers: Record<string, string>;
      bonusAnswers?: Record<string, string>;
    };

    if (!gradeGroupSlug || !answers || typeof answers !== "object" || !studentGrade) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Server-side student name validation
    const nameValidation = validateStudentName(studentName);
    if (!nameValidation.isValid) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 });
    }

    const cleanStudentName = studentName.trim();

    // Fetch grade group and its questions with correct answers (server-side only)
    const gradeGroup = await prisma.gradeGroup.findUnique({
      where: { slug: gradeGroupSlug },
      include: {
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            type: true,
            isBonus: true,
            correctOption: true,
            correctAnswer: true,
          },
        },
      },
    });

    if (!gradeGroup) {
      return NextResponse.json({ error: "Grade group not found" }, { status: 404 });
    }

    if (!gradeGroup.isActive) {
      return NextResponse.json({ error: "Quiz is unavailable" }, { status: 403 });
    }

    // Grade only the choice (non-bonus) questions
    let correct = 0;
    let incorrect = 0;
    const choiceQuestions = gradeGroup.questions.filter(q => q.type === "choice" && !q.isBonus);

    for (const question of choiceQuestions) {
      const studentAnswer = answers[question.id];
      if (studentAnswer === question.correctOption) {
        correct++;
      } else {
        incorrect++;
      }
    }

    const total = choiceQuestions.length;
    const isPerfect = correct === total;

    // Serialize bonus answers for manual review
    const bonusAnswersJson = bonusAnswers ? JSON.stringify(bonusAnswers) : null;

    // Save attempt with student grade
    await prisma.attempt.create({
      data: {
        gradeGroupId: gradeGroup.id,
        studentName: cleanStudentName,
        studentGrade,
        correct,
        incorrect,
        total,
        bonusAnswers: bonusAnswersJson,
        isPerfect,
      },
    });

    // Send email to admin
    sendQuizResultEmail({
      countryName: gradeGroup.name,
      studentName: cleanStudentName,
      correct,
      incorrect,
      total,
      isPerfect,
      submittedAt: new Date(),
    }).catch((err) => {
      console.error("Failed to send quiz result email:", err);
    });

    return NextResponse.json({
      success: true,
      isPerfect,
      correct,
      total,
    });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

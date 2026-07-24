/**
 * Quiz Page — /[gradeGroup]/quiz
 * Client-side quiz interface. Questions are fetched without correct answers.
 * Submission is handled server-side via /api/quiz/submit.
 */

import type { Metadata } from "next";
import QuizInterface from "@/components/quiz/QuizInterface";

interface Props {
  params: Promise<{ gradeGroup: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gradeGroup } = await params;
  return {
    title: `Quiz – ${gradeGroup} | Violence Is Never The Answer`,
    description: "Answer the quiz questions carefully. Your responses will be submitted automatically.",
  };
}

export default async function QuizPage({ params }: Props) {
  const { gradeGroup } = await params;
  return <QuizInterface gradeGroupSlug={gradeGroup} />;
}

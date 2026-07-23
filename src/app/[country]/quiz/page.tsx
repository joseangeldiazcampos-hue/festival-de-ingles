/**
 * Quiz Page — /[country]/quiz
 * Client-side quiz interface. Questions are fetched without correct answers.
 * Submission is handled server-side via /api/quiz/submit.
 */

import type { Metadata } from "next";
import QuizInterface from "@/components/quiz/QuizInterface";

interface Props {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const slug = country.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Quiz – ${slug} | Violence Is Never The Answer`,
    description: "Answer the quiz questions carefully. Your responses will be submitted automatically.",
  };
}

export default async function QuizPage({ params }: Props) {
  const { country } = await params;
  return <QuizInterface countrySlug={country} />;
}

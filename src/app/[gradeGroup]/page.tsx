/**
 * Grade Group Landing Page — /[gradeGroup]
 * Shows the grade group info, theme, and a grade selector + "Start Quiz" button.
 * Fetches grade group data from the DB to verify it exists and is active.
 */

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import QuizLanding from "@/components/quiz/QuizLanding";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ gradeGroup: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gradeGroup } = await params;
  const data = await prisma.gradeGroup.findUnique({ where: { slug: gradeGroup } });
  if (!data) return { title: "Not Found" };
  return {
    title: `${data.name} – Violence Is Never The Answer | English Festival`,
    description: `Take the English quiz for ${data.name} (${data.levels}) on the theme: Violence Is Never The Answer.`,
  };
}

export default async function GradeGroupPage({ params }: Props) {
  const { gradeGroup } = await params;

  const data = await prisma.gradeGroup.findUnique({
    where: { slug: gradeGroup },
    select: {
      id: true,
      name: true,
      slug: true,
      grades: true,
      levels: true,
      emoji: true,
      description: true,
      isActive: true,
      _count: { select: { questions: true } },
    },
  });

  if (!data) notFound();

  if (!data.isActive) {
    return (
      <div
        className="bg-animated"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="glass" style={{ padding: "3rem", textAlign: "center", maxWidth: 480, margin: "1rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚫</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
            Quiz Unavailable
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>
            The quiz for {data.name} is currently not available. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <QuizLanding
      name={data.name}
      slug={data.slug}
      grades={data.grades}
      levels={data.levels}
      emoji={data.emoji ?? "📚"}
      description={data.description ?? ""}
      questionCount={data._count.questions}
    />
  );
}

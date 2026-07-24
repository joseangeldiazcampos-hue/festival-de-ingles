/**
 * Admin Attempts/Submissions page — /admin/attempts
 * Shows all quiz submissions with student name, grade group, date, score, result,
 * and allows the teacher to review open-ended written bonus responses.
 */

import { prisma } from "@/lib/db";
import BonusReviewTable from "@/components/admin/BonusReviewTable";

export default async function AttemptsPage() {
  const [attempts, questions] = await Promise.all([
    prisma.attempt.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { gradeGroup: { select: { name: true, emoji: true } } },
    }),
    prisma.question.findMany({
      select: { id: true, text: true },
    }),
  ]);

  // Create a fast map of questionId -> questionText
  const questionsMap: Record<string, string> = {};
  for (const q of questions) {
    questionsMap[q.id] = q.text;
  }

  // Convert Date objects to ISO strings for client component compatibility
  const formattedAttempts = attempts.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", margin: 0 }}>
          Submissions
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.25rem", fontSize: "0.9rem" }}>
          All quiz submissions — {attempts.length} total. Teachers can click &quot;✍️ Ver Respuesta&quot; to review written responses.
        </p>
      </div>

      <div className="admin-card">
        {attempts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
            <p style={{ color: "rgba(255,255,255,0.4)" }}>No submissions yet.</p>
          </div>
        ) : (
          <BonusReviewTable attempts={formattedAttempts} questionsMap={questionsMap} />
        )}
      </div>
    </div>
  );
}

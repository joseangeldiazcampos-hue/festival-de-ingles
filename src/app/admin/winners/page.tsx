/**
 * Admin Winners Page — /admin/winners
 * Shows all students who scored 100% (Perfect Score) on choice questions,
 * and allows teachers to review their written bonus responses.
 */

import { prisma } from "@/lib/db";
import BonusReviewTable from "@/components/admin/BonusReviewTable";

export default async function WinnersPage() {
  const [winners, questions] = await Promise.all([
    prisma.attempt.findMany({
      where: { isPerfect: true },
      orderBy: { createdAt: "desc" },
      include: { gradeGroup: { select: { name: true, emoji: true, slug: true } } },
    }),
    prisma.question.findMany({
      select: { id: true, text: true },
    }),
  ]);

  const questionsMap: Record<string, string> = {};
  for (const q of questions) {
    questionsMap[q.id] = q.text;
  }

  const formattedWinners = winners.map((w) => ({
    ...w,
    createdAt: w.createdAt.toISOString(),
  }));

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", margin: 0 }}>
            🏆 Quiz Winners
          </h1>
          <span
            style={{
              background: "rgba(255, 214, 0, 0.2)",
              border: "1px solid rgba(255, 214, 0, 0.4)",
              color: "#ffd600",
              fontWeight: 800,
              fontSize: "0.85rem",
              padding: "0.3rem 0.85rem",
              borderRadius: "100px",
            }}
          >
            ⭐ {winners.length} Perfect Scores (100%)
          </span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.35rem", fontSize: "0.9rem" }}>
          Students who answered all multiple-choice questions correctly. Click &quot;✍️ Ver Respuesta&quot; to review their written bonus responses.
        </p>
      </div>

      {/* Winners Table */}
      <div className="admin-card">
        {winners.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3.5rem 1rem" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>⭐</div>
            <h3 style={{ color: "white", fontWeight: 700, margin: "0 0 0.5rem" }}>No Winners Yet</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", margin: 0 }}>
              Students who achieve 100% accuracy on choice questions will automatically appear here with fireworks!
            </p>
          </div>
        ) : (
          <BonusReviewTable attempts={formattedWinners} questionsMap={questionsMap} />
        )}
      </div>
    </div>
  );
}

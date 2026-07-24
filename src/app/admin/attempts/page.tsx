/**
 * Admin Attempts/Submissions page — /admin/attempts
 * Shows all quiz submissions with student name, grade group, date, score, and result.
 */

import { prisma } from "@/lib/db";

function getResultLabel(correct: number, total: number): { label: string; color: string } {
  const pct = (correct / total) * 100;
  if (pct === 100) return { label: "⭐ Perfect Score", color: "#ffd600" };
  if (pct >= 90) return { label: "🏆 Excellent", color: "#81c784" };
  if (pct >= 70) return { label: "✅ Passed", color: "#a5d6a7" };
  if (pct >= 50) return { label: "⚠️ Needs Improvement", color: "#ffb74d" };
  return { label: "❌ Failed", color: "#ef9a9a" };
}

export default async function AttemptsPage() {
  const attempts = await prisma.attempt.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { gradeGroup: { select: { name: true, emoji: true } } },
  });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", margin: 0 }}>
          Submissions
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.25rem", fontSize: "0.9rem" }}>
          All quiz submissions — {attempts.length} total
        </p>
      </div>

      <div className="admin-card">
        {attempts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
            <p style={{ color: "rgba(255,255,255,0.4)" }}>No submissions yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Grade</th>
                <th>Grade Group</th>
                <th>Date</th>
                <th>Time</th>
                <th>Score</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => {
                const date = new Date(a.createdAt);
                const result = getResultLabel(a.correct, a.total);
                const pct = Math.round((a.correct / a.total) * 100);
                return (
                  <tr key={a.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: "#90caf9" }}>
                        👤 {a.studentName || "Anonymous"}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
                        {a.studentGrade || "-"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <span style={{ fontSize: "1.2rem" }}>{a.gradeGroup?.emoji}</span>
                        <span style={{ fontWeight: 600 }}>{a.gradeGroup?.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "rgba(255,255,255,0.6)" }}>
                      {date.toLocaleDateString("en-GB")}
                    </td>
                    <td style={{ color: "rgba(255,255,255,0.6)" }}>
                      {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 700, color: result.color }}>{a.correct}/{a.total}</span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            background: "rgba(255,255,255,0.05)",
                            borderRadius: "6px",
                            padding: "0.15rem 0.4rem",
                            color: "rgba(255,255,255,0.4)",
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: result.color, fontWeight: 600, fontSize: "0.875rem" }}>
                        {result.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

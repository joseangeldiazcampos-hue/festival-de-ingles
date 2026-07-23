/**
 * Admin Winners Page — /admin/winners
 * Shows all students who scored 100% (Perfect Score) on any country quiz.
 */

import { prisma } from "@/lib/db";

export default async function WinnersPage() {
  const winners = await prisma.attempt.findMany({
    where: { isPerfect: true },
    orderBy: { createdAt: "desc" },
    include: { country: { select: { name: true, flagEmoji: true, slug: true } } },
  });

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
          Students who answered all questions correctly in Canada, Japan, Italy, USA, or Mexico
        </p>
      </div>

      {/* Winners Table */}
      <div className="admin-card">
        {winners.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3.5rem 1rem" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>⭐</div>
            <h3 style={{ color: "white", fontWeight: 700, margin: "0 0 0.5rem" }}>No Winners Yet</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", margin: 0 }}>
              Students who achieve 100% accuracy on any country quiz will automatically appear here!
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Country Quiz</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {winners.map((w) => {
                  const date = new Date(w.createdAt);
                  return (
                    <tr key={w.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <span style={{ fontSize: "1.1rem" }}>👤</span>
                          <span style={{ fontWeight: 700, color: "#ffd600", fontSize: "0.95rem" }}>
                            {w.studentName || "Anonymous Student"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <span style={{ fontSize: "1.3rem" }}>{w.country.flagEmoji}</span>
                          <span style={{ fontWeight: 700, color: "white" }}>{w.country.name}</span>
                        </div>
                      </td>
                      <td style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                        {date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}
                      </td>
                      <td style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                        {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 800, color: "#ffd600" }}>{w.correct}/{w.total}</span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              background: "rgba(255, 214, 0, 0.15)",
                              border: "1px solid rgba(255, 214, 0, 0.3)",
                              borderRadius: "6px",
                              padding: "0.15rem 0.5rem",
                              color: "#ffd600",
                              fontWeight: 700,
                            }}
                          >
                            100%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            background: "linear-gradient(135deg, rgba(255, 214, 0, 0.2), rgba(255, 143, 0, 0.2))",
                            border: "1px solid rgba(255, 214, 0, 0.4)",
                            color: "#ffd600",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "100px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                          }}
                        >
                          🏆 WINNER
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

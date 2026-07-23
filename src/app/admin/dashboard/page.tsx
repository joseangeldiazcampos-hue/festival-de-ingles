/**
 * Admin Dashboard — /admin/dashboard
 * Shows overview statistics: total countries, questions, and submissions.
 */

import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  const [countriesCount, questionsCount, attemptsCount, recentAttempts, countries] =
    await Promise.all([
      prisma.country.count(),
      prisma.question.count(),
      prisma.attempt.count(),
      prisma.attempt.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { country: { select: { name: true, flagEmoji: true } } },
      }),
      prisma.country.findMany({
        orderBy: { order: "asc" },
        include: { _count: { select: { questions: true, attempts: true } } },
      }),
    ]);

  const perfectScores = await prisma.attempt.count({ where: { isPerfect: true } });

  const stats = [
    { label: "Countries", value: countriesCount, icon: "🌍", color: "#42a5f5", href: "/admin/countries" },
    { label: "Questions", value: questionsCount, icon: "📝", color: "#ffd600", href: "/admin/countries" },
    { label: "Submissions", value: attemptsCount, icon: "📊", color: "#81c784", href: "/admin/attempts" },
    { label: "Winners (100%)", value: perfectScores, icon: "🏆", color: "#ff8f00", href: "/admin/winners" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.25rem", fontSize: "0.9rem" }}>
          Violence Is Never The Answer — English Festival
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href || "#"}
            className="admin-card"
            style={{ textAlign: "center", textDecoration: "none", display: "block" }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{stat.icon}</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 900, color: stat.color, lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", marginTop: "0.35rem", fontWeight: 600 }}>
              {stat.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid-2col-responsive" style={{ display: "grid", gap: "1.5rem" }}>
        {/* Countries overview */}
        <div className="admin-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "white" }}>
              Countries
            </h2>
            <Link
              href="/admin/countries"
              style={{ fontSize: "0.8rem", color: "#42a5f5", textDecoration: "none" }}
            >
              Manage →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {countries.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>{c.flagEmoji}</span>
                <span style={{ flex: 1, fontSize: "0.9rem", color: "rgba(255,255,255,0.85)" }}>
                  {c.name}
                </span>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
                  {c._count.questions}Q / {c._count.attempts} attempts
                </span>
                <span className={`badge ${c.isActive ? "badge-active" : "badge-inactive"}`}>
                  {c.isActive ? "Active" : "Off"}
                </span>
              </div>
            ))}
            {countries.length === 0 && (
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem", textAlign: "center" }}>
                No countries yet.{" "}
                <Link href="/admin/countries" style={{ color: "#42a5f5" }}>
                  Add one →
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Recent submissions */}
        <div className="admin-card">
          <div style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "white" }}>
              Recent Submissions
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {recentAttempts.map((attempt) => (
              <div
                key={attempt.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>{attempt.country.flagEmoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.85rem", color: "#90caf9", fontWeight: 600 }}>
                    👤 {attempt.studentName || "Anonymous"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>
                    {attempt.country.name} • {new Date(attempt.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: attempt.isPerfect
                      ? "#ffd600"
                      : attempt.correct / attempt.total >= 0.7
                      ? "#81c784"
                      : "#ef9a9a",
                  }}
                >
                  {attempt.correct}/{attempt.total}
                  {attempt.isPerfect && " ⭐"}
                </span>
              </div>
            ))}
            {recentAttempts.length === 0 && (
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem", textAlign: "center" }}>
                No submissions yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

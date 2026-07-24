/**
 * Home page — Shows the three grade group options for students.
 * Students select their grade group to start the quiz.
 */

import Link from "next/link";

const gradeGroups = [
  {
    name: "7th & 8th Grade",
    slug: "7-8",
    emoji: "📚",
    levels: "A1 · A2",
    description: "English Speed Challenge!",
    gradient: "linear-gradient(135deg, #1565c0, #0d47a1)",
  },
  {
    name: "9th to 11th Grade",
    slug: "9-10-11",
    emoji: "🎯",
    levels: "A2 · B1",
    description: "English Speed Challenge!",
    gradient: "linear-gradient(135deg, #e65100, #bf360c)",
  },
  {
    name: "Challenge B2",
    slug: "challenge",
    emoji: "🏆",
    levels: "B2",
    description: "English Communication Challenge!",
    gradient: "linear-gradient(135deg, #b71c1c, #880e4f)",
  },
];

export default function HomePage() {
  return (
    <div className="bg-animated" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "2rem", position: "relative", zIndex: 1, maxWidth: 600, width: "100%" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }} className="animate-fadeInUp">🕊️</div>
        <h1
          className="animate-fadeInUp delay-100"
          style={{ fontSize: "2rem", fontWeight: 900, color: "white", marginBottom: "0.5rem" }}
        >
          Violence Is Never The Answer
        </h1>
        <p
          className="animate-fadeInUp delay-200"
          style={{ color: "rgba(255,255,255,0.6)", marginBottom: "2.5rem" }}
        >
          English Festival Quiz Platform — Select your level
        </p>

        {/* Grade group cards */}
        <div
          className="animate-fadeInUp delay-300"
          style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}
        >
          {gradeGroups.map((group) => (
            <Link
              key={group.slug}
              href={`/${group.slug}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.25rem 1.5rem",
                borderRadius: "16px",
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.12)",
                textDecoration: "none",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "2.5rem" }}>{group.emoji}</span>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ color: "white", fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.15rem" }}>
                  {group.name}
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
                  {group.description}
                </div>
              </div>
              <span
                style={{
                  background: group.gradient,
                  padding: "0.35rem 0.85rem",
                  borderRadius: "100px",
                  color: "white",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                }}
              >
                {group.levels}
              </span>
            </Link>
          ))}
        </div>

        <Link
          href="/admin/login"
          className="animate-fadeInUp delay-400"
          style={{
            display: "inline-block",
            color: "rgba(255,255,255,0.35)",
            fontSize: "0.8rem",
            textDecoration: "none",
          }}
        >
          Admin Panel →
        </Link>
      </div>
    </div>
  );
}

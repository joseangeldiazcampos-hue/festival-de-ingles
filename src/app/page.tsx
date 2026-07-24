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
    gradient: "linear-gradient(135deg, #f472b6, #ec4899)",
    border: "2px solid rgba(244, 114, 182, 0.5)",
  },
  {
    name: "9th to 11th Grade",
    slug: "9-10-11",
    emoji: "🎯",
    levels: "A2 · B1",
    description: "English Speed Challenge!",
    gradient: "linear-gradient(135deg, #38bdf8, #0284c7)",
    border: "2px solid rgba(56, 189, 248, 0.5)",
  },
  {
    name: "Challenge B2",
    slug: "challenge",
    emoji: "🏆",
    levels: "B2",
    description: "English Communication Challenge!",
    gradient: "linear-gradient(135deg, #f0abfc, #38bdf8)",
    border: "2px solid rgba(240, 171, 252, 0.6)",
  },
];

const englishIcons = [
  { emoji: "🇬🇧", top: "10%", left: "5%" },
  { emoji: "🇺🇸", top: "15%", right: "8%" },
  { emoji: "☕", top: "70%", left: "6%" },
  { emoji: "🚌", top: "80%", right: "10%" },
  { emoji: "👑", top: "35%", left: "4%" },
  { emoji: "📚", top: "45%", right: "5%" },
  { emoji: "💬", top: "85%", left: "45%" },
  { emoji: "🎧", top: "5%", left: "48%" },
];

export default function HomePage() {
  return (
    <div className="bg-animated" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      
      {/* Floating English Culture & Language Emojis */}
      {englishIcons.map((icon, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            opacity: 0.35,
            top: icon.top,
            left: icon.left,
            right: icon.right,
            animation: `flag-float ${4 + i * 0.6}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.3}s`,
            zIndex: 1,
            pointerEvents: "none",
            filter: "drop-shadow(0 0 12px rgba(244, 114, 182, 0.4))",
          }}
        >
          {icon.emoji}
        </div>
      ))}

      <div style={{ textAlign: "center", padding: "2rem", position: "relative", zIndex: 3, maxWidth: 600, width: "100%" }}>
        
        {/* Header Badge */}
        <div
          className="animate-fadeInUp"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "rgba(244, 114, 182, 0.18)",
            border: "1px solid rgba(244, 114, 182, 0.4)",
            borderRadius: "100px",
            padding: "0.45rem 1.4rem",
            fontSize: "0.85rem",
            color: "#f472b6",
            fontWeight: 800,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            backdropFilter: "blur(12px)",
            marginBottom: "1rem",
            boxShadow: "0 0 20px rgba(244, 114, 182, 0.3)",
          }}
        >
          <span>🇬🇧 🇺🇸</span>
          <span>English Festival 2026</span>
        </div>

        <h1
          className="animate-fadeInUp delay-100"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
            fontWeight: 900,
            color: "#ffffff",
            marginBottom: "0.5rem",
            textShadow: "0 0 20px rgba(56, 189, 248, 0.6), 0 0 40px rgba(244, 114, 182, 0.5)",
          }}
        >
          Violence Is Never The Answer
        </h1>

        <p
          className="animate-fadeInUp delay-200"
          style={{ color: "rgba(253, 242, 248, 0.9)", fontSize: "1.05rem", marginBottom: "2.5rem", fontWeight: 500 }}
        >
          💬 English Speed & Communication Challenge — Select your level
        </p>

        {/* Grade group cards */}
        <div
          className="animate-fadeInUp delay-300"
          style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "2.5rem" }}
        >
          {gradeGroups.map((group) => (
            <Link
              key={group.slug}
              href={`/${group.slug}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.2rem",
                padding: "1.35rem 1.6rem",
                borderRadius: "20px",
                background: "rgba(6, 31, 23, 0.65)",
                backdropFilter: "blur(20px)",
                border: group.border,
                textDecoration: "none",
                transition: "all 0.3s ease",
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              }}
            >
              <span style={{ fontSize: "2.8rem", filter: "drop-shadow(0 0 10px rgba(255,255,255,0.4))" }}>{group.emoji}</span>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ color: "white", fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.2rem" }}>
                  {group.name}
                </div>
                <div style={{ color: "#7dd3fc", fontSize: "0.9rem", fontWeight: 600 }}>
                  {group.description}
                </div>
              </div>
              <span
                style={{
                  background: group.gradient,
                  padding: "0.45rem 1rem",
                  borderRadius: "100px",
                  color: "white",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                  boxShadow: "0 0 15px rgba(244, 114, 182, 0.4)",
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
            color: "rgba(244, 114, 182, 0.85)",
            fontSize: "0.85rem",
            fontWeight: 700,
            textDecoration: "none",
            letterSpacing: "1px",
          }}
        >
          🔒 Admin Teacher Panel →
        </Link>
      </div>
    </div>
  );
}

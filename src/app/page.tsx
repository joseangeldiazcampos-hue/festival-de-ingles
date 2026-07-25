"use client";

/**
 * Home page — Shows the three grade group options for students.
 * Premium UI redesign: pastel section backgrounds, glassmorphism cards,
 * subtle decorative shapes, English culture icons, hover elevation.
 */

import Link from "next/link";

const gradeGroups = [
  {
    name: "7th & 8th Grade",
    slug: "7-8",
    emoji: "📚",
    levels: "A1 · A2",
    description: "English Speed Challenge",
    // Pastel pink section
    bg: "linear-gradient(160deg, #FCE7F3 0%, #FDF2F8 50%, #FCE4F1 100%)",
    accentColor: "#EC4899",
    accentLight: "#F9A8D4",
    accentBg: "rgba(236, 72, 153, 0.10)",
    textColor: "#9D174D",
    textSub: "#BE185D",
    badgeBg: "rgba(236, 72, 153, 0.12)",
    badgeBorder: "rgba(236, 72, 153, 0.35)",
    levelBg: "linear-gradient(135deg, #EC4899, #F472B6)",
    shadowColor: "rgba(236, 72, 153, 0.22)",
    deco1: "#F9A8D4",
    deco2: "#FBCFE8",
  },
  {
    name: "9th to 11th Grade",
    slug: "9-10-11",
    emoji: "🎯",
    levels: "A2 · B1",
    description: "English Speed Challenge",
    // Pastel blue section
    bg: "linear-gradient(160deg, #E0F2FE 0%, #F0F9FF 50%, #DBEAFE 100%)",
    accentColor: "#0284C7",
    accentLight: "#7DD3FC",
    accentBg: "rgba(2, 132, 199, 0.10)",
    textColor: "#075985",
    textSub: "#0369A1",
    badgeBg: "rgba(2, 132, 199, 0.12)",
    badgeBorder: "rgba(2, 132, 199, 0.35)",
    levelBg: "linear-gradient(135deg, #0284C7, #38BDF8)",
    shadowColor: "rgba(2, 132, 199, 0.22)",
    deco1: "#BAE6FD",
    deco2: "#BFDBFE",
  },
  {
    name: "Challenge B2",
    slug: "challenge",
    emoji: "🏆",
    levels: "B2",
    description: "English Communication Challenge",
    // Pastel green section
    bg: "linear-gradient(160deg, #DCFCE7 0%, #F0FDF4 50%, #D1FAE5 100%)",
    accentColor: "#059669",
    accentLight: "#6EE7B7",
    accentBg: "rgba(5, 150, 105, 0.10)",
    textColor: "#065F46",
    textSub: "#047857",
    badgeBg: "rgba(5, 150, 105, 0.12)",
    badgeBorder: "rgba(5, 150, 105, 0.35)",
    levelBg: "linear-gradient(135deg, #059669, #34D399)",
    shadowColor: "rgba(5, 150, 105, 0.22)",
    deco1: "#A7F3D0",
    deco2: "#BBF7D0",
  },
];

const englishIcons = [
  { emoji: "🇬🇧", top: "8%",  left: "4%",  size: "2.4rem" },
  { emoji: "🇺🇸", top: "12%", right: "5%", size: "2.4rem" },
  { emoji: "☕",   top: "72%", left: "3%",  size: "2rem" },
  { emoji: "🚌",  top: "80%", right: "4%", size: "2rem" },
  { emoji: "👑",  top: "38%", left: "2%",  size: "1.8rem" },
  { emoji: "📖",  top: "48%", right: "3%", size: "1.8rem" },
  { emoji: "💬",  top: "88%", left: "48%", size: "1.6rem" },
  { emoji: "🎧",  top: "4%",  left: "47%", size: "1.8rem" },
  { emoji: "✏️",  top: "60%", right: "5%", size: "1.6rem" },
  { emoji: "🌍",  top: "55%", left: "4%",  size: "1.6rem" },
];

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #F8FAFF 0%, #EEF4FF 40%, #F5F0FF 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Decorative blurred background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw",
          borderRadius: "50%", background: "rgba(244,114,182,0.10)", filter: "blur(60px)",
          animation: "blob-drift 18s ease-in-out infinite alternate",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", right: "-10%", width: "45vw", height: "45vw",
          borderRadius: "50%", background: "rgba(56,189,248,0.10)", filter: "blur(60px)",
          animation: "blob-drift 22s ease-in-out infinite alternate-reverse",
        }} />
        <div style={{
          position: "absolute", top: "40%", left: "30%", width: "35vw", height: "35vw",
          borderRadius: "50%", background: "rgba(52,211,153,0.08)", filter: "blur(70px)",
          animation: "blob-drift 26s ease-in-out infinite alternate",
        }} />
      </div>

      {/* Floating English Culture Icons */}
      {englishIcons.map((icon, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            fontSize: icon.size,
            opacity: 0.18,
            top: icon.top,
            left: (icon as { left?: string }).left,
            right: (icon as { right?: string }).right,
            animation: `icon-float ${5 + i * 0.7}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.4}s`,
            zIndex: 1,
            pointerEvents: "none",
            filter: "grayscale(0%) drop-shadow(0 2px 6px rgba(0,0,0,0.08))",
          }}
        >
          {icon.emoji}
        </div>
      ))}

      {/* Main content */}
      <div style={{
        textAlign: "center",
        padding: "clamp(1.5rem, 4vw, 3rem) 1.25rem",
        position: "relative",
        zIndex: 5,
        maxWidth: 580,
        width: "100%",
      }}>
        
        {/* Festival Badge */}
        <div
          className="animate-fadeInUp"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "white",
            border: "1px solid rgba(236,72,153,0.25)",
            borderRadius: "100px",
            padding: "0.5rem 1.35rem",
            fontSize: "0.8rem",
            color: "#BE185D",
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            boxShadow: "0 2px 16px rgba(236,72,153,0.14), 0 1px 4px rgba(0,0,0,0.06)",
            marginBottom: "1.25rem",
          }}
        >
          <span>🇬🇧</span>
          <span>English Festival 2026</span>
          <span>🇺🇸</span>
        </div>

        {/* Title */}
        <h1
          className="animate-fadeInUp delay-100"
          style={{
            fontSize: "clamp(2rem, 6vw, 3rem)",
            fontWeight: 900,
            color: "#1E293B",
            marginBottom: "0.5rem",
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
          }}
        >
          Violence Is Never{" "}
          <span style={{
            background: "linear-gradient(135deg, #EC4899, #8B5CF6, #0284C7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            The Answer
          </span>
        </h1>

        <p
          className="animate-fadeInUp delay-200"
          style={{
            color: "#64748B",
            fontSize: "1rem",
            marginBottom: "2.5rem",
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          💬 English Speed & Communication Challenge — Select your level to begin
        </p>

        {/* Grade group cards — each with its own full pastel background */}
        <div
          className="animate-fadeInUp delay-300"
          style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}
        >
          {gradeGroups.map((group, idx) => (
            <Link
              key={group.slug}
              href={`/${group.slug}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.1rem",
                padding: "1.35rem 1.5rem",
                borderRadius: "20px",
                background: group.bg,
                border: `1.5px solid ${group.accentBg.replace("0.10", "0.25")}`,
                textDecoration: "none",
                transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease",
                cursor: "pointer",
                boxShadow: `0 4px 20px ${group.shadowColor}, 0 1px 4px rgba(0,0,0,0.06)`,
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px) scale(1.01)";
                (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 36px ${group.shadowColor}, 0 4px 12px rgba(0,0,0,0.08)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${group.shadowColor}, 0 1px 4px rgba(0,0,0,0.06)`;
              }}
            >
              {/* Decorative background circle */}
              <div style={{
                position: "absolute",
                right: "-20px",
                bottom: "-20px",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: group.accentBg,
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute",
                right: "60px",
                top: "-30px",
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: group.accentBg,
                pointerEvents: "none",
                opacity: 0.6,
              }} />

              {/* Emoji with soft glowing bg */}
              <div style={{
                width: "58px",
                height: "58px",
                borderRadius: "16px",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                flexShrink: 0,
                boxShadow: `0 4px 14px ${group.shadowColor}`,
                border: `1px solid ${group.deco2}`,
              }}>
                {group.emoji}
              </div>

              {/* Text */}
              <div style={{ flex: 1, textAlign: "left", position: "relative", zIndex: 1 }}>
                <div style={{ color: group.textColor, fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.2rem", letterSpacing: "-0.2px" }}>
                  {group.name}
                </div>
                <div style={{ color: group.textSub, fontSize: "0.85rem", fontWeight: 500, opacity: 0.85 }}>
                  {group.description}
                </div>
              </div>

              {/* Level badge */}
              <span
                style={{
                  background: group.levelBg,
                  padding: "0.5rem 1.1rem",
                  borderRadius: "100px",
                  color: "white",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                  boxShadow: `0 4px 14px ${group.shadowColor}`,
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {group.levels}
              </span>
            </Link>
          ))}
        </div>

        {/* Admin link */}
        <Link
          href="/admin/login"
          className="animate-fadeInUp delay-400"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "#94A3B8",
            fontSize: "0.82rem",
            fontWeight: 600,
            textDecoration: "none",
            letterSpacing: "0.5px",
            padding: "0.5rem 1rem",
            borderRadius: "100px",
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(0,0,0,0.06)",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          🔒 Admin Teacher Panel →
        </Link>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes blob-drift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(3%, 4%) scale(1.05); }
        }
        @keyframes icon-float {
          0% { transform: translateY(0) rotate(-3deg); }
          100% { transform: translateY(-12px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
}

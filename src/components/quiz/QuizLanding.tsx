"use client";

/**
 * QuizLanding — The country welcome/landing screen
 * Asks student for their full name (First and Last Name) with validation.
 * Shows a full-screen country background image, flag, country name, peace theme, and Start button.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { validateStudentName } from "@/lib/nameValidator";

interface Props {
  name: string;
  slug: string;
  flagEmoji: string;
  monument: string;
  questionCount: number;
}

const COUNTRY_IMAGES: Record<string, string> = {
  canada: "/bg_canada.png",
  japan: "/bg_japan.png",
  italy: "/bg_italy.png",
  "united-states": "/bg_usa.png",
  mexico: "/bg_mexico.png",
};

const COUNTRY_ACCENTS: Record<string, string> = {
  canada:          "rgba(220, 30, 30, 0.6)",
  japan:           "rgba(220, 60, 80, 0.6)",
  italy:           "rgba(0, 146, 70, 0.6)",
  "united-states": "rgba(60, 100, 220, 0.6)",
  mexico:          "rgba(0, 130, 60, 0.6)",
};

const decorativeIcons = [
  { emoji: "📚", delay: "0s",   top: "10%", left: "5%"  },
  { emoji: "🕊️", delay: "0.5s", top: "15%", right: "8%" },
  { emoji: "🌍", delay: "1s",   bottom: "20%", left: "4%"  },
  { emoji: "💬", delay: "1.5s", bottom: "15%", right: "6%" },
  { emoji: "✏️", delay: "2s",   top: "40%",  left: "2%"  },
  { emoji: "🤝", delay: "2.5s", top: "35%",  right: "3%" },
];

export default function QuizLanding({ name, slug, flagEmoji, monument, questionCount }: Props) {
  const router = useRouter();
  const [studentName, setStudentName] = useState("");
  const [nameError, setNameError] = useState("");

  const bgImage = COUNTRY_IMAGES[slug] ?? "/bg_default.png";
  const accentColor = COUNTRY_ACCENTS[slug] ?? "rgba(21, 101, 192, 0.6)";

  const handleStart = () => {
    const validation = validateStudentName(studentName);
    if (!validation.isValid) {
      setNameError(validation.error || "Please enter your real full name.");
      return;
    }
    setNameError("");
    const cleanName = studentName.trim();
    if (typeof window !== "undefined") {
      localStorage.setItem("quiz_student_name", cleanName);
    }
    router.push(`/${slug}/quiz?name=${encodeURIComponent(cleanName)}`);
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "#0a0e1a" }}>

      {/* ── Country background image ── */}
      <>
        <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
          <Image
            src={bgImage}
            alt={`${name} landscape`}
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1,
            background: `linear-gradient(
              to bottom,
              rgba(10, 14, 26, 0.55) 0%,
              rgba(10, 14, 26, 0.40) 30%,
              rgba(10, 14, 26, 0.70) 70%,
              rgba(10, 14, 26, 0.90) 100%
            )`,
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1,
            background: `radial-gradient(ellipse at 50% 100%, ${accentColor} 0%, transparent 70%)`,
          }}
        />
      </>

      {/* Floating decorative icons */}
      {decorativeIcons.map((icon, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            opacity: 0.20,
            animation: `flag-float ${4 + i * 0.5}s ease-in-out infinite`,
            animationDelay: icon.delay,
            top: icon.top,
            left: (icon as { left?: string }).left,
            right: (icon as { right?: string }).right,
            bottom: (icon as { bottom?: string }).bottom,
            zIndex: 2,
            pointerEvents: "none",
            userSelect: "none",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))",
          }}
        >
          {icon.emoji}
        </div>
      ))}

      {/* ── Main content ── */}
      <div className="country-hero" style={{ position: "relative", zIndex: 3 }}>

        {/* Festival badge */}
        <div
          className="animate-fadeInUp delay-100"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(0,0,0,0.45)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "100px",
            padding: "0.4rem 1.2rem",
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.85)",
            fontWeight: 600,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            backdropFilter: "blur(10px)",
          }}
        >
          <span>🎓</span>
          <span>English Festival Quiz</span>
        </div>

        {/* Flag */}
        <div
          className="flag-display animate-fadeInUp delay-200"
          style={{ filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.7))" }}
        >
          {flagEmoji}
        </div>

        {/* Country name */}
        <h1
          className="country-name animate-fadeInUp delay-300"
          style={{ textShadow: "0 4px 32px rgba(0,0,0,0.8)" }}
        >
          {name}
        </h1>

        {/* Theme badge */}
        <div
          className="theme-badge animate-fadeInUp delay-400"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
            boxShadow: `0 0 24px ${accentColor}`,
          }}
        >
          🕊️ &nbsp;Violence Is Never The Answer
        </div>

        {/* Monument info */}
        {monument && (
          <div
            className="monument-text animate-fadeInUp delay-400"
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)",
              padding: "0.35rem 1rem",
              borderRadius: "100px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span>📍</span>
            <span>{monument}</span>
          </div>
        )}

        {/* Info card */}
        <div
          className="animate-fadeInUp delay-500"
          style={{
            padding: "1.5rem 2rem",
            textAlign: "center",
            maxWidth: 440,
            width: "100%",
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "20px",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem", lineHeight: 1.7, margin: "0 0 1.25rem 0" }}>
            Read the text carefully, then answer all{" "}
            <strong style={{ color: "white" }}>{questionCount} questions</strong>.
          </p>

          {/* Student Name Input */}
          <div style={{ textAlign: "left" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#ffd600",
                marginBottom: "0.4rem",
                letterSpacing: "0.5px",
              }}
            >
              👤 Enter Your Full Name (First & Last Name) *
            </label>
            <input
              type="text"
              className="admin-input"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                if (nameError) setNameError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleStart();
              }}
              placeholder="e.g. Juan Pérez"
              style={{
                fontSize: "1.05rem",
                padding: "0.85rem 1.1rem",
                background: "rgba(255,255,255,0.10)",
                border: nameError ? "1px solid #ef5350" : "1px solid rgba(255,255,255,0.25)",
              }}
            />
            {nameError && (
              <p style={{ color: "#ef5350", fontSize: "0.8rem", marginTop: "0.4rem", margin: "0.4rem 0 0 0" }}>
                ⚠️ {nameError}
              </p>
            )}
          </div>
        </div>

        {/* Start button */}
        <button
          className="btn-start animate-fadeInUp delay-500"
          onClick={handleStart}
          style={{ fontSize: "1.1rem", padding: "1.1rem 3rem" }}
        >
          Start Quiz →
        </button>

        {/* Peace quote */}
        <p
          className="animate-fadeInUp"
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.8rem",
            fontStyle: "italic",
            marginTop: "0.5rem",
            animationDelay: "0.7s",
            opacity: 0,
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          }}
        >
          "An eye for an eye only ends up making the whole world blind." — Gandhi
        </p>
      </div>
    </div>
  );
}

"use client";

/**
 * QuizLanding — The grade group welcome/landing screen
 * Requires student to enter their full name AND select their grade before starting.
 * Shows the quiz theme, CEFR levels, and a premium UI.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateStudentName } from "@/lib/nameValidator";

interface Props {
  name: string;
  slug: string;
  grades: string;      // "7,8" or "9,10,11" or "all"
  levels: string;      // "A1,A2" or "A2,B1" or "B2"
  emoji: string;
  description: string;
  questionCount: number;
}

const GRADE_LABELS: Record<string, string> = {
  "7": "7th Grade",
  "8": "8th Grade",
  "9": "9th Grade",
  "10": "10th Grade",
  "11": "11th Grade",
};

const ALL_GRADES = ["7", "8", "9", "10", "11"];

const LEVEL_COLORS: Record<string, string> = {
  A1: "#4caf50",
  A2: "#8bc34a",
  B1: "#ff9800",
  B2: "#f44336",
};

const decorativeIcons = [
  { emoji: "📚", delay: "0s",   top: "10%", left: "5%"  },
  { emoji: "🕊️", delay: "0.5s", top: "15%", right: "8%" },
  { emoji: "🌍", delay: "1s",   bottom: "20%", left: "4%"  },
  { emoji: "💬", delay: "1.5s", bottom: "15%", right: "6%" },
  { emoji: "✏️", delay: "2s",   top: "40%",  left: "2%"  },
  { emoji: "🤝", delay: "2.5s", top: "35%",  right: "3%" },
];

export default function QuizLanding({ name, slug, grades, levels, emoji, description, questionCount }: Props) {
  const router = useRouter();
  const [studentName, setStudentName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [nameError, setNameError] = useState("");
  const [gradeError, setGradeError] = useState("");

  const availableGrades = grades === "all" ? ALL_GRADES : grades.split(",");
  const levelList = levels.split(",");

  const handleStart = () => {
    let hasError = false;

    // Validate name
    const validation = validateStudentName(studentName);
    if (!validation.isValid) {
      setNameError(validation.error || "Please enter your real full name.");
      hasError = true;
    } else {
      setNameError("");
    }

    // Validate grade selection
    if (!selectedGrade) {
      setGradeError("⚠️ You must select your grade before starting the quiz.");
      hasError = true;
    } else {
      setGradeError("");
    }

    if (hasError) return;

    const cleanName = studentName.trim();
    if (typeof window !== "undefined") {
      localStorage.setItem("quiz_student_name", cleanName);
      localStorage.setItem("quiz_student_grade", selectedGrade);
    }
    router.push(`/${slug}/quiz?name=${encodeURIComponent(cleanName)}&grade=${selectedGrade}`);
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "#0a0e1a" }}>

      {/* ── Animated gradient background ── */}
      <div className="bg-animated" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          background: "radial-gradient(ellipse at 50% 100%, rgba(21, 101, 192, 0.4) 0%, transparent 70%)",
        }}
      />

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

        {/* Emoji icon */}
        <div
          className="flag-display animate-fadeInUp delay-200"
          style={{ filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.7))" }}
        >
          {emoji}
        </div>

        {/* Grade group name */}
        <h1
          className="country-name animate-fadeInUp delay-300"
          style={{ textShadow: "0 4px 32px rgba(0,0,0,0.8)" }}
        >
          {name}
        </h1>

        {/* CEFR Level badges */}
        <div
          className="animate-fadeInUp delay-300"
          style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center" }}
        >
          {levelList.map((level) => (
            <span
              key={level}
              style={{
                background: `${LEVEL_COLORS[level] || "#1565c0"}22`,
                border: `1px solid ${LEVEL_COLORS[level] || "#1565c0"}88`,
                color: LEVEL_COLORS[level] || "#1565c0",
                padding: "0.3rem 1rem",
                borderRadius: "100px",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "1px",
              }}
            >
              Level {level}
            </span>
          ))}
        </div>

        {/* Theme badge */}
        <div
          className="theme-badge animate-fadeInUp delay-400"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 24px rgba(21, 101, 192, 0.4)",
          }}
        >
          🕊️ &nbsp;Violence Is Never The Answer
        </div>

        {/* Info card with name input + grade selector */}
        <div
          className="animate-fadeInUp delay-500"
          style={{
            padding: "1.5rem 2rem",
            textAlign: "center",
            maxWidth: 480,
            width: "100%",
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "20px",
          }}
        >
          {description && (
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", marginBottom: "1.25rem", lineHeight: 1.6 }}>
              {description}
            </p>
          )}

          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem", lineHeight: 1.7, margin: "0 0 1.25rem 0" }}>
            Read the text carefully, then answer all{" "}
            <strong style={{ color: "white" }}>{questionCount} questions</strong>.
          </p>

          {/* Student Name Input */}
          <div style={{ textAlign: "left", marginBottom: "1.25rem" }}>
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

          {/* Grade Selector — REQUIRED */}
          <div style={{ textAlign: "left" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#ffd600",
                marginBottom: "0.5rem",
                letterSpacing: "0.5px",
              }}
            >
              🎓 Select Your Grade *
            </label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {availableGrades.map((grade) => (
                <button
                  key={grade}
                  onClick={() => {
                    setSelectedGrade(grade);
                    if (gradeError) setGradeError("");
                  }}
                  style={{
                    flex: "1 1 auto",
                    minWidth: "80px",
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    border: selectedGrade === grade
                      ? "2px solid #42a5f5"
                      : gradeError
                      ? "2px solid #ef5350"
                      : "1px solid rgba(255,255,255,0.2)",
                    background: selectedGrade === grade
                      ? "rgba(21, 101, 192, 0.45)"
                      : "rgba(255,255,255,0.08)",
                    color: selectedGrade === grade ? "white" : "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: selectedGrade === grade ? 700 : 500,
                    transition: "all 0.2s ease",
                    boxShadow: selectedGrade === grade ? "0 0 16px rgba(33,150,243,0.4)" : "none",
                  }}
                >
                  {GRADE_LABELS[grade] || `${grade}th Grade`}
                </button>
              ))}
            </div>
            {gradeError && (
              <p style={{ color: "#ef5350", fontSize: "0.8rem", margin: "0.5rem 0 0 0", fontWeight: 600 }}>
                {gradeError}
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
          &quot;An eye for an eye only ends up making the whole world blind.&quot; — Gandhi
        </p>
      </div>
    </div>
  );
}

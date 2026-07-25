"use client";

/**
 * QuizLanding — The grade group welcome/landing screen
 * Premium UI: pastel section palette per grade group, glassmorphism card,
 * English culture icons, floating decorative shapes, volume modal.
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

// Slug-based theme palette — matches home page pastel sections
const SLUG_THEMES: Record<string, {
  bg: string;
  bgCard: string;
  accent: string;
  accentLight: string;
  textDark: string;
  textMid: string;
  border: string;
  shadow: string;
  gradientBtn: string;
  levelGradient: string;
  deco1: string;
  deco2: string;
}> = {
  "7-8": {
    bg: "linear-gradient(160deg, #FCE7F3 0%, #FDF2F8 55%, #FECDD3 100%)",
    bgCard: "rgba(255, 255, 255, 0.80)",
    accent: "#EC4899",
    accentLight: "#F9A8D4",
    textDark: "#831843",
    textMid: "#BE185D",
    border: "rgba(236,72,153,0.22)",
    shadow: "rgba(236,72,153,0.15)",
    gradientBtn: "linear-gradient(135deg, #EC4899, #F472B6)",
    levelGradient: "linear-gradient(135deg, #EC4899, #F472B6)",
    deco1: "rgba(244,114,182,0.14)",
    deco2: "rgba(251,207,232,0.35)",
  },
  "9-10-11": {
    bg: "linear-gradient(160deg, #E0F2FE 0%, #F0F9FF 55%, #DBEAFE 100%)",
    bgCard: "rgba(255, 255, 255, 0.80)",
    accent: "#0284C7",
    accentLight: "#7DD3FC",
    textDark: "#0C4A6E",
    textMid: "#0369A1",
    border: "rgba(2,132,199,0.22)",
    shadow: "rgba(2,132,199,0.15)",
    gradientBtn: "linear-gradient(135deg, #0284C7, #38BDF8)",
    levelGradient: "linear-gradient(135deg, #0284C7, #38BDF8)",
    deco1: "rgba(56,189,248,0.14)",
    deco2: "rgba(186,230,253,0.35)",
  },
  "challenge": {
    bg: "linear-gradient(160deg, #DCFCE7 0%, #F0FDF4 55%, #D1FAE5 100%)",
    bgCard: "rgba(255, 255, 255, 0.80)",
    accent: "#059669",
    accentLight: "#6EE7B7",
    textDark: "#064E3B",
    textMid: "#047857",
    border: "rgba(5,150,105,0.22)",
    shadow: "rgba(5,150,105,0.15)",
    gradientBtn: "linear-gradient(135deg, #059669, #34D399)",
    levelGradient: "linear-gradient(135deg, #059669, #34D399)",
    deco1: "rgba(52,211,153,0.14)",
    deco2: "rgba(167,243,208,0.35)",
  },
};

const DEFAULT_THEME = SLUG_THEMES["9-10-11"];

const decorativeIcons = [
  { emoji: "🇬🇧", delay: "0s",   top: "8%",  left: "5%"  },
  { emoji: "🇺🇸", delay: "0.5s", top: "12%", right: "6%" },
  { emoji: "☕",  delay: "1s",   bottom: "22%", left: "4%"  },
  { emoji: "🚌", delay: "1.5s", bottom: "15%", right: "6%" },
  { emoji: "👑", delay: "2s",   top: "40%",  left: "3%"  },
  { emoji: "📚", delay: "2.5s", top: "35%",  right: "4%" },
  { emoji: "💬", delay: "3s",   bottom: "8%", left: "45%" },
  { emoji: "🎧", delay: "0.8s", top: "5%",   left: "48%" },
];

export default function QuizLanding({ name, slug, grades, levels, emoji, description, questionCount }: Props) {
  const router = useRouter();
  const [studentName, setStudentName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [nameError, setNameError] = useState("");
  const [gradeError, setGradeError] = useState("");
  const [showVolumeModal, setShowVolumeModal] = useState(false);

  const theme = SLUG_THEMES[slug] ?? DEFAULT_THEME;
  const availableGrades = grades === "all" ? ALL_GRADES : grades.split(",");
  const levelList = levels.split(",");

  const handleStart = () => {
    let hasError = false;
    const validation = validateStudentName(studentName);
    if (!validation.isValid) {
      setNameError(validation.error || "Please enter your real full name.");
      hasError = true;
    } else {
      setNameError("");
    }
    if (!selectedGrade) {
      setGradeError("⚠️ You must select your grade before starting the quiz.");
      hasError = true;
    } else {
      setGradeError("");
    }
    if (hasError) return;
    setShowVolumeModal(true);
  };

  const confirmStart = () => {
    const cleanName = studentName.trim();
    if (typeof window !== "undefined") {
      localStorage.setItem("quiz_student_name", cleanName);
      localStorage.setItem("quiz_student_grade", selectedGrade);
      localStorage.removeItem(`completed_${slug}`);
    }
    router.push(`/${slug}/quiz?name=${encodeURIComponent(cleanName)}&grade=${selectedGrade}`);
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "#F8FAFF", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Volume Modal */}
      {showVolumeModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
          <div style={{ maxWidth: 400, width: "100%", background: "white", border: `2px solid ${theme.border}`, borderRadius: "28px", padding: "2rem 1.75rem", textAlign: "center", boxShadow: `0 24px 60px ${theme.shadow}, 0 8px 24px rgba(0,0,0,0.12)` }}>
            <div style={{ fontSize: "4.5rem", marginBottom: "0.5rem" }}>🔊 🎧</div>
            <h2 style={{ color: theme.textDark, fontSize: "1.75rem", fontWeight: 900, margin: "0 0 0.5rem 0", letterSpacing: "-0.5px" }}>
              ¡Sube el volumen al 100%!
            </h2>
            <p style={{ color: theme.textMid, fontSize: "1.05rem", fontWeight: 700, margin: "0 0 1.5rem 0" }}>
              🎧 Para escuchar el audio del quiz.
            </p>
            <button
              onClick={confirmStart}
              style={{
                width: "100%",
                padding: "1.1rem",
                background: theme.gradientBtn,
                border: "none",
                borderRadius: "100px",
                color: "white",
                fontSize: "1.1rem",
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: `0 8px 28px ${theme.shadow}`,
              }}
            >
              🔊 ¡Listo! Continuar →
            </button>
          </div>
        </div>
      )}

      {/* Full-page pastel gradient background for this grade group */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: theme.bg }} />

      {/* Blurred background blobs */}
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-15%", right: "-10%", width: "55vw", height: "55vw", borderRadius: "50%", background: theme.deco1, filter: "blur(70px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: "45vw", height: "45vw", borderRadius: "50%", background: theme.deco2, filter: "blur(60px)" }} />
      </div>

      {/* Floating English Culture Icons */}
      {decorativeIcons.map((icon, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)",
            opacity: 0.18,
            animation: `icon-float-land ${4.5 + i * 0.6}s ease-in-out infinite`,
            animationDirection: i % 2 === 0 ? "alternate" : "alternate-reverse",
            animationDelay: icon.delay,
            top: icon.top,
            left: (icon as { left?: string }).left,
            right: (icon as { right?: string }).right,
            bottom: (icon as { bottom?: string }).bottom,
            zIndex: 2,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {icon.emoji}
        </div>
      ))}

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 5, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(1.5rem, 4vw, 2.5rem) 1.25rem", gap: "1.5rem", width: "100%" }}>

        {/* Festival Badge */}
        <div
          className="animate-fadeInUp delay-100"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "white",
            border: `1px solid ${theme.border}`,
            borderRadius: "100px",
            padding: "0.4rem 1.2rem",
            fontSize: "0.75rem",
            color: theme.textMid,
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            boxShadow: `0 2px 12px ${theme.shadow}`,
          }}
        >
          <span>🎓</span>
          <span>English Festival Quiz</span>
        </div>

        {/* Emoji */}
        <div
          className="animate-fadeInUp delay-200"
          style={{
            fontSize: "clamp(4rem, 14vw, 7rem)",
            lineHeight: 1,
            filter: `drop-shadow(0 8px 24px ${theme.shadow})`,
            animation: "flag-float 4s ease-in-out infinite",
          }}
        >
          {emoji}
        </div>

        {/* Grade group name */}
        <h1
          className="animate-fadeInUp delay-300"
          style={{
            fontSize: "clamp(2rem, 7vw, 3.5rem)",
            fontWeight: 900,
            color: theme.textDark,
            textAlign: "center",
            letterSpacing: "-0.5px",
            lineHeight: 1.1,
            margin: 0,
          }}
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
                background: theme.levelGradient,
                color: "white",
                padding: "0.35rem 1.1rem",
                borderRadius: "100px",
                fontSize: "0.82rem",
                fontWeight: 800,
                letterSpacing: "1px",
                boxShadow: `0 4px 12px ${theme.shadow}`,
              }}
            >
              Level {level}
            </span>
          ))}
        </div>

        {/* Theme badge */}
        <div
          className="animate-fadeInUp delay-400"
          style={{
            background: "white",
            border: `1px solid ${theme.border}`,
            borderRadius: "100px",
            padding: "0.5rem 1.35rem",
            fontSize: "0.82rem",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: theme.textMid,
            boxShadow: `0 2px 12px ${theme.shadow}`,
          }}
        >
          🕊️ &nbsp;Violence Is Never The Answer
        </div>

        {/* Info card */}
        <div
          className="animate-fadeInUp delay-500"
          style={{
            padding: "1.75rem 2rem",
            textAlign: "center",
            maxWidth: 480,
            width: "100%",
            background: "white",
            border: `1.5px solid ${theme.border}`,
            borderRadius: "24px",
            boxShadow: `0 8px 32px ${theme.shadow}, 0 2px 8px rgba(0,0,0,0.06)`,
          }}
        >
          {description && (
            <p style={{ color: theme.textMid, fontSize: "0.88rem", marginBottom: "1rem", lineHeight: 1.6, fontWeight: 600 }}>
              {description}
            </p>
          )}

          <p style={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.7, margin: "0 0 1.25rem 0" }}>
            Read the text carefully, then answer all{" "}
            <strong style={{ color: theme.textDark }}>{questionCount} questions</strong>.
          </p>

          {/* Name input */}
          <div style={{ textAlign: "left", marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: theme.textMid, marginBottom: "0.4rem", letterSpacing: "0.3px" }}>
              👤 Full Name (First & Last) *
            </label>
            <input
              type="text"
              className="admin-input"
              value={studentName}
              onChange={(e) => { setStudentName(e.target.value); if (nameError) setNameError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleStart(); }}
              placeholder="e.g. Juan Pérez"
              style={{
                fontSize: "1rem",
                padding: "0.85rem 1.1rem",
                background: "rgba(248,250,252,1)",
                border: nameError ? "1.5px solid #EF4444" : `1.5px solid ${theme.border}`,
                borderRadius: "12px",
                color: "#1E293B",
                outline: "none",
                width: "100%",
              }}
            />
            {nameError && (
              <p style={{ color: "#EF4444", fontSize: "0.78rem", marginTop: "0.4rem" }}>⚠️ {nameError}</p>
            )}
          </div>

          {/* Grade selector */}
          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: theme.textMid, marginBottom: "0.5rem", letterSpacing: "0.3px" }}>
              🎓 Select Your Grade *
            </label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {availableGrades.map((grade) => (
                <button
                  key={grade}
                  onClick={() => { setSelectedGrade(grade); if (gradeError) setGradeError(""); }}
                  style={{
                    flex: "1 1 auto",
                    minWidth: "80px",
                    padding: "0.75rem 0.75rem",
                    borderRadius: "12px",
                    border: selectedGrade === grade
                      ? `2px solid ${theme.accent}`
                      : gradeError
                      ? "1.5px solid #EF4444"
                      : `1.5px solid ${theme.border}`,
                    background: selectedGrade === grade ? theme.gradientBtn : "rgba(248,250,252,1)",
                    color: selectedGrade === grade ? "white" : theme.textMid,
                    cursor: "pointer",
                    fontSize: "0.88rem",
                    fontWeight: selectedGrade === grade ? 800 : 500,
                    transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                    boxShadow: selectedGrade === grade ? `0 4px 16px ${theme.shadow}` : "none",
                  }}
                >
                  {GRADE_LABELS[grade] || `${grade}th Grade`}
                </button>
              ))}
            </div>
            {gradeError && (
              <p style={{ color: "#EF4444", fontSize: "0.78rem", margin: "0.5rem 0 0 0", fontWeight: 600 }}>{gradeError}</p>
            )}
          </div>
        </div>

        {/* Start button */}
        <button
          className="btn-start animate-fadeInUp delay-500"
          onClick={handleStart}
          style={{
            fontSize: "1.1rem",
            padding: "1.1rem 3.5rem",
            background: theme.gradientBtn,
            border: "none",
            borderRadius: "100px",
            color: "white",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: `0 8px 28px ${theme.shadow}`,
            letterSpacing: "0.3px",
            transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-3px) scale(1.03)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
          }}
        >
          Start Quiz →
        </button>

        {/* Peace quote */}
        <p
          className="animate-fadeInUp"
          style={{
            color: theme.textMid,
            opacity: 0.55,
            fontSize: "0.78rem",
            fontStyle: "italic",
            animationDelay: "0.7s",
            textAlign: "center",
            maxWidth: 360,
          }}
        >
          &quot;An eye for an eye only ends up making the whole world blind.&quot; — Gandhi
        </p>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes icon-float-land {
          0% { transform: translateY(0) rotate(-4deg); }
          100% { transform: translateY(-14px) rotate(4deg); }
        }
        @keyframes flag-float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
}

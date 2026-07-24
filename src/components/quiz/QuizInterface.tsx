"use client";

/**
 * QuizInterface — The full interactive quiz component
 * - Supports grade-group-based quizzes with CEFR levels
 * - Handles both multiple-choice and open-ended (bonus) questions
 * - Reads student name and grade from URL search params or localStorage
 * - On submit, sends studentName, studentGrade, answers, and bonusAnswers to /api/quiz/submit
 * - Shows success message only — never shows score to student
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FireworksCanvas from "@/components/quiz/FireworksCanvas";
import WinnerVictoryScreen from "@/components/quiz/WinnerVictoryScreen";

interface Question {
  id: string;
  text: string;
  type: string;     // "choice" | "open"
  level: string;    // "A1" | "A2" | "B1" | "B2"
  isBonus: boolean;
  optionA: string | null;
  optionB: string | null;
  optionC: string | null;
  optionD: string | null;
  order: number;
}

interface QuizData {
  id: string;
  name: string;
  slug: string;
  emoji?: string;
  levels: string;
  description?: string;
  questions: Question[];
}

type QuizState = "loading" | "error" | "quiz" | "submitting" | "success";

const OPTIONS = ["A", "B", "C", "D"] as const;

const LEVEL_COLORS: Record<string, string> = {
  A1: "#4caf50",
  A2: "#8bc34a",
  B1: "#ff9800",
  B2: "#f44336",
};

const LEVEL_BG: Record<string, string> = {
  A1: "rgba(76, 175, 80, 0.15)",
  A2: "rgba(139, 195, 58, 0.15)",
  B1: "rgba(255, 152, 0, 0.15)",
  B2: "rgba(244, 67, 54, 0.15)",
};

function getOptionText(q: Question, opt: string): string {
  if (opt === "A") return q.optionA ?? "";
  if (opt === "B") return q.optionB ?? "";
  if (opt === "C") return q.optionC ?? "";
  return q.optionD ?? "";
}

export default function QuizInterface({ gradeGroupSlug }: { gradeGroupSlug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState<QuizState>("loading");
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [studentName, setStudentName] = useState<string>("");
  const [studentGrade, setStudentGrade] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [bonusAnswers, setBonusAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");
  const [isPerfectScore, setIsPerfectScore] = useState<boolean>(false);

  // Separate questions by type
  const choiceQuestions = quizData?.questions.filter(q => q.type === "choice" && !q.isBonus) ?? [];
  const bonusQuestions = quizData?.questions.filter(q => q.isBonus || q.type === "open") ?? [];
  const allDisplayQuestions = [...choiceQuestions, ...bonusQuestions];

  const currentQuestion = allDisplayQuestions[currentIndex];
  const totalQuestions = allDisplayQuestions.length;
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  const choiceAnsweredAll = choiceQuestions.every((q) => answers[q.id]);
  const bonusAnsweredAll = bonusQuestions.every((q) => bonusAnswers[q.id]?.trim());
  const answeredAll = choiceAnsweredAll && bonusAnsweredAll;

  const isCurrentChoice = currentQuestion && currentQuestion.type === "choice" && !currentQuestion.isBonus;
  const currentAnswer = currentQuestion
    ? isCurrentChoice
      ? answers[currentQuestion.id]
      : bonusAnswers[currentQuestion.id]
    : undefined;

  // Retrieve student name and grade on mount
  useEffect(() => {
    let name = searchParams.get("name") || "";
    let grade = searchParams.get("grade") || "";

    if (!name && typeof window !== "undefined") {
      name = localStorage.getItem("quiz_student_name") || "";
    }
    if (!grade && typeof window !== "undefined") {
      grade = localStorage.getItem("quiz_student_grade") || "";
    }

    if (!name || !grade) {
      router.push(`/${gradeGroupSlug}`);
      return;
    }
    setStudentName(name);
    setStudentGrade(grade);
  }, [gradeGroupSlug, searchParams, router]);

  // Fetch quiz data on mount
  useEffect(() => {
    fetch(`/api/quiz/${gradeGroupSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Quiz not available");
        return res.json();
      })
      .then((data: QuizData) => {
        setQuizData(data);
        setState("quiz");
      })
      .catch((err) => {
        setError(err.message);
        setState("error");
      });
  }, [gradeGroupSlug]);

  const handleSelect = useCallback(
    (option: string) => {
      if (!currentQuestion) return;
      if (isCurrentChoice) {
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
      }
    },
    [currentQuestion, isCurrentChoice]
  );

  const handleBonusInput = useCallback(
    (value: string) => {
      if (!currentQuestion) return;
      setBonusAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    },
    [currentQuestion]
  );

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmit = async () => {
    if (!quizData || !answeredAll) return;
    setState("submitting");

    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gradeGroupSlug,
          studentName,
          studentGrade,
          answers,
          bonusAnswers: Object.keys(bonusAnswers).length > 0 ? bonusAnswers : undefined,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Submission failed");
      }

      if (resData.isPerfect || (resData.correct && resData.correct === resData.total)) {
        setIsPerfectScore(true);
      }

      setState("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
      setState("quiz");
    }
  };

  // Floating decorative icons
  const floatingIcons = ["📚", "🕊️", "🌍", "✏️", "🤝"];

  // Shared Background Layout Wrapper
  const renderBackground = () => (
    <>
      <div className="bg-animated" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          background: `linear-gradient(
            to bottom,
            rgba(10, 14, 26, 0.75) 0%,
            rgba(10, 14, 26, 0.65) 40%,
            rgba(10, 14, 26, 0.85) 80%,
            rgba(10, 14, 26, 0.96) 100%
          )`,
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          background: "radial-gradient(ellipse at 50% 0%, rgba(21, 101, 192, 0.35) 0%, transparent 65%)",
        }}
      />
      {/* Floating emojis */}
      {floatingIcons.map((emoji, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            opacity: 0.20,
            animation: `flag-float ${4 + i * 0.7}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
            top: `${12 + i * 16}%`,
            left: i % 2 === 0 ? `${4 + i * 2}%` : undefined,
            right: i % 2 !== 0 ? `${4 + i * 2}%` : undefined,
            zIndex: 2,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {emoji}
        </div>
      ))}
    </>
  );

  // ─── Loading State ────────────────────────────────────────────────
  if (state === "loading") {
    return (
      <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "#0a0e1a" }}>
        {renderBackground()}
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 3 }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 48,
                height: 48,
                border: "4px solid rgba(255,255,255,0.1)",
                borderTopColor: "#42a5f5",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 1rem",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────────────────
  if (state === "error") {
    return (
      <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "#0a0e1a" }}>
        {renderBackground()}
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 3 }}>
          <div className="glass" style={{ padding: "2.5rem", textAlign: "center", maxWidth: 440, margin: "1rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>
            <h2 style={{ color: "white", fontWeight: 700, marginBottom: "0.5rem" }}>Quiz Submission Error</h2>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>{error}</p>
            <button
              className="btn-start"
              style={{ marginTop: "1.5rem", fontSize: "0.95rem", padding: "0.85rem 2rem" }}
              onClick={() => router.push(`/${gradeGroupSlug}`)}
            >
              ← Go Back to Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Success State ────────────────────────────────────────────────
  if (state === "success") {
    if (isPerfectScore) {
      return <WinnerVictoryScreen studentName={studentName} gradeGroupSlug={gradeGroupSlug} />;
    }

    return (
      <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "#0a0e1a" }}>
        {renderBackground()}
        <div className="success-container" style={{ position: "relative", zIndex: 3 }}>
          <div className="success-icon animate-fadeInUp">✓</div>

          <h1 className="success-title animate-fadeInUp delay-100">
            Quiz Submitted!
          </h1>

          <div
            className="glass animate-fadeInUp delay-200"
            style={{ padding: "2rem", maxWidth: 480, width: "100%", textAlign: "center", background: "rgba(0,0,0,0.55)" }}
          >
            <p className="success-message" style={{ margin: 0 }}>
              Thank you, <strong style={{ color: "#ffd600" }}>{studentName}</strong>! Your answers for{" "}
              <strong style={{ color: "#90caf9" }}>{quizData?.name}</strong> have been submitted successfully.
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.85rem",
                marginTop: "1rem",
              }}
            >
              Thank you for participating in the English Festival!
            </p>
          </div>

          <div className="animate-fadeInUp delay-300" style={{ fontSize: "2.2rem" }}>
            {quizData?.emoji} 🕊️ 📚 🌍
          </div>

          <p
            className="animate-fadeInUp"
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.8rem",
              fontStyle: "italic",
              animationDelay: "0.5s",
              opacity: 0,
            }}
          >
            &quot;Peace begins with a smile.&quot; — Mother Teresa
          </p>
        </div>
      </div>
    );
  }

  // ─── Quiz Interface ───────────────────────────────────────────────
  if (!currentQuestion || !quizData) return null;

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const answeredCount = Object.keys(answers).length + Object.keys(bonusAnswers).filter(k => bonusAnswers[k]?.trim()).length;
  const isCurrentBonus = currentQuestion.isBonus || currentQuestion.type === "open";

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "#0a0e1a" }}>
      {renderBackground()}

      {/* Main Content Area */}
      <div className="quiz-container" style={{ position: "relative", zIndex: 3 }}>
        {/* Header Bar */}
        <div className="animate-fadeInUp" style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {/* Grade Group Title */}
          <button
            onClick={() => router.push(`/${gradeGroupSlug}`)}
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "12px",
              padding: "0.55rem 1.1rem",
              color: "white",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>{quizData.emoji}</span>
            <span>{quizData.name}</span>
          </button>

          {/* Student Name Tag */}
          <span
            style={{
              background: "rgba(21, 101, 192, 0.35)",
              border: "1px solid rgba(66, 165, 245, 0.4)",
              borderRadius: "12px",
              padding: "0.45rem 1rem",
              color: "#90caf9",
              fontSize: "0.85rem",
              fontWeight: 700,
              backdropFilter: "blur(8px)",
            }}
          >
            👤 {studentName}
          </span>

          {/* Grade Tag */}
          <span
            style={{
              background: "rgba(255, 214, 0, 0.15)",
              border: "1px solid rgba(255, 214, 0, 0.4)",
              borderRadius: "12px",
              padding: "0.45rem 1rem",
              color: "#ffd600",
              fontSize: "0.85rem",
              fontWeight: 700,
              backdropFilter: "blur(8px)",
            }}
          >
            🎓 {studentGrade}th Grade
          </span>

          <div style={{ flex: 1 }} />

          {/* Answer Counter */}
          <span
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px",
              padding: "0.45rem 0.9rem",
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {answeredCount}/{totalQuestions} answered
          </span>
        </div>

        {/* Error message banner if any */}
        {error && (
          <div
            style={{
              background: "rgba(239, 83, 80, 0.2)",
              border: "1px solid rgba(239, 83, 80, 0.5)",
              borderRadius: "12px",
              padding: "0.85rem 1.25rem",
              color: "#ef5350",
              fontSize: "0.875rem",
              textAlign: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Progress bar */}
        <div className="animate-fadeInUp delay-100">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span style={{ fontSize: "0.8rem", color: "#42a5f5", fontWeight: 700 }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="progress-bar-track" style={{ background: "rgba(0,0,0,0.4)" }}>
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div
          className="glass question-card animate-fadeInUp delay-200"
          key={currentQuestion.id}
          style={{
            position: "relative",
            overflow: "hidden",
            background: "rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "20px",
          }}
        >
          {/* Level badge watermark */}
          <div
            style={{
              position: "absolute",
              right: "12px",
              top: "12px",
              fontSize: "0.75rem",
              fontWeight: 800,
              padding: "0.25rem 0.75rem",
              borderRadius: "8px",
              background: LEVEL_BG[currentQuestion.level] || "rgba(21,101,192,0.15)",
              color: LEVEL_COLORS[currentQuestion.level] || "#42a5f5",
              border: `1px solid ${LEVEL_COLORS[currentQuestion.level] || "#42a5f5"}55`,
              letterSpacing: "1px",
            }}
          >
            {currentQuestion.level}
          </div>

          <div className="question-number" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>
              {isCurrentBonus ? "⭐ Bonus Question" : `Question ${currentIndex + 1}`}
            </span>
            <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>• {quizData.name}</span>
          </div>
          <p className="question-text">{currentQuestion.text}</p>

          {/* Bonus question hint */}
          {isCurrentBonus && (
            <p style={{ color: "#ffd600", fontSize: "0.8rem", margin: "0.5rem 0 0 0", fontStyle: "italic" }}>
              ✍️ Write your answer below
            </p>
          )}
        </div>

        {/* Answer options — Choice Questions */}
        {!isCurrentBonus && (
          <div className="options-grid animate-fadeInUp delay-300">
            {OPTIONS.filter((opt) => getOptionText(currentQuestion, opt)?.trim()).map((opt) => (
              <button
                key={opt}
                className={`option-btn${currentAnswer === opt ? " selected" : ""}`}
                onClick={() => handleSelect(opt)}
                style={{
                  background: currentAnswer === opt ? "rgba(21, 101, 192, 0.45)" : "rgba(0, 0, 0, 0.45)",
                  backdropFilter: "blur(16px)",
                  border: currentAnswer === opt ? "2px solid #42a5f5" : "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                <span className="option-letter">{opt}</span>
                <span style={{ color: "white", fontWeight: 500 }}>{getOptionText(currentQuestion, opt)}</span>
              </button>
            ))}
          </div>
        )}

        {/* Answer input — Bonus / Open Questions */}
        {isCurrentBonus && (
          <div className="animate-fadeInUp delay-300">
            <textarea
              value={bonusAnswers[currentQuestion.id] || ""}
              onChange={(e) => handleBonusInput(e.target.value)}
              placeholder="Type your answer here..."
              rows={4}
              style={{
                width: "100%",
                padding: "1rem 1.25rem",
                borderRadius: "16px",
                border: bonusAnswers[currentQuestion.id]?.trim()
                  ? "2px solid #42a5f5"
                  : "1px solid rgba(255,255,255,0.15)",
                background: "rgba(0, 0, 0, 0.45)",
                backdropFilter: "blur(16px)",
                color: "white",
                fontSize: "1rem",
                fontFamily: "inherit",
                resize: "vertical",
                outline: "none",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#42a5f5";
              }}
              onBlur={(e) => {
                if (!bonusAnswers[currentQuestion.id]?.trim()) {
                  e.target.style.borderColor = "rgba(255,255,255,0.15)";
                }
              }}
            />
          </div>
        )}

        {/* Navigation */}
        <div
          className="animate-fadeInUp delay-400"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <button
            className="btn-nav btn-prev"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{ opacity: currentIndex === 0 ? 0.3 : 1, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
          >
            ← Previous
          </button>

          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", justifyContent: "center" }}>
            {allDisplayQuestions.map((q, i) => {
              const isQBonus = q.isBonus || q.type === "open";
              const isQAnswered = isQBonus
                ? !!bonusAnswers[q.id]?.trim()
                : !!answers[q.id];

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  title={`${isQBonus ? "Bonus" : "Question"} ${i + 1}`}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    transition: "all 0.2s",
                    background:
                      i === currentIndex
                        ? "#1565c0"
                        : isQAnswered
                        ? isQBonus
                          ? "rgba(255, 214, 0, 0.35)"
                          : "rgba(76, 175, 80, 0.45)"
                        : "rgba(0, 0, 0, 0.45)",
                    color:
                      i === currentIndex
                        ? "white"
                        : isQAnswered
                        ? isQBonus
                          ? "#ffd600"
                          : "#a5d6a7"
                        : "rgba(255,255,255,0.6)",
                    boxShadow: i === currentIndex ? "0 0 14px rgba(33,150,243,0.7)" : "none",
                  }}
                >
                  {isQBonus ? "⭐" : i + 1}
                </button>
              );
            })}
          </div>

          {isLastQuestion ? (
            <button
              className="btn-nav btn-submit"
              onClick={handleSubmit}
              disabled={!answeredAll || state === "submitting"}
            >
              {state === "submitting" ? "Submitting..." : "Submit Quiz ✓"}
            </button>
          ) : (
            <button
              className="btn-nav btn-next"
              onClick={handleNext}
            >
              Next →
            </button>
          )}
        </div>

        {/* Warning if not all answered */}
        {isLastQuestion && !answeredAll && (
          <div
            style={{
              background: "rgba(255, 143, 0, 0.2)",
              border: "1px solid rgba(255, 143, 0, 0.4)",
              borderRadius: "12px",
              padding: "0.85rem 1.25rem",
              color: "#ffb74d",
              fontSize: "0.875rem",
              textAlign: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            ⚠️ Please answer all questions before submitting.{" "}
            <strong>
              {totalQuestions - answeredCount} question
              {totalQuestions - answeredCount !== 1 ? "s" : ""} remaining.
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}

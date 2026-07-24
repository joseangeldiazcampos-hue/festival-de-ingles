"use client";

/**
 * BonusReviewTable — Admin Component for Submissions & Winners
 * Renders the attempts table and provides a modal for teachers to review
 * the student's written open-ended bonus responses.
 */

import { useState } from "react";

interface Attempt {
  id: string;
  studentName: string | null;
  studentGrade: string;
  correct: number;
  total: number;
  isPerfect: boolean;
  bonusAnswers: string | null;
  createdAt: string | Date;
  gradeGroup: {
    name: string;
    emoji: string | null;
    questions?: Array<{ id: string; text: string; type: string }>;
  };
}

interface Props {
  attempts: Attempt[];
  questionsMap?: Record<string, string>; // questionId -> questionText
}

function getResultLabel(correct: number, total: number): { label: string; color: string } {
  const pct = total > 0 ? (correct / total) * 100 : 0;
  if (pct === 100) return { label: "⭐ Perfect Score", color: "#ffd600" };
  if (pct >= 90) return { label: "🏆 Excellent", color: "#81c784" };
  if (pct >= 70) return { label: "✅ Passed", color: "#a5d6a7" };
  if (pct >= 50) return { label: "⚠️ Needs Improvement", color: "#ffb74d" };
  return { label: "❌ Failed", color: "#ef9a9a" };
}

export default function BonusReviewTable({ attempts, questionsMap = {} }: Props) {
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);

  // Parse bonus answers JSON safely
  const parseAnswers = (jsonStr: string | null): Record<string, string> => {
    if (!jsonStr) return {};
    try {
      return JSON.parse(jsonStr);
    } catch {
      return {};
    }
  };

  return (
    <div>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Grade</th>
              <th>Quiz Level</th>
              <th>Date</th>
              <th>Time</th>
              <th>Score</th>
              <th>Status</th>
              <th>Written Bonus Response</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a) => {
              const date = new Date(a.createdAt);
              const result = getResultLabel(a.correct, a.total);
              const pct = a.total > 0 ? Math.round((a.correct / a.total) * 100) : 0;
              const parsedBonus = parseAnswers(a.bonusAnswers);
              const hasBonus = Object.keys(parsedBonus).length > 0;

              return (
                <tr key={a.id}>
                  <td>
                    <span style={{ fontWeight: 600, color: a.isPerfect ? "#ffd600" : "#90caf9" }}>
                      👤 {a.studentName || "Anonymous Student"}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 700,
                        background: "rgba(255, 214, 0, 0.15)",
                        border: "1px solid rgba(255, 214, 0, 0.3)",
                        color: "#ffd600",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {a.studentGrade ? `${a.studentGrade}th Grade` : "-"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "1.2rem" }}>{a.gradeGroup?.emoji}</span>
                      <span style={{ fontWeight: 600 }}>{a.gradeGroup?.name}</span>
                    </div>
                  </td>
                  <td style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
                    {date.toLocaleDateString("en-GB")}
                  </td>
                  <td style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
                    {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
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
                    <span style={{ color: result.color, fontWeight: 600, fontSize: "0.85rem" }}>
                      {result.label}
                    </span>
                  </td>
                  <td>
                    {hasBonus ? (
                      <button
                        onClick={() => setSelectedAttempt(a)}
                        style={{
                          background: "rgba(255, 214, 0, 0.15)",
                          border: "1px solid rgba(255, 214, 0, 0.4)",
                          color: "#ffd600",
                          borderRadius: "8px",
                          padding: "0.35rem 0.75rem",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        ✍️ Ver Respuesta ({Object.keys(parsedBonus).length})
                      </button>
                    ) : (
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>Sin respuesta</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL TO REVIEW WRITTEN BONUS ANSWERS */}
      {selectedAttempt && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedAttempt(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 560,
              width: "100%",
              background: "#0d1322",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
            }}
          >
            {/* Header info */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
              <div>
                <span style={{ fontSize: "0.8rem", color: "#ffd600", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                  ✍️ Revisión de Respuesta Escrita (Bonus)
                </span>
                <h2 style={{ color: "white", margin: "0.25rem 0 0 0", fontSize: "1.35rem", fontWeight: 800 }}>
                  {selectedAttempt.studentName || "Anonymous Student"}
                </h2>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
                  <span style={{ background: "rgba(33, 150, 243, 0.2)", color: "#90caf9", padding: "0.25rem 0.65rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600 }}>
                    🎓 {selectedAttempt.studentGrade}th Grade
                  </span>
                  <span style={{ background: "rgba(255, 255, 255, 0.08)", color: "rgba(255,255,255,0.8)", padding: "0.25rem 0.65rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600 }}>
                    {selectedAttempt.gradeGroup?.emoji} {selectedAttempt.gradeGroup?.name}
                  </span>
                  <span style={{ background: selectedAttempt.isPerfect ? "rgba(255,214,0,0.2)" : "rgba(76,175,80,0.2)", color: selectedAttempt.isPerfect ? "#ffd600" : "#a5d6a7", padding: "0.25rem 0.65rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700 }}>
                    {selectedAttempt.correct}/{selectedAttempt.total} ({selectedAttempt.isPerfect ? "100% PERFECT SCORE ⭐" : `${Math.round((selectedAttempt.correct / selectedAttempt.total) * 100)}%`})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAttempt(null)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "white",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "1rem 0" }} />

            {/* Written Responses list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "350px", overflowY: "auto", paddingRight: "0.5rem" }}>
              {Object.entries(parseAnswers(selectedAttempt.bonusAnswers)).map(([qId, answerText], index) => {
                const questionPrompt = questionsMap[qId] || `Pregunta Bonus #${index + 1}`;

                return (
                  <div
                    key={qId}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,214,0,0.3)",
                      borderRadius: "14px",
                      padding: "1rem 1.25rem",
                    }}
                  >
                    <div style={{ fontSize: "0.8rem", color: "#ffd600", fontWeight: 700, marginBottom: "0.35rem" }}>
                      ⭐ Reto Escrito #{index + 1}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", fontWeight: 600, marginBottom: "0.75rem", lineHeight: 1.4 }}>
                      {questionPrompt}
                    </div>
                    <div
                      style={{
                        background: "rgba(0,0,0,0.5)",
                        borderLeft: "4px solid #ffd600",
                        padding: "0.85rem 1rem",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "0.95rem",
                        fontStyle: "italic",
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                      }}
                    >
                      &quot;{answerText}&quot;
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Close action */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button
                onClick={() => setSelectedAttempt(null)}
                className="btn-admin btn-admin-primary"
                style={{ padding: "0.6rem 1.5rem", fontSize: "0.9rem" }}
              >
                Cerrar Revisión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

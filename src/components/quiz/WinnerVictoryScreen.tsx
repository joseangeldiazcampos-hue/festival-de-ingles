"use client";

/**
 * WinnerVictoryScreen — High-impact Video Game Style Victory Screen
 * - Full pitch-black background (#000000)
 * - Continuous HTML5 Canvas Fireworks in the background
 * - Stage 1: "🏆 WINNER" appears with epic zoom & gold glow
 * - Stage 2: "WINNER" fades out, student's name appears with "Great Job!" underneath
 * - Auto-redirects or returns to home page when finished
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FireworksCanvas from "@/components/quiz/FireworksCanvas";
import MagicalUnicornRainbow from "@/components/quiz/MagicalUnicornRainbow";
import PinkPonyClubPlayer from "@/components/quiz/PinkPonyClubPlayer";

interface Props {
  studentName: string;
  gradeGroupSlug: string;
}

export default function WinnerVictoryScreen({ studentName, gradeGroupSlug }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    // Clear student identity so a new QR scan starts fresh
    if (typeof window !== "undefined") {
      localStorage.removeItem("quiz_student_name");
      localStorage.removeItem("quiz_student_grade");
    }

    // Paso 1: "🏆 WINNER" (0s - 1.8s)
    const timer1 = setTimeout(() => {
      setPhase(2);
    }, 1800);

    // Paso 2: Solo Nombre del Estudiante (1.8s - 3.6s)
    const timer2 = setTimeout(() => {
      setPhase(3);
    }, 3600);

    // Paso 3: Solo "⭐ GREAT JOB! ⭐" (3.6s - 5.4s)
    const timer3 = setTimeout(() => {
      setPhase(4);
    }, 5400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontFamily: "'Outfit', 'Montserrat', 'Inter', system-ui, sans-serif",
      }}
    >
      {/* Pink Pony Club (Chorus) Synth-Pop Audio Player */}
      <PinkPonyClubPlayer />

      {/* Magical Starry Sky & Rainbow Canopy in background */}
      {phase >= 2 && <MagicalUnicornRainbow />}

      {/* Continuous Fireworks in background */}
      <FireworksCanvas />

      {/* PASO 1: Solo "🏆 WINNER" */}
      {phase === 1 && (
        <div
          key="phase1"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100000,
            animation: "victoryZoomIn 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
          }}
        >
          <div
            style={{
              fontSize: "clamp(4.5rem, 12vw, 8rem)",
              marginBottom: "0.5rem",
              filter: "drop-shadow(0 0 45px #ffd600)",
            }}
          >
            🏆
          </div>

          <h1
            style={{
              fontSize: "clamp(3.5rem, 12vw, 8rem)",
              fontWeight: 900,
              color: "#ffd600",
              margin: 0,
              letterSpacing: "8px",
              textTransform: "uppercase",
              textShadow: `
                0 0 20px #ffd600,
                0 0 40px #ff8f00,
                0 0 80px #ff6d00,
                0 0 120px rgba(255, 214, 0, 0.8)
              `,
              lineHeight: 1,
            }}
          >
            WINNER
          </h1>
        </div>
      )}

      {/* PASO 2: Solo Nombre del Estudiante */}
      {phase === 2 && (
        <div
          key="phase2"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100000,
            textAlign: "center",
            padding: "0 1.5rem",
            animation: "victoryNamePop 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(3rem, 9vw, 7rem)",
              fontWeight: 900,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "3px",
              textShadow: `
                0 0 20px #ffffff,
                0 0 40px #f472b6,
                0 0 80px #38bdf8,
                0 0 120px rgba(244, 114, 182, 0.8)
              `,
              lineHeight: 1.1,
            }}
          >
            👤 {studentName}
          </h1>
        </div>
      )}

      {/* PASO 3: Solo "⭐ GREAT JOB! ⭐" */}
      {phase === 3 && (
        <div
          key="phase3"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100000,
            textAlign: "center",
            padding: "0 1.5rem",
            animation: "victorySubText 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(3rem, 9vw, 6.5rem)",
              fontWeight: 900,
              color: "#ffd600",
              margin: 0,
              letterSpacing: "4px",
              textShadow: `
                0 0 20px #ffd600,
                0 0 40px #ff8f00,
                0 0 70px rgba(255, 214, 0, 0.9)
              `,
              lineHeight: 1.1,
            }}
          >
            ⭐ GREAT JOB! ⭐
          </h1>
        </div>
      )}

      {/* PASO 4: Todo Junto en Tarjeta Final */}
      {phase === 4 && (
        <div
          key="phase4"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100000,
            textAlign: "center",
            padding: "2rem 1.75rem",
            maxWidth: 520,
            width: "90%",
            background: "rgba(10, 20, 30, 0.85)",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(244, 114, 182, 0.5)",
            borderRadius: "28px",
            boxShadow: "0 0 50px rgba(244, 114, 182, 0.4), 0 0 100px rgba(56, 189, 248, 0.3)",
            animation: "victoryNamePop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
          }}
        >
          <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>🏆 ⭐</div>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#ffffff", margin: "0 0 0.4rem 0" }}>
            {studentName}
          </h2>
          <div
            style={{
              background: "linear-gradient(135deg, #f472b6, #38bdf8)",
              color: "white",
              padding: "0.45rem 1.4rem",
              borderRadius: "100px",
              fontSize: "0.95rem",
              fontWeight: 800,
              letterSpacing: "1px",
              marginBottom: "1rem",
              boxShadow: "0 0 20px rgba(244, 114, 182, 0.5)",
            }}
          >
            ⭐ GREAT JOB! ⭐ — 100% PERFECT SCORE
          </div>
          <p style={{ color: "rgba(253, 242, 248, 0.85)", fontSize: "0.9rem", fontStyle: "italic", margin: 0, fontWeight: 600 }}>
            🕊️ Violence Is Never The Answer — English Festival 2026
          </p>
        </div>
      )}

      {/* Keyframe animations */}
      <style>{`
        @keyframes victoryZoomIn {
          0% {
            transform: scale(0.2);
            opacity: 0;
            filter: blur(10px);
          }
          70% {
            transform: scale(1.15);
            opacity: 1;
            filter: blur(0);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes victoryNamePop {
          0% {
            transform: translateY(40px) scale(0.7);
            opacity: 0;
            filter: blur(8px);
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
            filter: blur(0);
          }
        }

        @keyframes victorySubText {
          0% {
            transform: translateY(20px) scale(0.85);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

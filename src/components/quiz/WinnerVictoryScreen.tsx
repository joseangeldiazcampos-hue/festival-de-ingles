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
  const [phase, setPhase] = useState<1 | 2>(1);
  const [fadeOutScreen, setFadeOutScreen] = useState(false);

  useEffect(() => {
    // Stage 1: "WINNER" shows for 1.6 seconds, then transition to Stage 2
    const timer1 = setTimeout(() => {
      setPhase(2);
    }, 1600);

    // After 8.5 seconds total, fade out and return home
    const timer2 = setTimeout(() => {
      setFadeOutScreen(true);
      setTimeout(() => {
        router.push("/");
      }, 800);
    }, 8500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [router]);

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
        opacity: fadeOutScreen ? 0 : 1,
        transition: "opacity 0.8s ease-in-out",
      }}
    >
      {/* Pink Pony Club (Chorus) Synth-Pop Audio Player */}
      <PinkPonyClubPlayer />

      {/* Stage 2: Magical Unicorn & Rainbow Illustration in background */}
      {phase === 2 && <MagicalUnicornRainbow />}

      {/* Continuous Fireworks in background */}
      <FireworksCanvas />

      {/* STAGE 1: "🏆 WINNER" */}
      {phase === 1 && (
        <div
          key="phase1"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100000,
            animation: "victoryZoomIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
          }}
        >
          <div
            style={{
              fontSize: "clamp(4rem, 10vw, 7rem)",
              marginBottom: "0.5rem",
              filter: "drop-shadow(0 0 35px #ffd600)",
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

      {/* STAGE 2: Student Name + "Great Job!" */}
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
          }}
        >
          {/* Student Name */}
          <h1
            style={{
              fontSize: "clamp(2.8rem, 8vw, 6.5rem)",
              fontWeight: 900,
              color: "#ffffff",
              margin: "0 0 1rem 0",
              letterSpacing: "3px",
              textShadow: `
                0 0 20px #ffffff,
                0 0 40px #42a5f5,
                0 0 80px #1565c0,
                0 0 120px rgba(66, 165, 245, 0.8)
              `,
              animation: "victoryNamePop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
              lineHeight: 1.1,
            }}
          >
            {studentName}
          </h1>

          {/* "Great Job!" */}
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 800,
              color: "#ffd600",
              margin: 0,
              letterSpacing: "4px",
              textShadow: `
                0 0 15px #ffd600,
                0 0 35px #ff8f00,
                0 0 60px rgba(255, 214, 0, 0.7)
              `,
              animation: "victorySubText 0.8s ease-out 0.4s both",
            }}
          >
            Great Job!
          </h2>
        </div>
      )}

      {/* Skip / Home button */}
      <button
        onClick={() => router.push("/")}
        style={{
          position: "fixed",
          bottom: "2.5rem",
          zIndex: 100001,
          background: "rgba(255, 255, 255, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          color: "rgba(255, 255, 255, 0.7)",
          padding: "0.6rem 1.8rem",
          borderRadius: "100px",
          cursor: "pointer",
          fontSize: "0.85rem",
          fontWeight: 600,
          backdropFilter: "blur(10px)",
          letterSpacing: "1px",
          transition: "all 0.3s ease",
        }}
      >
        ← Home
      </button>

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

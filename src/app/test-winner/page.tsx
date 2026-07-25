"use client";

/**
 * /test-winner — Dedicated Live Preview Page for Winner Animation & Music
 * Allows testing every new visual feature, unicorn dance, audio, and rainbow trail instantly.
 */

import { useState } from "react";
import MagicalUnicornRainbow from "@/components/quiz/MagicalUnicornRainbow";
import PinkPonyClubPlayer from "@/components/quiz/PinkPonyClubPlayer";

export default function TestWinnerPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [danceKey, setDanceKey] = useState(0);

  const handleReplay = () => {
    setDanceKey((prev) => prev + 1);
    setIsPlaying(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        color: "white",
        fontFamily: "'Outfit', 'Montserrat', system-ui, sans-serif",
      }}
    >
      {/* Background Magical Unicorn Rainbow Animation */}
      <MagicalUnicornRainbow key={danceKey} />

      {/* Audio Player (Chorus at 76s) */}
      {isPlaying && <PinkPonyClubPlayer />}

      {/* Control Panel Bar at Top */}
      <div
        style={{
          position: "fixed",
          top: "16px",
          zIndex: 99999,
          display: "flex",
          gap: "0.75rem",
          background: "rgba(20, 20, 20, 0.85)",
          backdropFilter: "blur(16px)",
          padding: "0.6rem 1.2rem",
          borderRadius: "100px",
          border: "1px solid rgba(244, 114, 182, 0.4)",
          boxShadow: "0 0 25px rgba(244, 114, 182, 0.3)",
        }}
      >
        <button
          onClick={handleReplay}
          style={{
            background: "linear-gradient(135deg, #f472b6, #38bdf8)",
            border: "none",
            color: "white",
            padding: "0.5rem 1.1rem",
            borderRadius: "100px",
            fontWeight: 800,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          🔄 Reiniciar Animación y Baile
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            background: isPlaying ? "rgba(239, 68, 68, 0.2)" : "rgba(74, 222, 128, 0.2)",
            border: `1px solid ${isPlaying ? "#ef4444" : "#4ade80"}`,
            color: isPlaying ? "#ef4444" : "#4ade80",
            padding: "0.5rem 1.1rem",
            borderRadius: "100px",
            fontWeight: 800,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          {isPlaying ? "🔇 Pausar Música" : "🔊 Reproducir Música"}
        </button>
      </div>

      {/* Center Winner Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          maxWidth: 500,
          width: "100%",
          padding: "2rem 1.5rem",
          marginTop: "3rem",
        }}
      >
        {/* Trophy Header */}
        <div style={{ fontSize: "4.5rem", marginBottom: "0.5rem" }}>🏆 🦄</div>

        <h1
          style={{
            fontSize: "clamp(2rem, 6vw, 3.2rem)",
            fontWeight: 900,
            background: "linear-gradient(135deg, #ffffff, #7dd3fc, #f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 0.5rem 0",
            lineHeight: 1.15,
          }}
        >
          ¡Demostración de Ganador!
        </h1>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(244, 114, 182, 0.2)",
            border: "1px solid rgba(244, 114, 182, 0.5)",
            padding: "0.4rem 1.2rem",
            borderRadius: "100px",
            color: "#f472b6",
            fontWeight: 800,
            fontSize: "0.9rem",
            marginBottom: "1rem",
          }}
        >
          <span>⭐ 5/5 Puntaje Perfecto — 100%</span>
        </div>

        <p style={{ color: "rgba(253, 242, 248, 0.9)", fontSize: "1rem", lineHeight: 1.6 }}>
          🎵 Escuchando: <strong>Chappell Roan — Pink Pony Club (Chorus)</strong>
        </p>
      </div>
    </div>
  );
}

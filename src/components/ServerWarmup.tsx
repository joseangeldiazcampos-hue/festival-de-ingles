"use client";

/**
 * ServerWarmup — Global cold-start loading overlay
 * 
 * On Render.com free tier, the server sleeps after 15 min of inactivity.
 * This component pings /api/health on mount and shows a premium loading 
 * animation until the server responds. Once warm, it fades out gracefully
 * and never shows again for the session.
 */

import { useState, useEffect, useRef } from "react";

const WARMUP_MESSAGES = [
  "Waking up the server…",
  "Almost there, hold tight…",
  "Connecting to database…",
  "Preparing your experience…",
];

export default function ServerWarmup() {
  const [isWarming, setIsWarming] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState("");
  const hasWarmedRef = useRef(false);

  // Check if already warmed this session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const warmed = sessionStorage.getItem("server_warmed");
      if (warmed === "true") {
        hasWarmedRef.current = true;
        setIsWarming(false);
        return;
      }
    }

    // Start pinging the server
    let cancelled = false;
    const startTime = Date.now();

    const ping = async () => {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        if (res.ok && !cancelled) {
          // Server is awake!
          if (typeof window !== "undefined") {
            sessionStorage.setItem("server_warmed", "true");
          }
          hasWarmedRef.current = true;

          // If response was fast (< 2s), server was already warm — skip animation
          const elapsed = Date.now() - startTime;
          if (elapsed < 2000) {
            setIsWarming(false);
          } else {
            setFadeOut(true);
            setTimeout(() => setIsWarming(false), 600);
          }
        }
      } catch {
        // Server still waking up, retry
        if (!cancelled) {
          setTimeout(ping, 3000);
        }
      }
    };

    ping();

    return () => {
      cancelled = true;
    };
  }, []);

  // Cycle through loading messages
  useEffect(() => {
    if (!isWarming || hasWarmedRef.current) return;

    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % WARMUP_MESSAGES.length);
    }, 3000);

    return () => clearInterval(msgInterval);
  }, [isWarming]);

  // Animate dots
  useEffect(() => {
    if (!isWarming || hasWarmedRef.current) return;

    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(dotInterval);
  }, [isWarming]);

  if (!isWarming) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0e1a",
        transition: "opacity 0.6s ease-out",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      {/* Animated background gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(21, 101, 192, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(106, 27, 154, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(0, 150, 136, 0.08) 0%, transparent 60%)
          `,
          animation: "warmup-bg-pulse 4s ease-in-out infinite",
        }}
      />

      {/* Floating peace icons */}
      {["🕊️", "📚", "🌍", "✏️", "🤝"].map((emoji, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
            opacity: 0.12,
            animation: `flag-float ${4 + i * 0.8}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
            top: `${15 + i * 15}%`,
            left: i % 2 === 0 ? `${8 + i * 4}%` : undefined,
            right: i % 2 !== 0 ? `${8 + i * 3}%` : undefined,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {emoji}
        </div>
      ))}

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        {/* Custom animated spinner */}
        <div
          style={{
            width: 72,
            height: 72,
            position: "relative",
          }}
        >
          {/* Outer ring */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "3px solid rgba(255,255,255,0.06)",
              borderTopColor: "#42a5f5",
              borderRightColor: "rgba(66, 165, 245, 0.3)",
              borderRadius: "50%",
              animation: "warmup-spin 1s linear infinite",
            }}
          />
          {/* Inner ring */}
          <div
            style={{
              position: "absolute",
              inset: 10,
              border: "3px solid rgba(255,255,255,0.04)",
              borderBottomColor: "#7c4dff",
              borderLeftColor: "rgba(124, 77, 255, 0.3)",
              borderRadius: "50%",
              animation: "warmup-spin 1.5s linear infinite reverse",
            }}
          />
          {/* Center dove */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              animation: "warmup-pulse 2s ease-in-out infinite",
            }}
          >
            🕊️
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: "1.3rem",
              fontWeight: 800,
              color: "white",
              margin: "0 0 0.3rem 0",
              letterSpacing: "0.5px",
            }}
          >
            English Festival
          </h1>
          <p
            style={{
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.4)",
              margin: 0,
              fontWeight: 500,
            }}
          >
            Violence Is Never The Answer
          </p>
        </div>

        {/* Loading message */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "0.75rem 1.5rem",
            backdropFilter: "blur(10px)",
            minWidth: 260,
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.9rem",
              fontWeight: 500,
              margin: 0,
              transition: "opacity 0.3s ease",
            }}
          >
            {WARMUP_MESSAGES[messageIndex]}{dots}
          </p>
        </div>

        {/* Subtle progress bar */}
        <div
          style={{
            width: 200,
            height: 3,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 100,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "40%",
              height: "100%",
              background: "linear-gradient(90deg, #42a5f5, #7c4dff)",
              borderRadius: 100,
              animation: "warmup-progress 2s ease-in-out infinite",
            }}
          />
        </div>

        {/* Tip text */}
        <p
          style={{
            color: "rgba(255,255,255,0.25)",
            fontSize: "0.75rem",
            margin: 0,
            fontStyle: "italic",
          }}
        >
          First load may take a moment — the server is waking up
        </p>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes warmup-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes warmup-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes warmup-bg-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes warmup-progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}

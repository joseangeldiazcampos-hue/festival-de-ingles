"use client";

/**
 * MagicalUnicornRainbow — High quality animated vector SVG + Canvas
 * Renders a magical unicorn painting a brilliant glowing rainbow trail with twinkling star particles.
 */

import { useEffect, useState } from "react";

export default function MagicalUnicornRainbow() {
  const [sparkles, setSparkles] = useState<Array<{ id: number; top: number; left: number; size: number; delay: number }>>([]);

  useEffect(() => {
    // Generate 25 magical twinkling stars along the rainbow arc
    const newSparkles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      top: 30 + Math.sin((i / 25) * Math.PI) * 35 + (Math.random() - 0.5) * 15,
      left: (i / 25) * 85 + 5,
      size: 12 + Math.random() * 18,
      delay: Math.random() * 2,
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "unicornFadeIn 1.2s ease-out forwards",
      }}
    >
      {/* Rainbow & Unicorn Container */}
      <div style={{ position: "relative", width: "100%", height: "100%", maxWidth: "1200px" }}>
        
        {/* Glowing Rainbow SVG */}
        <svg
          viewBox="0 0 1000 500"
          style={{
            position: "absolute",
            top: "15%",
            left: "5%",
            width: "90%",
            height: "70%",
            filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.4))",
          }}
        >
          <defs>
            <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff0055" />
              <stop offset="20%" stopColor="#ff7700" />
              <stop offset="40%" stopColor="#ffdd00" />
              <stop offset="60%" stopColor="#00e676" />
              <stop offset="80%" stopColor="#00b0ff" />
              <stop offset="100%" stopColor="#d500f9" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Rainbow Arc */}
          <path
            d="M 50 400 Q 500 80 950 400"
            fill="none"
            stroke="url(#rainbowGrad)"
            strokeWidth="34"
            strokeLinecap="round"
            filter="url(#glow)"
            style={{
              strokeDasharray: 1400,
              strokeDashoffset: 1400,
              animation: "drawRainbow 6.0s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.2s",
            }}
          />
        </svg>

        {/* Floating Twinkling Sparkle Particles */}
        {sparkles.map((sp) => (
          <div
            key={sp.id}
            style={{
              position: "absolute",
              top: `${sp.top}%`,
              left: `${sp.left}%`,
              fontSize: `${sp.size}px`,
              animation: `sparklePulse 1.8s ease-in-out infinite alternate`,
              animationDelay: `${sp.delay}s`,
              color: "#fff7c2",
              textShadow: "0 0 10px #ffd600, 0 0 20px #ffffff",
              pointerEvents: "none",
            }}
          >
            ✦
          </div>
        ))}

        {/* AI Generated Magical Unicorn Artwork */}
        <div
          style={{
            position: "absolute",
            top: "22%",
            left: "0%",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid #ffd600",
            boxShadow: "0 0 35px rgba(255, 214, 0, 0.9), 0 0 70px rgba(213, 0, 249, 0.7)",
            animation: "glideUnicorn 6.0s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.2s",
            background: "#000",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/magical_unicorn.jpg"
            alt="Magical AI Unicorn"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

      </div>

      {/* CSS Keyframes for smooth animations */}
      <style>{`
        @keyframes unicornFadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes drawRainbow {
          0% { strokeDashoffset: 1400; }
          100% { strokeDashoffset: 0; }
        }

        @keyframes glideUnicorn {
          0% {
            transform: translate(20px, 220px) scale(0.7);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          35% {
            transform: translate(240px, 80px) scale(0.9);
          }
          50% {
            transform: translate(450px, 20px) scale(1);
          }
          75% {
            transform: translate(680px, 80px) scale(0.9);
          }
          100% {
            transform: translate(840px, 220px) scale(0.8);
            opacity: 1;
          }
        }

        @keyframes sparklePulse {
          0% { opacity: 0.2; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(45deg); }
          100% { opacity: 0.3; transform: scale(0.9) rotate(90deg); }
        }
      `}</style>
    </div>
  );
}

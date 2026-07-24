"use client";

/**
 * MagicalUnicornRainbow — High impact vector SVG Rainbow + AI Unicorn Artwork
 * Renders 6 distinct glowing rainbow color bands painted by a large, crisp AI Unicorn.
 */

import { useEffect, useState } from "react";

export default function MagicalUnicornRainbow() {
  const [sparkles, setSparkles] = useState<Array<{ id: number; top: number; left: number; size: number; delay: number }>>([]);

  useEffect(() => {
    // Generate 30 magical twinkling stars along the rainbow arc
    const newSparkles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      top: 25 + Math.sin((i / 30) * Math.PI) * 40 + (Math.random() - 0.5) * 12,
      left: (i / 30) * 88 + 6,
      size: 14 + Math.random() * 22,
      delay: Math.random() * 2,
    }));
    setSparkles(newSparkles);
  }, []);

  const rainbowBands = [
    { color: "#ff0055", width: 44, radiusOffset: 0 },
    { color: "#ff7700", width: 36, radiusOffset: 6 },
    { color: "#ffdd00", width: 28, radiusOffset: 12 },
    { color: "#00e676", width: 20, radiusOffset: 18 },
    { color: "#00b0ff", width: 12, radiusOffset: 24 },
    { color: "#d500f9", width: 6, radiusOffset: 30 },
  ];

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
        animation: "unicornFadeIn 1s ease-out forwards",
      }}
    >
      {/* Container */}
      <div style={{ position: "relative", width: "100%", height: "100%", maxWidth: "1300px" }}>
        
        {/* Full Viewport Glowing Multi-Layer Rainbow SVG */}
        <svg
          viewBox="0 0 1000 500"
          style={{
            position: "absolute",
            top: "10%",
            left: "2%",
            width: "96%",
            height: "80%",
            filter: "drop-shadow(0 0 25px rgba(255, 255, 255, 0.6))",
          }}
        >
          <defs>
            <filter id="superGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Render 6 Layered Vibrant Rainbow Bands */}
          {rainbowBands.map((band, idx) => (
            <path
              key={idx}
              d={`M 40 ${400 + band.radiusOffset} Q 500 ${60 + band.radiusOffset} 960 ${400 + band.radiusOffset}`}
              fill="none"
              stroke={band.color}
              strokeWidth={band.width}
              strokeLinecap="round"
              filter="url(#superGlow)"
              style={{
                strokeDasharray: 1600,
                strokeDashoffset: 1600,
                animation: "drawRainbow 5.5s cubic-bezier(0.35, 0, 0.25, 1) forwards 0.2s",
              }}
            />
          ))}
        </svg>

        {/* Floating Twinkling Sparkle Star Particles */}
        {sparkles.map((sp) => (
          <div
            key={sp.id}
            style={{
              position: "absolute",
              top: `${sp.top}%`,
              left: `${sp.left}%`,
              fontSize: `${sp.size}px`,
              animation: `sparklePulse 1.6s ease-in-out infinite alternate`,
              animationDelay: `${sp.delay}s`,
              color: "#ffffff",
              textShadow: "0 0 12px #38bdf8, 0 0 25px #4ade80, 0 0 35px #ffffff",
              pointerEvents: "none",
              zIndex: 3,
            }}
          >
            ✦
          </div>
        ))}

        {/* Large, Vivid AI Unicorn Artwork Card */}
        <div
          style={{
            position: "absolute",
            top: "18%",
            left: "0%",
            width: "240px",
            height: "240px",
            borderRadius: "32px",
            overflow: "hidden",
            border: "4px solid #38bdf8",
            boxShadow: `
              0 0 40px rgba(56, 189, 248, 0.9),
              0 0 80px rgba(74, 222, 128, 0.8),
              0 0 120px rgba(213, 0, 249, 0.6)
            `,
            animation: "glideUnicorn 5.5s cubic-bezier(0.35, 0, 0.25, 1) forwards 0.2s",
            background: "#000000",
            zIndex: 4,
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
              filter: "contrast(1.1) brightness(1.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: "inset 0 0 30px rgba(56, 189, 248, 0.5)",
              pointerEvents: "none",
            }}
          />
        </div>

      </div>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes unicornFadeIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes drawRainbow {
          0% { strokeDashoffset: 1600; }
          100% { strokeDashoffset: 0; }
        }

        @keyframes glideUnicorn {
          0% {
            transform: translate(10px, 240px) scale(0.7);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          30% {
            transform: translate(250px, 90px) scale(0.95);
          }
          50% {
            transform: translate(500px, 20px) scale(1.1);
          }
          75% {
            transform: translate(750px, 90px) scale(0.95);
          }
          100% {
            transform: translate(920px, 240px) scale(0.85);
            opacity: 1;
          }
        }

        @keyframes sparklePulse {
          0% { opacity: 0.2; transform: scale(0.7) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.4) rotate(45deg); }
          100% { opacity: 0.3; transform: scale(0.8) rotate(90deg); }
        }
      `}</style>
    </div>
  );
}

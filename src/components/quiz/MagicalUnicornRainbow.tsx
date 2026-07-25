"use client";

/**
 * MagicalUnicornRainbow — High impact vector SVG Rainbow + AI Unicorn Artwork
 * Renders 6 distinct glowing rainbow color bands painted by a large, crisp AI Unicorn.
 */

import { useEffect, useState } from "react";

export default function MagicalUnicornRainbow() {
  const [sparkles, setSparkles] = useState<Array<{ id: number; top: number; left: number; size: number; delay: number; duration: number }>>([]);
  const [shootingStars, setShootingStars] = useState<Array<{ id: number; top: number; left: number; delay: number }>>([]);

  useEffect(() => {
    // Generate 60 magical twinkling star particles across the starry night sky
    const newSparkles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      top: Math.random() * 90,
      left: Math.random() * 95,
      size: 10 + Math.random() * 26,
      delay: Math.random() * 3,
      duration: 1.2 + Math.random() * 2,
    }));
    setSparkles(newSparkles);

    // Generate 8 shooting stars
    const newShootingStars = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      top: Math.random() * 50,
      left: Math.random() * 70,
      delay: i * 1.5 + Math.random(),
    }));
    setShootingStars(newShootingStars);
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
            filter: "drop-shadow(0 0 30px rgba(255, 255, 255, 0.7))",
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
                animation: "drawRainbow 5.0s cubic-bezier(0.35, 0, 0.25, 1) forwards 0.2s",
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
              animation: `sparklePulse ${sp.duration}s ease-in-out infinite alternate`,
              animationDelay: `${sp.delay}s`,
              color: "#ffffff",
              textShadow: "0 0 12px #f472b6, 0 0 25px #38bdf8, 0 0 35px #ffffff",
              pointerEvents: "none",
              zIndex: 3,
            }}
          >
            ✦
          </div>
        ))}

        {/* Shooting Stars */}
        {shootingStars.map((st) => (
          <div
            key={st.id}
            style={{
              position: "absolute",
              top: `${st.top}%`,
              left: `${st.left}%`,
              width: "120px",
              height: "2px",
              background: "linear-gradient(90deg, #ffffff, rgba(244, 114, 182, 0.8), transparent)",
              transform: "rotate(-35deg)",
              animation: `shootingStar 3.5s linear infinite`,
              animationDelay: `${st.delay}s`,
              pointerEvents: "none",
              zIndex: 2,
              opacity: 0,
            }}
          />
        ))}

      </div>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes unicornFadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes drawRainbow {
          0% { strokeDashoffset: 1600; }
          100% { strokeDashoffset: 0; }
        }

        @keyframes shootingStar {
          0% { opacity: 0; transform: translate(0, 0) rotate(-35deg) scaleX(0.2); }
          10% { opacity: 1; transform: translate(-30px, 30px) rotate(-35deg) scaleX(1); }
          30% { opacity: 0; transform: translate(-150px, 150px) rotate(-35deg) scaleX(0.5); }
          100% { opacity: 0; }
        }

        @keyframes sparklePulse {
          0% { opacity: 0.15; transform: scale(0.6) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.4) rotate(45deg); }
          100% { opacity: 0.2; transform: scale(0.7) rotate(90deg); }
        }
      `}</style>
    </div>
  );
}

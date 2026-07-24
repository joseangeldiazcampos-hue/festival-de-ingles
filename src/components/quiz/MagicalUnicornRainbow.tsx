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
              animation: "drawRainbow 5.5s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.2s",
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

        {/* Magical Unicorn Vector Illustration */}
        <div
          style={{
            position: "absolute",
            top: "28%",
            left: "0%",
            width: "160px",
            height: "160px",
            animation: "glideUnicorn 6.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.2s",
            filter: "drop-shadow(0 0 25px rgba(255, 214, 0, 0.8))",
          }}
        >
          <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
            {/* Glowing Horn */}
            <polygon points="110,25 102,60 118,60" fill="#ffd600" filter="url(#glow)" />
            <path d="M102,60 L110,25 L118,60" stroke="#ffffff" strokeWidth="2" fill="none" />
            
            {/* Magic Horn Sparkle */}
            <circle cx="110" cy="22" r="8" fill="#ffffff" style={{ filter: "drop-shadow(0 0 10px #ffffff)" }} />
            
            {/* Head & Neck */}
            <path
              d="M 60,140 Q 70,80 110,60 Q 150,55 160,85 Q 165,105 140,115 Q 120,120 100,140 Z"
              fill="#ffffff"
            />
            
            {/* Muzzle */}
            <path d="M 140,115 Q 160,110 155,95 Q 145,90 135,100 Z" fill="#ffecb3" />
            <circle cx="148" cy="100" r="2" fill="#5d4037" />

            {/* Eye */}
            <circle cx="125" cy="80" r="4" fill="#1a237e" />
            <circle cx="127" cy="78" r="1.5" fill="#ffffff" />

            {/* Rainbow Mane */}
            <path d="M 105,58 Q 80,45 65,70" fill="none" stroke="#ff0055" strokeWidth="8" strokeLinecap="round" />
            <path d="M 95,68 Q 70,55 55,80" fill="none" stroke="#ffaa00" strokeWidth="8" strokeLinecap="round" />
            <path d="M 85,78 Q 60,65 45,90" fill="none" stroke="#00e676" strokeWidth="8" strokeLinecap="round" />
            <path d="M 75,88 Q 50,75 35,100" fill="none" stroke="#00b0ff" strokeWidth="8" strokeLinecap="round" />
            <path d="M 65,98 Q 40,85 25,110" fill="none" stroke="#d500f9" strokeWidth="8" strokeLinecap="round" />

            {/* Ear */}
            <polygon points="90,60 100,40 105,62" fill="#ffffff" />
            <polygon points="93,58 99,44 102,60" fill="#ffcdd2" />
          </svg>
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
            transform: translate(0px, 120px) rotate(-10deg) scale(0.6);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translate(780px, 80px) rotate(8deg) scale(1);
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

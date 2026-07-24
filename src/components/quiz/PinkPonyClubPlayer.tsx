"use client";

/**
 * PinkPonyClubPlayer — Plays the real sung vocal audio track of
 * Chappell Roan - Pink Pony Club (Chorus).
 *
 * Place your vocal MP3 file at: public/pink_pony_club_chorus.mp3
 */

import { useEffect, useRef, useState } from "react";

export default function PinkPonyClubPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Start playback directly at the Chorus section (~76 seconds into the song)
    const handleCanPlay = () => {
      if (audio.currentTime < 70) {
        audio.currentTime = 76;
      }
    };

    audio.addEventListener("canplay", handleCanPlay);

    // Try playing real vocal MP3 audio
    audio.play().then(() => {
      if (audio.currentTime < 70) {
        audio.currentTime = 76;
      }
    }).catch((err) => {
      console.log("Audio autoplay prevented by browser:", err);
      setIsPlaying(false);
    });

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      {/* Real Vocal Audio Track */}
      <audio
        ref={audioRef}
        id="pink-pony-audio"
        autoPlay
        loop
        preload="auto"
        src="/pink_pony_club_chorus.mp3"
        onError={() => setHasError(true)}
      />

      {/* Floating Sound Control Button */}
      <button
        onClick={toggleSound}
        style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 100002,
          background: "rgba(255, 0, 85, 0.35)",
          border: "1px solid rgba(255, 0, 85, 0.8)",
          color: "#ffffff",
          padding: "0.55rem 1.25rem",
          borderRadius: "100px",
          cursor: "pointer",
          fontSize: "0.85rem",
          fontWeight: 700,
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          boxShadow: "0 0 25px rgba(255, 0, 85, 0.6)",
          transition: "all 0.3s ease",
        }}
      >
        <span style={{ fontSize: "1.1rem" }}>{isPlaying ? "🎶" : "🔇"}</span>
        <span>
          {isPlaying
            ? "Chappell Roan — Pink Pony Club 🎤"
            : "Click to Play Song (Vocals) 🎤"}
        </span>
      </button>
    </>
  );
}

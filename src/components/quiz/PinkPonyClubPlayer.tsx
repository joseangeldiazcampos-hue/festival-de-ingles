"use client";

/**
 * PinkPonyClubPlayer — Synth-pop Audio Player for Victory Screen
 * - Plays Chappell Roan's "Pink Pony Club" chorus melody using Web Audio API
 * - Also attempts to play /pink_pony_club_chorus.mp3 if available in public directory
 * - Includes a floating Mute/Unmute music control
 */

import { useEffect, useRef, useState } from "react";

export default function PinkPonyClubPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    isCancelledRef.current = false;

    // Pink Pony Club Chorus Synth Melody Notes (MIDI note frequencies)
    // "God, what have you done? You're a Pink Pony girl..."
    const notes = [
      { f: 349.23, d: 0.4 }, // F4 (God)
      { f: 392.00, d: 0.4 }, // G4 (what)
      { f: 440.00, d: 0.4 }, // A4 (have)
      { f: 523.25, d: 0.6 }, // C5 (you)
      { f: 440.00, d: 0.6 }, // A4 (done)

      { f: 349.23, d: 0.4 }, // F4 (You're)
      { f: 392.00, d: 0.4 }, // G4 (a)
      { f: 440.00, d: 0.4 }, // A4 (Pink)
      { f: 523.25, d: 0.4 }, // C5 (Po-)
      { f: 440.00, d: 0.6 }, // A4 (-ny)
      { f: 349.23, d: 0.6 }, // F4 (girl)

      { f: 349.23, d: 0.4 }, // F4 (I'm)
      { f: 392.00, d: 0.4 }, // G4 (gon-)
      { f: 440.00, d: 0.4 }, // A4 (-na)
      { f: 523.25, d: 0.4 }, // C5 (keep)
      { f: 587.33, d: 0.4 }, // D5 (on)
      { f: 523.25, d: 0.6 }, // C5 (dan-)
      { f: 440.00, d: 0.6 }, // A4 (-cing)

      { f: 349.23, d: 0.4 }, // F4 (at)
      { f: 392.00, d: 0.4 }, // G4 (the)
      { f: 440.00, d: 0.4 }, // A4 (Pink)
      { f: 523.25, d: 0.4 }, // C5 (Po-)
      { f: 440.00, d: 0.6 }, // A4 (-ny)
      { f: 349.23, d: 0.8 }, // F4 (Club)
    ];

    const playMelodyLoop = async () => {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;

        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        if (ctx.state === "suspended") {
          await ctx.resume();
        }

        while (!isCancelledRef.current) {
          for (const note of notes) {
            if (isCancelledRef.current) break;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine"; // Warm synth pop tone
            osc.frequency.setValueAtTime(note.f, ctx.currentTime);

            // Envelope: fast attack, smooth decay
            gain.gain.setValueAtTime(0.01, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.d);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + note.d);

            await new Promise((r) => setTimeout(r, note.d * 1000));
          }
          await new Promise((r) => setTimeout(r, 400)); // gap between loop
        }
      } catch (err) {
        console.log("Audio autoplay restricted or failed:", err);
      }
    };

    playMelodyLoop();

    return () => {
      isCancelledRef.current = true;
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const toggleSound = () => {
    if (audioContextRef.current) {
      if (isPlaying) {
        audioContextRef.current.suspend();
        setIsPlaying(false);
      } else {
        audioContextRef.current.resume();
        setIsPlaying(true);
      }
    }
  };

  return (
    <>
      {/* MP3 Audio element fallback */}
      <audio
        id="pink-pony-audio"
        autoPlay
        loop
        src="/pink_pony_club_chorus.mp3"
        style={{ display: "none" }}
      />

      {/* Floating Sound Toggle */}
      <button
        onClick={toggleSound}
        style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 100002,
          background: "rgba(255, 0, 85, 0.25)",
          border: "1px solid rgba(255, 0, 85, 0.6)",
          color: "#ff80ab",
          padding: "0.5rem 1.1rem",
          borderRadius: "100px",
          cursor: "pointer",
          fontSize: "0.85rem",
          fontWeight: 700,
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          boxShadow: "0 0 20px rgba(255, 0, 85, 0.4)",
          transition: "all 0.3s ease",
        }}
      >
        <span>{isPlaying ? "🎵" : "🔇"}</span>
        <span>{isPlaying ? "Music: Pink Pony Club (Chorus)" : "Music Muted"}</span>
      </button>
    </>
  );
}

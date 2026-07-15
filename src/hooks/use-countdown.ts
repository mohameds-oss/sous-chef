"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function playBeep() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    [0, 0.35, 0.7].forEach((offset) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.35, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.3);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + 0.32);
    });

    setTimeout(() => ctx.close(), 1200);
  } catch {
    // Web Audio unavailable (e.g. autoplay restrictions) — fail silently.
  }
}

export function useCountdown(initialSeconds: number) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setRunning(false);
          setJustCompleted(true);
          playBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const start = useCallback(() => {
    if (remainingSeconds === 0) return;
    setJustCompleted(false);
    setRunning(true);
  }, [remainingSeconds]);

  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback(
    (nextSeconds?: number) => {
      setRunning(false);
      setJustCompleted(false);
      const value = nextSeconds ?? totalSeconds;
      setTotalSeconds(value);
      setRemainingSeconds(value);
    },
    [totalSeconds]
  );

  return { totalSeconds, remainingSeconds, running, justCompleted, start, pause, reset };
}

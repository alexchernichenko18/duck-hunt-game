"use client";

import { useRef, useCallback } from "react";

export function useSound(src: string, options?: { loop?: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = options?.loop ?? false;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, [src, options?.loop]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { play, stop };
}

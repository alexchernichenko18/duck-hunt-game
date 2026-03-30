"use client";

import { useEffect, useRef } from "react";
import {
  FIRST_LAUNCH_DELAY,
  ROUND_DELAY_MIN,
  ROUND_DELAY_RANGE,
} from "@/constants/game";

export function useGameLoop(
  callback: () => void,
  isRoundActive: boolean
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLaunched = useRef(false);

  useEffect(() => {
    if (isRoundActive) return;

    const delay = hasLaunched.current
      ? ROUND_DELAY_MIN + Math.random() * ROUND_DELAY_RANGE
      : FIRST_LAUNCH_DELAY;

    timeoutRef.current = setTimeout(() => {
      hasLaunched.current = true;
      callback();
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isRoundActive, callback]);
}

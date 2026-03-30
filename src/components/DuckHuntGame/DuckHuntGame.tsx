"use client";

import { useCallback } from "react";
import {
  useAppSelector,
  useAppDispatch,
  launchDuck,
  DuckDirection,
} from "@/store/gameStore";
import { useGameLoop } from "@/hooks/useGameLoop";
import {
  DUCK_START_Y_MIN,
  DUCK_START_Y_RANGE,
  DUCK_SPEED_MIN,
  DUCK_SPEED_RANGE,
} from "@/constants/game";
import Duck from "@/components/Duck";
import ScoreBoard from "@/components/ScoreBoard";
import styles from "./DuckHuntGame.module.css";

export default function DuckHuntGame() {
  const dispatch = useAppDispatch();
  const isRoundActive = useAppSelector((state) => state.game.isRoundActive);

  const launch = useCallback(() => {
    const startY = DUCK_START_Y_MIN + Math.random() * DUCK_START_Y_RANGE;
    const direction: DuckDirection =
      Math.random() > 0.5 ? "left-to-right" : "right-to-left";
    const speed = DUCK_SPEED_MIN + Math.random() * DUCK_SPEED_RANGE;
    dispatch(launchDuck({ startY, direction, speed }));
  }, [dispatch]);

  useGameLoop(launch, isRoundActive);

  return (
    <div className={styles.gameArea}>
      <ScoreBoard />
      <Duck />
    </div>
  );
}

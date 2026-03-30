"use client";

import { useAppSelector } from "@/store/gameStore";
import styles from "./ScoreBoard.module.css";

export default function ScoreBoard() {
  const hits = useAppSelector((state) => state.game.hits);
  const rounds = useAppSelector((state) => state.game.rounds);

  return (
    <div className={styles.scoreboard}>
      <span className={styles.label}>Score</span>
      <span className={styles.value}>
        {hits} / {rounds}
      </span>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import {
  useAppSelector,
  useAppDispatch,
  hitDuck,
  duckEscaped,
  resetDuck,
} from "@/store/gameStore";
import { useSound } from "@/hooks/useSound";
import { WING_FLAP_INTERVAL, HIT_DISAPPEAR_DELAY } from "@/constants/game";
import styles from "./Duck.module.css";

const FRAMES = ["/assets/images/1.png", "/assets/images/2.png"];
const HIT_IMAGE = "/assets/images/3.png";

export default function Duck() {
  const dispatch = useAppDispatch();
  const duck = useAppSelector((state) => state.game.duck);
  const [frame, setFrame] = useState(0);
  const flapInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const hitTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const quack = useSound("/assets/audio/quack.mp3", { loop: true });
  const hitSound = useSound("/assets/audio/awp.mp3");

  useEffect(() => {
    if (duck.status === "flying") {
      quack.play();
      flapInterval.current = setInterval(() => {
        setFrame((prev) => (prev === 0 ? 1 : 0));
      }, WING_FLAP_INTERVAL);
    }

    return () => {
      if (flapInterval.current) clearInterval(flapInterval.current);
    };
  }, [duck.status, quack]);

  useEffect(() => {
    if (duck.status === "hit") {
      quack.stop();
      hitSound.play();

      hitTimeout.current = setTimeout(() => {
        dispatch(resetDuck());
      }, HIT_DISAPPEAR_DELAY);
    }

    return () => {
      if (hitTimeout.current) clearTimeout(hitTimeout.current);
    };
  }, [duck.status, quack, hitSound, dispatch]);

  useEffect(() => {
    if (duck.status === "escaped") {
      quack.stop();
    }
  }, [duck.status, quack]);

  const handleClick = () => {
    if (duck.status === "flying") {
      dispatch(hitDuck());
    }
  };

  const handleAnimationEnd = () => {
    if (duck.status === "flying") {
      dispatch(duckEscaped());
    }
  };

  if (duck.status === "idle" || duck.status === "escaped") {
    return null;
  }

  const isHit = duck.status === "hit";
  const imageSrc = isHit ? HIT_IMAGE : FRAMES[frame];

  const flyClass =
    duck.direction === "left-to-right"
      ? styles.flyLeftToRight
      : styles.flyRightToLeft;

  return (
    <div
      className={`${styles.duck} ${flyClass} ${isHit ? styles.hit : ""}`}
      style={{
        top: `${duck.startY}%`,
        animationDuration: `${duck.speed}ms`,
      }}
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
    >
      <img
        src={imageSrc}
        alt="duck"
        className={`${styles.duckImage} ${
          duck.direction === "left-to-right" ? styles.flipped : ""
        }`}
        draggable={false}
      />
    </div>
  );
}

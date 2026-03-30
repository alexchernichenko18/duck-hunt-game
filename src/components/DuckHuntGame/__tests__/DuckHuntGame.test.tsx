import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithStore } from "@/test-utils";
import DuckHuntGame from "../DuckHuntGame";

vi.stubGlobal(
  "Audio",
  function (this: { play: () => Promise<void>; pause: () => void; currentTime: number; loop: boolean }) {
    this.play = vi.fn().mockResolvedValue(undefined);
    this.pause = vi.fn();
    this.currentTime = 0;
    this.loop = false;
  }
);

describe("DuckHuntGame", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders score board", () => {
    renderWithStore(<DuckHuntGame />);
    expect(screen.getByText("Score")).toBeDefined();
    expect(screen.getByText("0 / 0")).toBeDefined();
  });

  it("launches duck after initial delay", () => {
    const { store } = renderWithStore(<DuckHuntGame />);

    expect(store.getState().game.rounds).toBe(0);
    vi.advanceTimersByTime(2000);
    expect(store.getState().game.rounds).toBe(1);
    expect(store.getState().game.duck.status).toBe("flying");
  });

  it("does not launch duck while round is active", () => {
    const { store } = renderWithStore(<DuckHuntGame />);

    vi.advanceTimersByTime(2000); // First duck
    expect(store.getState().game.rounds).toBe(1);

    vi.advanceTimersByTime(30000); // Wait max delay
    expect(store.getState().game.rounds).toBe(1); // Still 1 — round active
  });
});

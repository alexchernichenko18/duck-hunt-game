import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import {
  store,
  launchDuck,
  hitDuck,
  duckEscaped,
  resetDuck,
  RootState,
} from "../gameStore";

function createTestStore() {
  // Re-create store to get fresh state for each test
  const gameSlice = store.getState().game;
  return configureStore({
    reducer: { game: (state = gameSlice, action) => store.reducer({ game: state }, action).game },
  });
}

describe("gameStore", () => {
  describe("initial state", () => {
    it("starts with 0 hits and 0 rounds", () => {
      const state = store.getState();
      expect(state.game.hits).toBe(0);
      expect(state.game.rounds).toBe(0);
    });

    it("starts with duck in idle status", () => {
      const state = store.getState();
      expect(state.game.duck.status).toBe("idle");
    });

    it("starts with isRoundActive false", () => {
      const state = store.getState();
      expect(state.game.isRoundActive).toBe(false);
    });
  });

  describe("launchDuck", () => {
    it("increments rounds", () => {
      store.dispatch(launchDuck({ startY: 50, direction: "left-to-right", speed: 5000 }));
      expect(store.getState().game.rounds).toBeGreaterThanOrEqual(1);
    });

    it("sets duck to flying status with given params", () => {
      store.dispatch(launchDuck({ startY: 30, direction: "right-to-left", speed: 4000 }));
      const duck = store.getState().game.duck;
      expect(duck.status).toBe("flying");
      expect(duck.startY).toBe(30);
      expect(duck.direction).toBe("right-to-left");
      expect(duck.speed).toBe(4000);
    });

    it("sets isRoundActive to true", () => {
      store.dispatch(launchDuck({ startY: 50, direction: "left-to-right", speed: 5000 }));
      expect(store.getState().game.isRoundActive).toBe(true);
    });
  });

  describe("hitDuck", () => {
    it("increments hits and sets status to hit", () => {
      store.dispatch(launchDuck({ startY: 50, direction: "left-to-right", speed: 5000 }));
      const hitsBefore = store.getState().game.hits;
      store.dispatch(hitDuck());
      expect(store.getState().game.hits).toBe(hitsBefore + 1);
      expect(store.getState().game.duck.status).toBe("hit");
    });
  });

  describe("duckEscaped", () => {
    it("sets status to escaped and deactivates round", () => {
      store.dispatch(launchDuck({ startY: 50, direction: "left-to-right", speed: 5000 }));
      store.dispatch(duckEscaped());
      expect(store.getState().game.duck.status).toBe("escaped");
      expect(store.getState().game.isRoundActive).toBe(false);
    });

    it("does not increment hits", () => {
      const hitsBefore = store.getState().game.hits;
      store.dispatch(launchDuck({ startY: 50, direction: "left-to-right", speed: 5000 }));
      store.dispatch(duckEscaped());
      expect(store.getState().game.hits).toBe(hitsBefore);
    });
  });

  describe("resetDuck", () => {
    it("resets duck to idle and deactivates round", () => {
      store.dispatch(launchDuck({ startY: 50, direction: "left-to-right", speed: 5000 }));
      store.dispatch(hitDuck());
      store.dispatch(resetDuck());
      expect(store.getState().game.duck.status).toBe("idle");
      expect(store.getState().game.isRoundActive).toBe(false);
    });
  });
});

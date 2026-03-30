import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { RootState } from "@/store/gameStore";

// Re-create the slice reducer inline to avoid singleton store issues
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { DuckDirection, DuckStatus } from "@/store/gameStore";

interface DuckState {
  status: DuckStatus;
  startY: number;
  direction: DuckDirection;
  speed: number;
}

const initialDuck: DuckState = {
  status: "idle",
  startY: 50,
  direction: "left-to-right",
  speed: 5000,
};

const gameSlice = createSlice({
  name: "game",
  initialState: {
    hits: 0,
    rounds: 0,
    duck: initialDuck,
    isRoundActive: false,
  },
  reducers: {
    launchDuck: (
      state,
      action: PayloadAction<{ startY: number; direction: DuckDirection; speed: number }>
    ) => {
      state.rounds += 1;
      state.isRoundActive = true;
      state.duck = { status: "flying" as const, ...action.payload };
    },
    hitDuck: (state) => {
      state.hits += 1;
      state.duck.status = "hit";
    },
    duckEscaped: (state) => {
      state.duck.status = "escaped";
      state.isRoundActive = false;
    },
    resetDuck: (state) => {
      state.duck = { ...initialDuck };
      state.isRoundActive = false;
    },
  },
});

type PreloadedGameState = Partial<RootState["game"]>;

export function createTestStore(preloadedState?: PreloadedGameState) {
  return configureStore({
    reducer: { game: gameSlice.reducer },
    preloadedState: preloadedState
      ? { game: { ...gameSlice.getInitialState(), ...preloadedState } }
      : undefined,
  });
}

export function renderWithStore(
  ui: React.ReactElement,
  {
    preloadedState,
    ...renderOptions
  }: { preloadedState?: PreloadedGameState } & Omit<RenderOptions, "wrapper"> = {}
) {
  const store = createTestStore(preloadedState);
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

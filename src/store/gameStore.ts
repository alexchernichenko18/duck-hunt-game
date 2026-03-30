import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";

export type DuckDirection = "left-to-right" | "right-to-left";
export type DuckStatus = "idle" | "flying" | "hit" | "escaped";

interface DuckState {
  status: DuckStatus;
  startY: number;
  direction: DuckDirection;
  speed: number;
}

interface GameState {
  hits: number;
  rounds: number;
  duck: DuckState;
  isRoundActive: boolean;
}

const initialDuck: DuckState = {
  status: "idle",
  startY: 50,
  direction: "left-to-right",
  speed: 5000,
};

const initialState: GameState = {
  hits: 0,
  rounds: 0,
  duck: initialDuck,
  isRoundActive: false,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    launchDuck: (
      state,
      action: PayloadAction<{
        startY: number;
        direction: DuckDirection;
        speed: number;
      }>
    ) => {
      state.rounds += 1;
      state.isRoundActive = true;
      state.duck = {
        status: "flying",
        startY: action.payload.startY,
        direction: action.payload.direction,
        speed: action.payload.speed,
      };
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

export const { launchDuck, hitDuck, duckEscaped, resetDuck } =
  gameSlice.actions;

export const store = configureStore({
  reducer: {
    game: gameSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

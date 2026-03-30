import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithStore } from "@/test-utils";
import ScoreBoard from "../ScoreBoard";

describe("ScoreBoard", () => {
  it("renders 0 / 0 by default", () => {
    renderWithStore(<ScoreBoard />);
    expect(screen.getByText("0 / 0")).toBeDefined();
  });

  it("renders correct hits / rounds", () => {
    renderWithStore(<ScoreBoard />, {
      preloadedState: { hits: 3, rounds: 5 },
    });
    expect(screen.getByText("3 / 5")).toBeDefined();
  });

  it("renders Score label", () => {
    renderWithStore(<ScoreBoard />);
    expect(screen.getByText("Score")).toBeDefined();
  });
});

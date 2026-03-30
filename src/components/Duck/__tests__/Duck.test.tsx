import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithStore } from "@/test-utils";
import Duck from "../Duck";

const mockPlay = vi.fn().mockResolvedValue(undefined);
const mockPause = vi.fn();

vi.stubGlobal(
  "Audio",
  function (this: { play: typeof mockPlay; pause: typeof mockPause; currentTime: number; loop: boolean }) {
    this.play = mockPlay;
    this.pause = mockPause;
    this.currentTime = 0;
    this.loop = false;
  }
);

describe("Duck", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when duck is idle", () => {
    const { container } = renderWithStore(<Duck />);
    expect(container.innerHTML).toBe("");
  });

  it("renders duck image when flying", () => {
    renderWithStore(<Duck />, {
      preloadedState: {
        duck: {
          status: "flying",
          startY: 50,
          direction: "left-to-right",
          speed: 5000,
        },
        isRoundActive: true,
      },
    });
    const img = screen.getByAltText("duck");
    expect(img).toBeDefined();
    expect(img.getAttribute("src")).toContain("/assets/images/");
  });

  it("shows hit image when duck is hit", () => {
    renderWithStore(<Duck />, {
      preloadedState: {
        duck: {
          status: "hit",
          startY: 50,
          direction: "left-to-right",
          speed: 5000,
        },
        isRoundActive: true,
      },
    });
    const img = screen.getByAltText("duck");
    expect(img.getAttribute("src")).toBe("/assets/images/3.png");
  });

  it("renders nothing when duck escaped", () => {
    const { container } = renderWithStore(<Duck />, {
      preloadedState: {
        duck: {
          status: "escaped",
          startY: 50,
          direction: "left-to-right",
          speed: 5000,
        },
        isRoundActive: false,
      },
    });
    expect(container.innerHTML).toBe("");
  });

  it("applies flipped class when flying left-to-right", () => {
    renderWithStore(<Duck />, {
      preloadedState: {
        duck: {
          status: "flying",
          startY: 50,
          direction: "left-to-right",
          speed: 5000,
        },
        isRoundActive: true,
      },
    });
    const img = screen.getByAltText("duck");
    expect(img.className).toContain("flipped");
  });

  it("does not apply flipped class when flying right-to-left", () => {
    renderWithStore(<Duck />, {
      preloadedState: {
        duck: {
          status: "flying",
          startY: 50,
          direction: "right-to-left",
          speed: 5000,
        },
        isRoundActive: true,
      },
    });
    const img = screen.getByAltText("duck");
    expect(img.className).not.toContain("flipped");
  });

  it("dispatches hitDuck on click when flying", () => {
    const { store } = renderWithStore(<Duck />, {
      preloadedState: {
        duck: {
          status: "flying",
          startY: 50,
          direction: "left-to-right",
          speed: 5000,
        },
        isRoundActive: true,
        hits: 0,
      },
    });
    const duckEl = screen.getByAltText("duck").parentElement!;
    fireEvent.click(duckEl);
    expect(store.getState().game.hits).toBe(1);
    expect(store.getState().game.duck.status).toBe("hit");
  });
});

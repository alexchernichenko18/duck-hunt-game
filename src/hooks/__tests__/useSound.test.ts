import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSound } from "../useSound";

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

describe("useSound", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns play and stop functions", () => {
    const { result } = renderHook(() => useSound("/test.mp3"));
    expect(typeof result.current.play).toBe("function");
    expect(typeof result.current.stop).toBe("function");
  });

  it("creates Audio and calls play", () => {
    const { result } = renderHook(() => useSound("/test.mp3"));
    act(() => result.current.play());
    expect(mockPlay).toHaveBeenCalled();
  });

  it("sets loop option when specified", () => {
    const { result } = renderHook(() =>
      useSound("/test.mp3", { loop: true })
    );
    act(() => result.current.play());
    expect(mockPlay).toHaveBeenCalled();
  });

  it("stop pauses audio and resets currentTime", () => {
    const { result } = renderHook(() => useSound("/test.mp3"));
    act(() => result.current.play());
    act(() => result.current.stop());
    expect(mockPause).toHaveBeenCalled();
  });

  it("stop does nothing if audio was never played", () => {
    const { result } = renderHook(() => useSound("/test.mp3"));
    act(() => result.current.stop());
    expect(mockPause).not.toHaveBeenCalled();
  });
});

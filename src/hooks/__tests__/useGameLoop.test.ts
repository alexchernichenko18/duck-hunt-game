import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGameLoop } from "../useGameLoop";

describe("useGameLoop", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls callback after initial delay when not active", () => {
    const callback = vi.fn();
    renderHook(() => useGameLoop(callback, false));

    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not call callback when round is active", () => {
    const callback = vi.fn();
    renderHook(() => useGameLoop(callback, true));

    vi.advanceTimersByTime(30000);
    expect(callback).not.toHaveBeenCalled();
  });

  it("uses longer delay after first launch", () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ active }) => useGameLoop(callback, active),
      { initialProps: { active: false } }
    );

    // First launch at 2s
    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(1);

    // Simulate round active then inactive
    rerender({ active: true });
    rerender({ active: false });

    // Second launch should take 10-30s, not 2s
    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(1); // Still 1 — hasn't fired yet

    vi.advanceTimersByTime(28000); // Total 30s — must have fired
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("cleans up timeout on unmount", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useGameLoop(callback, false));

    unmount();
    vi.advanceTimersByTime(30000);
    expect(callback).not.toHaveBeenCalled();
  });
});

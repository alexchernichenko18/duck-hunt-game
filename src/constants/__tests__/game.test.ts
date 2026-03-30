import { describe, it, expect } from "vitest";
import {
  FIRST_LAUNCH_DELAY,
  ROUND_DELAY_MIN,
  ROUND_DELAY_RANGE,
  DUCK_START_Y_MIN,
  DUCK_START_Y_RANGE,
  DUCK_SPEED_MIN,
  DUCK_SPEED_RANGE,
  WING_FLAP_INTERVAL,
  HIT_DISAPPEAR_DELAY,
} from "../game";

describe("game constants", () => {
  it("first launch delay is 2 seconds", () => {
    expect(FIRST_LAUNCH_DELAY).toBe(2000);
  });

  it("round delay range produces 10-30 second intervals", () => {
    expect(ROUND_DELAY_MIN).toBe(10000);
    expect(ROUND_DELAY_MIN + ROUND_DELAY_RANGE).toBe(30000);
  });

  it("duck start Y covers 10-80% of screen", () => {
    expect(DUCK_START_Y_MIN).toBe(10);
    expect(DUCK_START_Y_MIN + DUCK_START_Y_RANGE).toBe(80);
  });

  it("duck speed range is 3.5-6.5 seconds", () => {
    expect(DUCK_SPEED_MIN).toBe(3500);
    expect(DUCK_SPEED_MIN + DUCK_SPEED_RANGE).toBe(6500);
  });

  it("wing flap interval is 200ms", () => {
    expect(WING_FLAP_INTERVAL).toBe(200);
  });

  it("hit disappear delay is 3 seconds", () => {
    expect(HIT_DISAPPEAR_DELAY).toBe(3000);
  });
});

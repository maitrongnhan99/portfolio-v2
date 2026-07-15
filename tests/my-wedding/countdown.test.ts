import { describe, it, expect } from "vitest";
import { getTimeLeft } from "@/app/(app)/my-wedding/lib/countdown";

const target = "2026-07-30T18:00:00+07:00";
describe("getTimeLeft", () => {
  it("computes days/hours/minutes/seconds remaining", () => {
    const now = Date.parse("2026-07-29T17:00:00+07:00"); // 1 day 1 hour before
    const t = getTimeLeft(target, now);
    expect(t).toMatchObject({ days: 1, hours: 1, minutes: 0, seconds: 0, past: false });
  });
  it("flags past when target already happened", () => {
    const now = Date.parse("2026-08-01T00:00:00+07:00");
    expect(getTimeLeft(target, now)).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 0, past: true });
  });
});

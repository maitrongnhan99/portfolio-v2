import { describe, it, expect } from "vitest";
import { weddingData } from "@/app/(app)/my-wedding/data";

describe("weddingData", () => {
  it("has the couple and combined title", () => {
    expect(weddingData.couple.groom.name).toBe("Mai Trọng Nhân");
    expect(weddingData.couple.bride.name).toBe("Trương Ngọc Yến Linh");
    expect(weddingData.couple.combined).toMatch(/&/);
  });
  it("event datetime is a valid future-facing ISO string", () => {
    expect(weddingData.event.datetime).toBe("2026-07-28T09:00:00+07:00");
    expect(Number.isNaN(Date.parse(weddingData.event.datetime))).toBe(false);
  });
  it("has exactly 7 gallery photos all under /wedding/", () => {
    expect(weddingData.gallery).toHaveLength(7);
    for (const p of weddingData.gallery) expect(p.src.startsWith("/wedding/")).toBe(true);
  });
  it("has a 5-step timeline and at least one seeded wish", () => {
    expect(weddingData.timeline).toHaveLength(5);
    expect(weddingData.wishes.length).toBeGreaterThan(0);
    for (const w of weddingData.wishes) expect(w.id && w.createdAt).toBeTruthy();
  });
});

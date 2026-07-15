import { describe, it, expect } from "vitest";
import { makeWish, prependWish } from "@/app/(app)/my-wedding/lib/wishes";

describe("wishes", () => {
  it("makeWish trims and stamps deterministically", () => {
    const w = makeWish({ name: "  An  ", message: "  Chúc mừng  ", avatar: "🌿" }, 1_700_000_000_000);
    expect(w.name).toBe("An");
    expect(w.message).toBe("Chúc mừng");
    expect(w.id).toBe("1700000000000");
    expect(w.createdAt).toBe(new Date(1_700_000_000_000).toISOString());
  });
  it("prependWish returns a new array with the wish first (no mutation)", () => {
    const base = [{ id: "1", name: "B", message: "x", avatar: "🌸", createdAt: "t" }];
    const next = prependWish(base, { id: "2", name: "A", message: "y", avatar: "🌿", createdAt: "t2" });
    expect(next).toHaveLength(2);
    expect(next[0].id).toBe("2");
    expect(base).toHaveLength(1); // original untouched
  });
});

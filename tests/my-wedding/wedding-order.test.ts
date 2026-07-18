import { describe, it, expect } from "vitest";
import { resolveCoupleOrder } from "@/app/(app)/my-wedding/lib/wedding-order";
import { weddingData } from "@/app/(app)/my-wedding/data";

describe("resolveCoupleOrder", () => {
  it("puts the groom and his family first for the groom side", () => {
    const order = resolveCoupleOrder("groom");
    expect(order.first).toEqual(weddingData.couple.groom);
    expect(order.second).toEqual(weddingData.couple.bride);
    expect(order.firstParents).toEqual(weddingData.parents.groom);
    expect(order.combined).toBe(weddingData.couple.combined);
  });

  it("puts the bride and her family first for the bride side", () => {
    const order = resolveCoupleOrder("bride");
    expect(order.first).toEqual(weddingData.couple.bride);
    expect(order.second).toEqual(weddingData.couple.groom);
    expect(order.firstParents).toEqual(weddingData.parents.bride);
    expect(order.firstPortrait).toEqual(weddingData.portraits.bride);
    expect(order.combined).toBe("Yến Linh & Trọng Nhân");
  });
});

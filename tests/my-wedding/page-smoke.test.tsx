import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import WeddingPage from "@/app/(app)/my-wedding/page";

describe("WeddingPage", () => {
  it("renders the wedding main landmark and couple name", async () => {
    render(await WeddingPage({ searchParams: Promise.resolve({}) }));
    expect(screen.getByTestId("wedding-page")).toBeInTheDocument();
    expect(screen.getAllByText(/Trọng Nhân/).length).toBeGreaterThan(0);
  });
});

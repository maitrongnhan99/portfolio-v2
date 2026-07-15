import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import WeddingPage from "@/app/(app)/my-wedding/page";

describe("WeddingPage", () => {
  it("renders the wedding main landmark and couple name", () => {
    render(<WeddingPage />);
    expect(screen.getByTestId("wedding-page")).toBeInTheDocument();
    expect(screen.getAllByText(/Hải Nam/).length).toBeGreaterThan(0);
  });
});

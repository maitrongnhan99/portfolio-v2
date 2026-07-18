import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Hero from "@/app/(app)/my-wedding/_components/hero";

describe("Hero", () => {
  it("renders eyebrow and the hero image alt", () => {
    render(<Hero />);
    expect(screen.getByText(/WELCOME TO OUR WEDDING/i)).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
});

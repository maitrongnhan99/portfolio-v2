import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CeremonyInfo from "@/app/(app)/my-wedding/_components/ceremony-info";

describe("CeremonyInfo", () => {
  it("shows both names and the day number", () => {
    render(<CeremonyInfo />);
    expect(screen.getByText("Võ Hải Nam")).toBeInTheDocument();
    expect(screen.getByText("Huỳnh Khánh Linh")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });
});

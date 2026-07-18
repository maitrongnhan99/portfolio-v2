import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ReceptionInfo from "@/app/(app)/my-wedding/_components/reception-info";
import { weddingData } from "@/app/(app)/my-wedding/data";
import { resolveWeddingDate } from "@/app/(app)/my-wedding/lib/wedding-date";

const groomDate = resolveWeddingDate("groom");

describe("ReceptionInfo", () => {
  it("renders the host family's venue name and address for the active side", () => {
    render(<ReceptionInfo eventDate={groomDate} />);
    expect(screen.getByText("Tư gia nhà trai")).toBeInTheDocument();
    expect(
      screen.getByText(weddingData.parents.groom.address),
    ).toBeInTheDocument();
  });

  it("marks the wedding day on the calendar widget", () => {
    render(<ReceptionInfo eventDate={groomDate} />);
    const cells = screen.getAllByText(groomDate.dateBlock.day);
    expect(
      cells.some((cell) => cell.closest("[data-active='true']") !== null),
    ).toBe(true);
  });
});

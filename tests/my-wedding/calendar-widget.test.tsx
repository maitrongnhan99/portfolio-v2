import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CalendarWidget } from "@/app/(app)/my-wedding/_components/calendar-widget";

describe("CalendarWidget", () => {
  it("renders the target day and marks it", () => {
    render(<CalendarWidget year={2026} month={7} day={30} />);
    const cell = screen.getByText("30");
    expect(cell).toBeInTheDocument();
    expect(cell.closest("[data-active='true']")).not.toBeNull();
  });
});

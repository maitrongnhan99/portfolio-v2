import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CeremonyInfo from "@/app/(app)/my-wedding/_components/ceremony-info";
import { resolveWeddingDate } from "@/app/(app)/my-wedding/lib/wedding-date";
import { resolveCoupleOrder } from "@/app/(app)/my-wedding/lib/wedding-order";

describe("CeremonyInfo", () => {
  it("shows both names and the day number", () => {
    render(<CeremonyInfo eventDate={resolveWeddingDate("groom")} />);
    expect(screen.getByText("Mai Trọng Nhân")).toBeInTheDocument();
    expect(screen.getByText("Trương Ngọc Yến Linh")).toBeInTheDocument();
    expect(screen.getByText("28")).toBeInTheDocument();
  });

  it("lists the bride first when the bride side is active", () => {
    render(
      <CeremonyInfo
        eventDate={resolveWeddingDate("bride")}
        order={resolveCoupleOrder("bride")}
      />,
    );
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings[0]).toHaveTextContent("Trương Ngọc Yến Linh");
    expect(headings[1]).toHaveTextContent("Mai Trọng Nhân");
  });
});

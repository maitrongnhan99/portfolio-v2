import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeAll } from "vitest";
import CoverGate from "@/app/(app)/my-wedding/_components/cover-gate";

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    ((q: string) =>
      ({
        matches: false,
        media: q,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as any);
});

describe("CoverGate", () => {
  it("hides children until 'Mở thiệp' is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CoverGate>
        <p>INNER CARD</p>
      </CoverGate>,
    );
    expect(screen.queryByText("INNER CARD")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Mở thiệp/i }));
    expect(await screen.findByText("INNER CARD")).toBeInTheDocument();
  });
});

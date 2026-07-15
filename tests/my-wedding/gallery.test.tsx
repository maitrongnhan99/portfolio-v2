import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeAll } from "vitest";
import Gallery from "@/app/(app)/my-wedding/_components/gallery";

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

  global.ResizeObserver =
    global.ResizeObserver ||
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
});

describe("Gallery", () => {
  it("renders 6 thumbnails and opens a lightbox on click", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    const imgs = screen.getAllByRole("img");
    expect(imgs.length).toBeGreaterThanOrEqual(6);
    await user.click(screen.getAllByRole("button")[0]);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });
});

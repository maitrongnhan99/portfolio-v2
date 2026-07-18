import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeAll } from "vitest";
import Gallery from "@/app/(app)/my-wedding/_components/gallery";
import { weddingData } from "@/app/(app)/my-wedding/data";

const total = weddingData.gallery.length;

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

  it("navigates between photos with next/previous buttons", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    await user.click(screen.getAllByRole("button")[0]);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(`1 / ${total}`)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /ảnh tiếp theo/i }));
    expect(screen.getByText(`2 / ${total}`)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /ảnh trước/i }));
    expect(screen.getByText(`1 / ${total}`)).toBeInTheDocument();

    // wraps around from the first photo to the last
    await user.click(screen.getByRole("button", { name: /ảnh trước/i }));
    expect(screen.getByText(`${total} / ${total}`)).toBeInTheDocument();
  });

  it("closes the lightbox with the visible close button", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    await user.click(screen.getAllByRole("button")[0]);
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: /đóng/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

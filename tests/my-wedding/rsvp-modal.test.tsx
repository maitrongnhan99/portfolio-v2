import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeAll } from "vitest";
import RsvpModal from "@/app/(app)/my-wedding/_components/rsvp-modal";

const toastMock = vi.fn();
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: toastMock }) }));

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

describe("RsvpModal", () => {
  it("disables submit until a name is entered, then toasts", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<RsvpModal open onOpenChange={onOpenChange} />);
    const submit = screen.getByRole("button", { name: /Gửi xác nhận/i });
    expect(submit).toBeDisabled();
    await user.type(screen.getByLabelText(/Tên/i), "An Nguyễn");
    expect(submit).toBeEnabled();
    await user.click(submit);
    expect(toastMock).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

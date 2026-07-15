import { render, screen, act } from "@testing-library/react";
import { it, expect, beforeEach, afterEach, vi } from "vitest";
import Countdown from "@/app/(app)/my-wedding/_components/countdown";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it("renders countdown cells and ticks", () => {
  vi.setSystemTime(new Date("2026-07-30T17:59:55+07:00"));
  render(<Countdown targetISO="2026-07-30T18:00:00+07:00" />);
  act(() => {
    vi.advanceTimersByTime(0);
  }); // flush mount effect
  expect(screen.getByText(/Giây/i).parentElement).toHaveTextContent("05");
  act(() => {
    vi.advanceTimersByTime(2000);
  });
  expect(screen.getByText(/Giây/i).parentElement).toHaveTextContent("03");
});

it("shows 'Đã diễn ra' when the date passed", () => {
  vi.setSystemTime(new Date("2026-08-01T00:00:00+07:00"));
  render(<Countdown targetISO="2026-07-30T18:00:00+07:00" />);
  act(() => {
    vi.advanceTimersByTime(0);
  });
  expect(screen.getByText(/Đã diễn ra/i)).toBeInTheDocument();
});

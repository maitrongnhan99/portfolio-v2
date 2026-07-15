import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import Countdown from "@/app/(app)/my-wedding/_components/countdown";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it("renders countdown cells and ticks", () => {
  vi.setSystemTime(new Date("2026-07-29T17:59:58+07:00"));
  render(<Countdown targetISO="2026-07-30T18:00:00+07:00" />);
  act(() => {
    vi.advanceTimersByTime(0);
  }); // mount effect
  expect(screen.getByText(/Ngày/i)).toBeInTheDocument();
  act(() => {
    vi.advanceTimersByTime(1000);
  });
  expect(screen.getByText(/Giây/i)).toBeInTheDocument();
});

it("shows 'Đã diễn ra' when the date passed", () => {
  vi.setSystemTime(new Date("2026-08-01T00:00:00+07:00"));
  render(<Countdown targetISO="2026-07-30T18:00:00+07:00" />);
  act(() => {
    vi.advanceTimersByTime(0);
  });
  expect(screen.getByText(/Đã diễn ra/i)).toBeInTheDocument();
});

import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAutoScroll } from "@/app/(app)/my-wedding/lib/use-auto-scroll";

describe("useAutoScroll", () => {
  let rafQueue: FrameRequestCallback[];
  let scrollTo: ReturnType<typeof vi.fn>;
  let now: number;

  const flushFrame = () => {
    const callbacks = rafQueue;
    rafQueue = [];
    now += 16;
    for (const cb of callbacks) cb(now);
  };

  beforeEach(() => {
    vi.useFakeTimers();
    rafQueue = [];
    now = 0;
    scrollTo = vi.fn();

    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((cb: FrameRequestCallback) => {
        rafQueue.push(cb);
        return rafQueue.length;
      }),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal("scrollTo", scrollTo);
    window.matchMedia = ((query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList) as typeof window.matchMedia;

    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 10_000,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("does nothing while disabled", () => {
    renderHook(() => useAutoScroll(false));
    vi.advanceTimersByTime(5000);
    expect(rafQueue).toHaveLength(0);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("starts scrolling after the delay when enabled", () => {
    renderHook(() => useAutoScroll(true, { startDelayMs: 1000 }));

    vi.advanceTimersByTime(999);
    expect(rafQueue).toHaveLength(0);

    vi.advanceTimersByTime(1);
    expect(rafQueue).toHaveLength(1);

    flushFrame(); // first frame only records the timestamp
    flushFrame(); // second frame scrolls
    expect(scrollTo).toHaveBeenCalled();
  });

  it("stops scrolling on user interaction", () => {
    renderHook(() => useAutoScroll(true, { startDelayMs: 0 }));
    vi.advanceTimersByTime(0);
    flushFrame();
    flushFrame();
    const callsBefore = scrollTo.mock.calls.length;
    expect(callsBefore).toBeGreaterThan(0);

    window.dispatchEvent(new Event("wheel"));
    flushFrame();
    flushFrame();
    expect(scrollTo.mock.calls.length).toBe(callsBefore);
  });
});

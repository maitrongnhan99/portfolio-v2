"use client";

import { useEffect } from "react";

const STOP_EVENTS = ["wheel", "touchstart", "pointerdown", "keydown"] as const;

/**
 * Slowly scrolls the page down while `enabled`, so guests can read the card
 * hands-free after opening the invitation. Any user input (scroll wheel,
 * touch, key, click) stops it for good. No-op when reduced motion is set.
 */
export function useAutoScroll(
  enabled: boolean,
  { speed = 60, startDelayMs = 1500 }: { speed?: number; startDelayMs?: number } = {},
): void {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    let lastTime: number | null = null;
    let position: number | null = null;
    let stopped = false;

    const removeListeners = () => {
      for (const event of STOP_EVENTS) window.removeEventListener(event, stop);
    };

    const stop = () => {
      stopped = true;
      cancelAnimationFrame(rafId);
      removeListeners();
    };

    const step = (time: number) => {
      if (stopped) return;

      if (lastTime !== null) {
        position = (position ?? window.scrollY) + ((time - lastTime) / 1000) * speed;
        window.scrollTo(0, position);

        const bottom = document.documentElement.scrollHeight - window.innerHeight;
        if (position >= bottom) {
          stop();
          return;
        }
      }

      lastTime = time;
      rafId = requestAnimationFrame(step);
    };

    const timeoutId = window.setTimeout(() => {
      rafId = requestAnimationFrame(step);
    }, startDelayMs);

    for (const event of STOP_EVENTS) {
      window.addEventListener(event, stop, { passive: true });
    }

    return () => {
      window.clearTimeout(timeoutId);
      stop();
    };
  }, [enabled, speed, startDelayMs]);
}

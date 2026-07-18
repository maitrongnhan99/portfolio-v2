"use client";

import { useEffect, useState } from "react";
import { getTimeLeft } from "../lib/countdown";

interface CountdownCellProps {
  value: number;
  label: string;
}

function CountdownCell({ value, label }: CountdownCellProps) {
  return (
    <div className="flex min-w-[64px] flex-col items-center gap-1 rounded-2xl border border-[var(--wed-gold)]/50 bg-[var(--wed-cream)] px-3 py-3 sm:min-w-[80px] sm:px-4 sm:py-4">
      <span className="wed-display text-3xl leading-none text-[var(--wed-ink)] sm:text-4xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="font-[Inter] text-[10px] uppercase tracking-[0.25em] text-[var(--wed-ink)]/70 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export default function Countdown({ targetISO }: { targetISO: string }) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());

    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!mounted) {
    return null;
  }

  const timeLeft = getTimeLeft(targetISO, now);

  if (timeLeft.past) {
    return (
      <p className="wed-display text-2xl text-[var(--wed-ink)] sm:text-3xl">
        Đã diễn ra
      </p>
    );
  }

  return (
    <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
      <CountdownCell value={timeLeft.days} label="Ngày" />
      <CountdownCell value={timeLeft.hours} label="Giờ" />
      <CountdownCell value={timeLeft.minutes} label="Phút" />
      <CountdownCell value={timeLeft.seconds} label="Giây" />
    </div>
  );
}

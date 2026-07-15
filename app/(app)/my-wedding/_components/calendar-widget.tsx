import type { JSX } from "react";

const WEEKDAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

interface CalendarWidgetProps {
  year: number;
  month: number; // 1-based (July = 7)
  day: number;
}

interface DayCell {
  date: number | null;
  key: string;
}

function buildWeeks(year: number, month: number): DayCell[][] {
  const firstOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startWeekday = firstOfMonth.getDay(); // 0 = Sunday

  const cells: DayCell[] = [];

  for (let i = 0; i < startWeekday; i += 1) {
    cells.push({ date: null, key: `lead-${i}` });
  }

  for (let date = 1; date <= daysInMonth; date += 1) {
    cells.push({ date, key: `day-${date}` });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ date: null, key: `trail-${cells.length}` });
  }

  const weeks: DayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return weeks;
}

export function CalendarWidget({
  year,
  month,
  day,
}: CalendarWidgetProps): JSX.Element {
  const weeks = buildWeeks(year, month);

  return (
    <div className="w-full max-w-xs border border-[var(--wed-gold)]/40 bg-[var(--wed-cream)] p-4 sm:p-5">
      <div className="mb-3 grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <span
            key={label}
            className="text-center font-[Inter] text-[10px] uppercase tracking-[0.15em] text-[var(--wed-ink)]/50"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((cell) => {
              const isActive = cell.date === day;

              return (
                <div
                  key={cell.key}
                  data-active={isActive ? "true" : undefined}
                  className={
                    isActive
                      ? "flex aspect-square items-center justify-center rounded-full bg-[var(--wed-green)] font-[Inter] text-xs text-[var(--wed-cream-text)] ring-2 ring-[var(--wed-green)] ring-offset-1 ring-offset-[var(--wed-cream)]"
                      : "flex aspect-square items-center justify-center font-[Inter] text-xs text-[var(--wed-ink)]/80"
                  }
                >
                  {cell.date ?? ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

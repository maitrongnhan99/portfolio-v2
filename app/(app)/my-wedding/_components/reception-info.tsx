import type { JSX } from "react";
import { weddingData } from "../data";
import { SectionHeading } from "./section-heading";
import Countdown from "./countdown";
import { CalendarWidget } from "./calendar-widget";

function buildGoogleCalendarUrl(event: typeof weddingData.event): string {
  const start = new Date(event.datetime);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000); // default 3h reception

  const toGCalStamp = (date: Date): string =>
    date
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0] + "Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Tiệc cưới ${weddingData.couple.combined}`,
    dates: `${toGCalStamp(start)}/${toGCalStamp(end)}`,
    details: `Trân trọng kính mời quý khách đến chung vui tiệc cưới của ${weddingData.couple.combined}.`,
    location: `${weddingData.reception.venueName}, ${weddingData.reception.address}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function ReceptionInfo({
  onRsvp,
}: {
  onRsvp: () => void;
}): JSX.Element {
  const { event, reception } = weddingData;
  const calendarUrl = buildGoogleCalendarUrl(event);

  return (
    <section
      aria-label="Thông tin tiệc cưới"
      className="flex flex-col items-center gap-8 px-6 py-16 text-center sm:py-20"
    >
      <SectionHeading>THÔNG TIN TIỆC CƯỚI</SectionHeading>

      <div className="flex flex-col items-center gap-2">
        <p className="wed-display text-2xl text-[var(--wed-ink)] sm:text-3xl">
          {reception.venueName}
        </p>
        <p className="max-w-md font-[Inter] text-sm text-[var(--wed-ink)]/70">
          {reception.address}
        </p>
        <p className="font-[Inter] text-sm uppercase tracking-[0.2em] text-[var(--wed-gold)]">
          {event.timeLabel}
        </p>
      </div>

      <Countdown targetISO={event.datetime} />

      <CalendarWidget year={2026} month={7} day={30} />

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[var(--wed-gold)] px-6 py-3 font-[Inter] text-xs uppercase tracking-[0.25em] text-[var(--wed-ink)] transition-colors hover:bg-[var(--wed-gold)]/10"
        >
          Thêm vào lịch
        </a>

        <button
          type="button"
          onClick={onRsvp}
          className="bg-[var(--wed-green)] px-6 py-3 font-[Inter] text-xs uppercase tracking-[0.25em] text-[var(--wed-cream-text)] transition-colors hover:bg-[var(--wed-green-deep)]"
        >
          Xác nhận tham dự
        </button>
      </div>
    </section>
  );
}

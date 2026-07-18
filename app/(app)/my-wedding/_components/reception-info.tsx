import type { JSX } from "react";
import { weddingData } from "../data";
import { SectionHeading } from "./section-heading";
import Countdown from "./countdown";
import { CalendarWidget } from "./calendar-widget";
import type { ResolvedWeddingDate } from "../lib/wedding-date";

export default function ReceptionInfo({
  eventDate,
}: {
  eventDate: ResolvedWeddingDate;
}): JSX.Element {
  const { dateBlock } = eventDate;
  const address = weddingData.parents[eventDate.side].address;
  const venueName =
    eventDate.side === "groom" ? "Tư gia nhà trai" : "Tư gia nhà gái";

  return (
    <section
      aria-label="Thông tin tiệc cưới"
      className="flex flex-col items-center gap-8 px-6 py-16 text-center sm:py-20"
    >
      <SectionHeading>THÔNG TIN TIỆC CƯỚI</SectionHeading>

      <div className="flex flex-col items-center gap-2">
        <p className="wed-display text-2xl text-[var(--wed-ink)] sm:text-3xl">
          {venueName}
        </p>
        <p className="max-w-md font-[Inter] text-sm text-[var(--wed-ink)]/70">
          {address}
        </p>
        <p className="font-[Inter] text-sm uppercase tracking-[0.2em] text-[var(--wed-gold)]">
          {eventDate.timeLabel}
        </p>
      </div>

      <Countdown targetISO={eventDate.datetime} />

      <CalendarWidget
        year={Number(dateBlock.year)}
        month={Number(dateBlock.month)}
        day={Number(dateBlock.day)}
      />
    </section>
  );
}

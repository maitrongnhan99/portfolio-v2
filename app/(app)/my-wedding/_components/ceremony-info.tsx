import Image from "next/image";
import { weddingData } from "../data";
import { SectionHeading } from "./section-heading";
import type { Parents } from "../types";
import type { ResolvedWeddingDate } from "../lib/wedding-date";
import {
  resolveCoupleOrder,
  type OrderedCouple,
} from "../lib/wedding-order";

function parentHeader(parents: Parents): string {
  if (parents.father && parents.mother) return "Ông Bà";
  if (parents.father) return "Ông";
  return "Bà";
}

function ParentColumn({ parents }: { parents: Parents }) {
  return (
    <div className="flex flex-col items-center gap-2 px-2 text-center">
      <p className="wed-display text-lg text-[var(--wed-ink)]/60">
        {parentHeader(parents)}
      </p>
      {parents.father ? (
        <p className="wed-display text-xl font-semibold text-[var(--wed-ink)] sm:text-2xl">
          {parents.father}
        </p>
      ) : null}
      <p className="wed-display text-xl font-semibold text-[var(--wed-ink)] sm:text-2xl">
        {parents.mother}
      </p>
      <p className="mt-1 max-w-[240px] font-[Inter] text-xs leading-relaxed text-[var(--wed-ink)]/60">
        {parents.address}
      </p>
    </div>
  );
}

function Portrait({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative aspect-[3/4] w-40 overflow-hidden border border-[var(--wed-gold)]/50 shadow-[0_18px_44px_-22px_rgba(31,58,37,0.55)] sm:w-52"
      style={{ borderRadius: "50% 50% 0 0 / 32% 32% 0 0" }}
    >
      <Image
        src={src}
        alt={alt}
        width={600}
        height={800}
        loading="lazy"
        sizes="(max-width: 768px) 160px, 208px"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default function CeremonyInfo({
  eventDate,
  order,
}: {
  eventDate: ResolvedWeddingDate;
  order?: OrderedCouple;
}) {
  const { event } = weddingData;
  const couple = order ?? resolveCoupleOrder("groom");
  const { dateBlock } = eventDate;

  return (
    <section
      aria-label="Thông tin lễ cưới"
      className="flex flex-col items-center gap-12 px-6 pb-16 text-center sm:pb-24"
    >
      <SectionHeading>THÔNG TIN LỄ CƯỚI</SectionHeading>

      {/* Parents — two families split by a vertical rule */}
      <div className="grid w-full max-w-2xl grid-cols-[1fr_auto_1fr] items-start gap-4 sm:gap-8">
        <ParentColumn parents={couple.firstParents} />
        <div aria-hidden="true" className="h-full w-px self-stretch bg-[var(--wed-ink)]/15" />
        <ParentColumn parents={couple.secondParents} />
      </div>

      {/* Announcement */}
      <div className="flex flex-col gap-1">
        <p className="wed-display text-lg font-medium uppercase tracking-[0.12em] text-[var(--wed-ink)] sm:text-xl">
          Trân trọng báo tin
        </p>
        <p className="wed-display text-lg font-medium uppercase tracking-[0.12em] text-[var(--wed-ink)] sm:text-xl">
          Lễ thành hôn của con chúng tôi
        </p>
      </div>

      {/* First of the couple (per invitation side) */}
      <figure className="flex flex-col items-center gap-5">
        <Portrait src={couple.firstPortrait.src} alt={couple.firstPortrait.alt} />
        <figcaption className="flex flex-col items-center gap-2">
          <h2 className="wed-display text-4xl leading-tight text-[var(--wed-ink)] sm:text-6xl">
            {couple.first.name}
          </h2>
          <p className="font-[Inter] text-xs uppercase tracking-[0.4em] text-[var(--wed-ink)]/55">
            {couple.first.role}
          </p>
        </figcaption>
      </figure>

      <span
        aria-hidden="true"
        className="wed-display text-4xl italic text-[var(--wed-ink)]/50 sm:text-5xl"
      >
        &amp;
      </span>

      {/* Second of the couple */}
      <figure className="flex flex-col items-center gap-5">
        <Portrait src={couple.secondPortrait.src} alt={couple.secondPortrait.alt} />
        <figcaption className="flex flex-col items-center gap-2">
          <h2 className="wed-display text-4xl leading-tight text-[var(--wed-ink)] sm:text-6xl">
            {couple.second.name}
          </h2>
          <p className="font-[Inter] text-xs uppercase tracking-[0.4em] text-[var(--wed-ink)]/55">
            {couple.second.role}
          </p>
        </figcaption>
      </figure>

      {/* Venue + time */}
      <div className="mt-2 flex flex-col items-center gap-2">
        <p className="wed-display text-base font-medium uppercase tracking-[0.12em] text-[var(--wed-ink)] sm:text-lg">
          Lễ thành hôn được cử hành tại
        </p>
        <p className="wed-display text-2xl uppercase tracking-[0.08em] text-[var(--wed-ink)] sm:text-3xl">
          {event.ceremonyVenue}
        </p>
        <p className="mt-1 font-[Inter] text-xs uppercase tracking-[0.3em] text-[var(--wed-ink)]/60">
          Vào lúc {event.ceremonyTime}
        </p>
      </div>

      {/* Date block */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="font-[Inter] text-xs uppercase tracking-[0.3em] text-[var(--wed-ink)]/55 sm:text-sm">
            {dateBlock.weekday}
          </span>
          <span aria-hidden="true" className="h-10 w-px bg-[var(--wed-ink)]/20" />
          <span className="wed-display text-5xl leading-none text-[var(--wed-ink)] sm:text-6xl">
            {dateBlock.day}
          </span>
          <span aria-hidden="true" className="h-10 w-px bg-[var(--wed-ink)]/20" />
          <span className="font-[Inter] text-xs uppercase tracking-[0.3em] text-[var(--wed-ink)]/55 sm:text-sm">
            Tháng {dateBlock.month}
          </span>
        </div>
        <p className="wed-display text-3xl text-[var(--wed-ink)]">
          {dateBlock.year}
        </p>
        <p className="font-[Inter] text-xs uppercase tracking-[0.2em] text-[var(--wed-ink)]/55">
          ({dateBlock.lunar})
        </p>
      </div>
    </section>
  );
}

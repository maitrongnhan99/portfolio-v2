import Image from "next/image";
import { weddingData } from "../data";
import { SectionHeading } from "./section-heading";
import type { Parents } from "../types";

function ParentColumn({ parents }: { parents: Parents }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="font-[Inter] text-xs uppercase tracking-[0.3em] text-[var(--wed-gold)]">
        {parents.side}
      </p>
      <p className="font-[Inter] text-sm text-[var(--wed-ink)]">
        {parents.father}
      </p>
      <p className="font-[Inter] text-sm text-[var(--wed-ink)]">
        {parents.mother}
      </p>
      <p className="max-w-[220px] font-[Inter] text-xs leading-relaxed text-[var(--wed-ink)]/70">
        {parents.address}
      </p>
    </div>
  );
}

export default function CeremonyInfo() {
  const { parents, couple, event, portraits } = weddingData;

  return (
    <section
      aria-label="Thông tin lễ cưới"
      className="flex flex-col items-center gap-10 px-6 py-16 text-center sm:py-20"
    >
      <SectionHeading>THÔNG TIN LỄ CƯỚI</SectionHeading>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6">
        <ParentColumn parents={parents.groom} />
        <ParentColumn parents={parents.bride} />
      </div>

      <p className="wed-display max-w-md text-base italic leading-relaxed text-[var(--wed-ink)]/90 sm:text-lg">
        Trân trọng báo tin lễ thành hôn của con chúng tôi
      </p>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-10">
        <figure className="flex flex-col items-center gap-3">
          {portraits.groom ? (
            <div className="relative aspect-[3/4] w-40 overflow-hidden rounded-t-full border border-[var(--wed-gold)]/50 shadow-[0_16px_40px_-20px_rgba(31,58,37,0.5)] sm:w-48">
              <Image
                src={portraits.groom.src}
                alt={portraits.groom.alt}
                width={600}
                height={800}
                loading="lazy"
                sizes="(max-width: 768px) 160px, 192px"
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          <figcaption>
            <h2 className="wed-display text-3xl leading-tight text-[var(--wed-ink)] sm:text-4xl">
              {couple.groom.name}
            </h2>
            <p className="mt-1 font-[Inter] text-xs uppercase tracking-[0.3em] text-[var(--wed-ink)]/60">
              {couple.groom.role}
            </p>
          </figcaption>
        </figure>

        <div className="flex flex-row items-center gap-3 sm:flex-col sm:justify-center sm:gap-3 sm:pt-16">
          <span
            aria-hidden="true"
            className="wed-display text-3xl italic text-[var(--wed-gold)] sm:text-4xl"
          >
            &amp;
          </span>
          <span aria-hidden="true" className="text-lg text-[var(--wed-gold)]">
            ❦
          </span>
        </div>

        <figure className="flex flex-col items-center gap-3">
          {portraits.bride ? (
            <div className="relative aspect-[3/4] w-40 overflow-hidden rounded-t-full border border-[var(--wed-gold)]/50 shadow-[0_16px_40px_-20px_rgba(31,58,37,0.5)] sm:w-48">
              <Image
                src={portraits.bride.src}
                alt={portraits.bride.alt}
                width={600}
                height={800}
                loading="lazy"
                sizes="(max-width: 768px) 160px, 192px"
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          <figcaption>
            <h2 className="wed-display text-3xl leading-tight text-[var(--wed-ink)] sm:text-4xl">
              {couple.bride.name}
            </h2>
            <p className="mt-1 font-[Inter] text-xs uppercase tracking-[0.3em] text-[var(--wed-ink)]/60">
              {couple.bride.role}
            </p>
          </figcaption>
        </figure>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="font-[Inter] text-sm text-[var(--wed-ink)]/80">
          {event.ceremonyVenue}
        </p>

        <div className="flex flex-col items-center gap-1 border border-[var(--wed-gold)]/50 px-10 py-6">
          <span className="font-[Inter] text-xs uppercase tracking-[0.35em] text-[var(--wed-gold)]">
            {event.dateBlock.weekday}
          </span>
          <span className="wed-display text-6xl leading-none text-[var(--wed-ink)] sm:text-7xl">
            {event.dateBlock.day}
          </span>
          <span className="font-[Inter] text-xs uppercase tracking-[0.3em] text-[var(--wed-ink)]/80">
            Tháng {event.dateBlock.month} · {event.dateBlock.year}
          </span>
          <span className="mt-2 font-[Inter] text-xs italic text-[var(--wed-ink)]/60">
            {event.dateBlock.lunar}
          </span>
        </div>
      </div>
    </section>
  );
}

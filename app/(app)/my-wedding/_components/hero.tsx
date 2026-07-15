import Image from "next/image";
import { weddingData } from "../data";

export default function Hero() {
  const { hero, couple } = weddingData;

  return (
    <section
      aria-labelledby="wed-hero-heading"
      className="relative flex flex-col items-center gap-8 overflow-hidden px-6 pb-16 pt-20 text-center sm:pb-24 sm:pt-28"
    >
      <p className="font-[Inter] text-xs uppercase tracking-[0.45em] text-[var(--wed-green)]/80">
        Welcome to Our Wedding
      </p>

      <div className="relative w-[min(90vw,480px)] p-3">
        <div
          aria-hidden="true"
          className="absolute inset-0 border border-[var(--wed-gold)]/60"
          style={{ borderRadius: "50% 50% 0 0 / 28% 28% 0 0" }}
        />
        <div
          className="relative aspect-[3/4] w-full overflow-hidden shadow-[0_24px_60px_-24px_rgba(31,58,37,0.5)]"
          style={{ borderRadius: "50% 50% 0 0 / 28% 28% 0 0" }}
        >
          <Image
            src={hero.src}
            alt={hero.alt}
            width={1200}
            height={1600}
            priority
            sizes="(max-width: 768px) 90vw, 480px"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <h1
          id="wed-hero-heading"
          className="wed-display text-4xl leading-tight text-[var(--wed-ink)] sm:text-5xl"
        >
          <span className="block">{couple.groom.name}</span>
          <span className="block text-2xl italic text-[var(--wed-gold)] sm:text-3xl">
            &amp;
          </span>
          <span className="block">{couple.bride.name}</span>
        </h1>

        <div className="flex items-center gap-4 font-[Inter] text-xs uppercase tracking-[0.3em] text-[var(--wed-ink)]/60">
          <span>{couple.groom.role}</span>
          <span aria-hidden="true" className="text-[var(--wed-gold)]">
            ❦
          </span>
          <span>{couple.bride.role}</span>
        </div>

        <p className="wed-display mt-4 text-lg italic tracking-wide text-[var(--wed-green)] sm:text-xl">
          Love Never Fails
        </p>
      </div>
    </section>
  );
}

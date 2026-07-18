import Image from "next/image";
import { weddingData } from "../data";
import {
  resolveCoupleOrder,
  type OrderedCouple,
} from "../lib/wedding-order";

export default function Hero({ order }: { order?: OrderedCouple }) {
  const { hero } = weddingData;
  const couple = order ?? resolveCoupleOrder("groom");

  return (
    <section
      aria-labelledby="wed-hero-heading"
      className="relative isolate overflow-hidden bg-[var(--wed-cream)] px-6 pb-16 pt-16"
    >
      {/* Dark-green fan backdrop */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 -z-10 w-[135%] -translate-x-1/2 bg-[var(--wed-green-deep)]"
        style={{
          aspectRatio: "1.7",
          borderRadius: "0 0 50% 50% / 0 0 46% 46%",
        }}
      />

      {/* Top matter over the green */}
      <div className="relative z-10 flex flex-col items-center">
        <p className="font-[Inter] text-[0.7rem] uppercase tracking-[0.4em] text-[var(--wed-cream-text)]/85 sm:text-xs">
          Welcome to Our Wedding
        </p>

        <div className="mt-5 grid w-full max-w-lg grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
          <div className="flex flex-col items-end gap-1 text-right">
            <span className="font-[Inter] text-[0.65rem] tracking-[0.2em] text-[var(--wed-cream-text)]/70 sm:text-xs">
              {couple.first.role}
            </span>
            <h1
              id="wed-hero-heading"
              className="wed-display text-2xl font-semibold uppercase leading-none text-[var(--wed-cream)] sm:text-3xl"
            >
              {couple.firstShortName}
            </h1>
          </div>

          <span
            aria-hidden="true"
            className="wed-display select-none text-5xl leading-none sm:text-6xl"
            style={{ color: "#a6c6a3" }}
          >
            囍
          </span>

          <div className="flex flex-col items-start gap-1 text-left">
            <span className="font-[Inter] text-[0.65rem] tracking-[0.2em] text-[var(--wed-cream-text)]/70 sm:text-xs">
              {couple.second.role}
            </span>
            <p className="wed-display text-2xl font-semibold uppercase leading-none text-[var(--wed-cream)] sm:text-3xl">
              {couple.secondShortName}
            </p>
          </div>
        </div>
      </div>

      {/* Arched photo with curved motto */}
      <div className="relative z-10 mx-auto mt-10 w-[min(76%,380px)]">
        <svg
          aria-hidden="true"
          viewBox="0 0 300 140"
          className="absolute left-1/2 top-[-34px] z-20 w-[118%] -translate-x-1/2 overflow-visible"
        >
          <defs>
            <path id="wed-love-arc" d="M 22 138 A 128 128 0 0 1 278 138" fill="none" />
          </defs>
          <text
            fill="var(--wed-cream)"
            className="font-[Inter]"
            style={{ fontSize: "14px", letterSpacing: "5px", fontWeight: 500 }}
          >
            <textPath href="#wed-love-arc" startOffset="50%" textAnchor="middle">
              LOVE NEVER FAILS
            </textPath>
          </text>
          <text x="18" y="120" fill="var(--wed-cream)" style={{ fontSize: "13px" }}>
            ✦
          </text>
          <text x="270" y="120" fill="var(--wed-cream)" style={{ fontSize: "13px" }}>
            ✦
          </text>
        </svg>

        <div
          className="relative aspect-[3/4] w-full overflow-hidden shadow-[0_30px_70px_-30px_rgba(20,42,27,0.6)]"
          style={{ borderRadius: "50% 50% 0 0 / 30% 30% 0 0" }}
        >
          <Image
            src={hero.src}
            alt={hero.alt}
            width={1200}
            height={1600}
            priority
            sizes="(max-width: 768px) 76vw, 380px"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

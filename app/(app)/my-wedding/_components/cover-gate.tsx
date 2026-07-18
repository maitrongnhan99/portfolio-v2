"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { weddingData } from "../data";
import {
  resolveCoupleOrder,
  type OrderedCouple,
} from "../lib/wedding-order";
import { useAutoScroll } from "../lib/use-auto-scroll";
import { HyPattern } from "./hy-pattern";

interface CoverGateProps {
  children: React.ReactNode;
  coverDate?: string;
  order?: OrderedCouple;
}

const AUDIO_SRC = "/wedding/cuoi-nhau-di.mp3";
const AUDIO_START_SECONDS = 10;

/** Circular cream seal with an interlocking wedding-rings mark, sits over the card. */
function CoverSeal() {
  return (
    <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--wed-cream)] shadow-[0_0_28px_-4px_rgba(247,239,224,0.55)] ring-1 ring-[var(--wed-gold)]/40">
      <Image
        src="/wedding/rings-seal.png"
        alt=""
        aria-hidden="true"
        width={80}
        height={80}
        className="h-12 w-12 object-contain mix-blend-multiply"
      />
    </span>
  );
}

export default function CoverGate({ children, coverDate, order }: CoverGateProps) {
  const [opened, setOpened] = useState(false);
  const displayDate = coverDate ?? weddingData.cover.date;
  const prefersReducedMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Gently walk guests through the card once it opens; any interaction stops it.
  useAutoScroll(opened);

  const handleOpen = () => {
    setOpened(true);

    const audio = audioRef.current;
    if (!audio) return;

    // Start the song at the requested offset. If metadata isn't ready yet,
    // apply the offset once it loads so playback still begins at 10s.
    const seekToStart = () => {
      audio.currentTime = AUDIO_START_SECONDS;
    };
    if (audio.readyState >= 1 /* HAVE_METADATA */) {
      seekToStart();
    } else {
      audio.addEventListener("loadedmetadata", seekToStart, { once: true });
    }

    // play() must run inside the click gesture to satisfy autoplay policies.
    // It returns a promise in modern browsers (undefined in some environments).
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Autoplay blocked or interrupted — fail silently.
      });
    }
  };

  const [firstName, secondName] = useMemo(() => {
    const resolved = order ?? resolveCoupleOrder("groom");
    return [resolved.firstShortName, resolved.secondShortName];
  }, [order]);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  const ease = [0.16, 1, 0.3, 1] as const;
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.12, delayChildren: 0.1 },
    },
  };
  const item = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
      };

  return (
    <>
      {/* Background music — starts at 10s when the invitation is opened */}
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" loop />

      <AnimatePresence>
        {!opened && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: prefersReducedMotion ? 0 : 0.7, ease } }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-6"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 42%, #24422b 0%, #16301e 55%, #0f2416 100%)",
            }}
          >
            <HyPattern />

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="relative w-[min(94vw,880px)]"
            >
              <motion.div
                variants={item}
                className="relative flex min-h-[460px] flex-col justify-center overflow-hidden rounded-[28px] border border-[var(--wed-cream)]/10 bg-[var(--wed-green)] px-12 pb-16 pt-20 shadow-[0_0_90px_-20px_rgba(201,162,39,0.25),0_50px_90px_-40px_rgba(0,0,0,0.75)] sm:px-16"
              >
                {/* Large watermark glyphs bleeding diagonally across the card */}
                <span
                  aria-hidden="true"
                  className="wed-display pointer-events-none absolute -left-6 -top-8 select-none leading-none text-[var(--wed-cream)]/[0.05]"
                  style={{ fontSize: "9rem", transform: "rotate(-14deg)" }}
                >
                  囍
                </span>
                <span
                  aria-hidden="true"
                  className="wed-display pointer-events-none absolute -bottom-10 -right-6 select-none leading-none text-[var(--wed-cream)]/[0.05]"
                  style={{ fontSize: "9rem", transform: "rotate(12deg)" }}
                >
                  囍
                </span>

                <div className="relative flex flex-col items-center text-center">
                  <h1 className="wed-display text-[var(--wed-cream)]">
                    <span className="block text-5xl leading-[1.05] sm:text-6xl">
                      {firstName}
                    </span>
                    <span className="my-1 block text-2xl italic text-[var(--wed-gold)]">
                      &amp;
                    </span>
                    <span className="block text-5xl leading-[1.05] sm:text-6xl">
                      {secondName}
                    </span>
                  </h1>

                  {/* Ornamental divider */}
                  <div
                    aria-hidden="true"
                    className="mt-6 flex w-32 items-center gap-3 text-[var(--wed-gold)]/70"
                  >
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--wed-gold)]/50" />
                    <span className="text-xs">❦</span>
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--wed-gold)]/50" />
                  </div>

                  <p className="mt-6 font-[Inter] text-sm tracking-[0.15em] text-[var(--wed-cream-text)]/85">
                    {displayDate}
                  </p>

                  <p className="wed-display mt-5 text-xl italic text-[var(--wed-cream)]">
                    Thân Mời
                  </p>

                  <button
                    type="button"
                    onClick={handleOpen}
                    className="mt-8 rounded-full bg-[var(--wed-cream)] px-10 py-3 font-[Inter] text-sm tracking-[0.12em] text-[var(--wed-green-deep)] shadow-[0_0_34px_-6px_rgba(247,239,224,0.6)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_44px_-4px_rgba(247,239,224,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wed-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--wed-green)]"
                  >
                    Mở thiệp
                  </button>
                </div>
              </motion.div>

              {/* Seal overlaps the top edge of the card */}
              <motion.div
                variants={item}
                className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
              >
                <CoverSeal />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {opened && children}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { weddingData } from "../data";
import { HyPattern } from "./hy-pattern";

interface CoverGateProps {
  children: React.ReactNode;
}

export default function CoverGate({ children }: CoverGateProps) {
  const [opened, setOpened] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  return (
    <>
      <AnimatePresence>
        {!opened && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: prefersReducedMotion ? 0 : -32,
            }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[var(--wed-green-deep)] px-6 text-center text-[var(--wed-cream-text)]"
          >
            <HyPattern />

            <div className="relative flex flex-col items-center gap-6">
              <p className="font-[Inter] text-xs uppercase tracking-[0.4em] text-[var(--wed-cream-text)]/70">
                {weddingData.cover.invite}
              </p>

              <h1 className="wed-display text-5xl leading-tight text-[var(--wed-cream)] sm:text-6xl">
                {weddingData.couple.combined}
              </h1>

              <p className="font-[Inter] text-sm uppercase tracking-[0.3em] text-[var(--wed-cream-text)]/80">
                {weddingData.cover.date}
              </p>

              <p className="wed-display text-lg italic text-[var(--wed-cream-text)]/90">
                Thân Mời
              </p>

              <button
                type="button"
                onClick={() => setOpened(true)}
                className="mt-4 rounded-full border border-[var(--wed-gold)] bg-transparent px-8 py-3 font-[Inter] text-sm uppercase tracking-[0.25em] text-[var(--wed-cream)] transition-colors duration-300 hover:bg-[var(--wed-gold)] hover:text-[var(--wed-green-deep)]"
              >
                Mở thiệp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {opened && children}
    </>
  );
}

"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMountedState } from "react-use";

const DELAY = 10;
const DURATION = 20;
const MAX_METEORS = 20;
const METEOR_TIMINGS = Array.from({ length: MAX_METEORS }, () => ({
  delay: Math.random() * DELAY,
  duration: Math.floor(Math.random() * (DURATION - DELAY) + DELAY),
}));

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const mounted = useMountedState();
  const isMounted = mounted();

  const meteorCount = number || 20;
  const meteors = new Array(meteorCount).fill(true);

  if (!isMounted) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {meteors.map((el, idx) => {
        // Calculate position to evenly distribute meteors across container width
        const position = idx * (800 / meteorCount) - 400;
        const timing = METEOR_TIMINGS[idx % METEOR_TIMINGS.length];

        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute h-0.5 w-0.5 rotate-45 rounded-pill bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
              "before:absolute before:top-1/2 before:h-px before:w-[50px] before:translate-y-[-50%] before:transform before:bg-linear-to-r before:from-[#64748b] before:to-transparent before:content-['']",
              className
            )}
            style={{
              top: "-40px",
              left: position + "px",
              animationDelay: timing.delay + "s",
              animationDuration: timing.duration + "s",
            }}
          ></span>
        );
      })}
    </motion.div>
  );
};

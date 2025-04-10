"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMountedState } from "react-use";

const DELAY = 10;
const DURATION = 20;
export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const mounted = useMountedState();
  const isMounted = mounted();

  const meteors = new Array(number || 20).fill(true);

  if (!isMounted) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {meteors.map((el, idx) => {
        const meteorCount = number || 20;
        // Calculate position to evenly distribute meteors across container width
        const position = idx * (800 / meteorCount) - 400; // Spread across 800px range, centered

        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
              "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
              className
            )}
            style={{
              top: "-40px", // Start above the container
              left: position + "px",
              animationDelay: Math.random() * DELAY + "s", // Random delay between 0-5s
              animationDuration:
                Math.floor(Math.random() * (DURATION - DELAY) + DELAY) + "s", // Keep some randomness in duration
            }}
          ></span>
        );
      })}
    </motion.div>
  );
};

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { useMountedState } from "react-use";

interface AnimatedShapesProps {
  count?: number;
  className?: string;
}

const seededValue = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

export default function AnimatedShapes({
  count = 6,
  className = "",
}: AnimatedShapesProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const mounted = useMountedState();
  const isMounted = mounted();

  const shapes = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const seed = i + count * 17;
        const size = Math.floor(seededValue(seed) * 100) + 50;
        const type = Math.floor(seededValue(seed + 1) * 3);
        const delay = seededValue(seed + 2) * 5;
        const duration = seededValue(seed + 3) * 15 + 20;
        const opacity = seededValue(seed + 4) * 0.3 + 0.3;

        const color = isDark
          ? `rgba(245, 242, 239, ${opacity * 0.32})`
          : `rgba(119, 113, 105, ${opacity * 0.42})`;

        const xPos = seededValue(seed + 5) * 100;
        const yPos = seededValue(seed + 6) * 100;

        return { id: i, size, type, delay, duration, color, xPos, yPos };
      }),
    [count, isDark]
  );

  if (!isMounted) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            left: `${shape.xPos}%`,
            top: `${shape.yPos}%`,
            width: shape.size,
            height: shape.size,
            backgroundColor: "transparent",
            borderRadius:
              shape.type === 0 ? "50%" : shape.type === 1 ? "10%" : "30%",
            border: `2px solid ${shape.color}`,
            opacity: 0.7,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: shape.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

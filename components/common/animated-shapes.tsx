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
        const size = Math.floor(Math.random() * 100) + 50;
        const type = Math.floor(Math.random() * 3);
        const delay = Math.random() * 5;
        const duration = Math.random() * 15 + 20;
        const opacity = Math.random() * 0.3 + 0.3;

        const color = isDark
          ? `rgba(35, 53, 84, ${opacity})`
          : `rgba(35, 53, 84, ${opacity})`;

        const xPos = Math.random() * 100;
        const yPos = Math.random() * 100;

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
              shape.type === 0 ? "50%" : shape.type === 1 ? "0%" : "30%",
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

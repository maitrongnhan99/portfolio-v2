"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import { FC, useEffect, useMemo, useRef, useState } from "react";

const EnhancedGlowEffect: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted] = useState(() => typeof window !== "undefined");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smoother movement
  const springConfig = { damping: 25, stiffness: 120 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Transform the mouse position to the range of -20 to 20 for subtle movement
  const rotateX = useTransform(springY, [0, dimensions.height], [10, -10]);
  const rotateY = useTransform(springX, [0, dimensions.width], [-10, 10]);

  // Glow position
  const glowX = useTransform(
    springX,
    [0, dimensions.width],
    [0, dimensions.width]
  );
  const glowY = useTransform(
    springY,
    [0, dimensions.height],
    [0, dimensions.height]
  );

  const glowBackground = useMemo(() => {
    if (resolvedTheme === "dark") {
      return "radial-gradient(circle at center, rgba(245, 242, 239, 0.32) 0%, rgba(245, 242, 239, 0.14) 42%, rgba(245, 242, 239, 0.04) 62%, transparent 78%)";
    }

    return "radial-gradient(circle at center, rgba(120, 91, 63, 0.18) 0%, rgba(245, 242, 239, 0.34) 34%, rgba(78, 50, 23, 0.08) 58%, transparent 78%)";
  }, [resolvedTheme]);

  useEffect(() => {
    // Only show the effect after a short delay to prevent flash on page load
    const timer = setTimeout(() => setIsVisible(true), 500);

    const updateDimensions = () => {
      if (containerRef.current) {
        const nextWidth = window.innerWidth;
        const nextHeight = window.innerHeight;

        setDimensions({
          width: nextWidth,
          height: nextHeight,
        });

        // Keep the glow visible immediately by defaulting to viewport center.
        mouseX.set(nextWidth / 2);
        mouseY.set(nextHeight / 2);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, [mouseX, mouseY]);

  // Don't render on mobile/touch devices
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none)").matches
  ) {
    return null;
  }

  if (!isMounted || !isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
    >
      <motion.div
        className="absolute"
        style={{
          width: resolvedTheme === "dark" ? 640 : 760,
          height: resolvedTheme === "dark" ? 640 : 760,
          borderRadius: "50%",
          filter: resolvedTheme === "dark" ? "blur(32px)" : "blur(40px)",
          opacity: resolvedTheme === "dark" ? 0.78 : 0.72,
          background: glowBackground,
          mixBlendMode: resolvedTheme === "dark" ? "screen" : "multiply",
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </div>
  );
};

export { EnhancedGlowEffect };
export default EnhancedGlowEffect;

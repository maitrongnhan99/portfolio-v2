"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "next-themes";
import { FC, useEffect, useMemo, useState } from "react";

const EnhancedGlowEffect: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted] = useState(() => typeof window !== "undefined");
  const { resolvedTheme } = useTheme();

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smoother movement
  const springConfig = { damping: 25, stiffness: 120 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const glowBackground = useMemo(() => {
    if (resolvedTheme === "dark") {
      return "radial-gradient(circle at center, rgba(245, 242, 239, 0.32) 0%, rgba(245, 242, 239, 0.14) 42%, rgba(245, 242, 239, 0.04) 62%, transparent 78%)";
    }

    return "radial-gradient(circle at center, rgba(163, 163, 163, 0.16) 0%, rgba(115, 115, 115, 0.09) 40%, rgba(82, 82, 82, 0.03) 62%, transparent 78%)";
  }, [resolvedTheme]);

  useEffect(() => {
    // Only show the effect after a short delay to prevent flash on page load
    const timer = setTimeout(() => setIsVisible(true), 500);

    // Default the glow to the viewport center. Use `jump` so the springs start
    // AT center instead of animating in from the top-left origin (0,0).
    const centerGlow = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(centerX);
      mouseY.set(centerY);
      springX.jump(centerX);
      springY.jump(centerY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    centerGlow();

    window.addEventListener("resize", centerGlow);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", centerGlow);
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, [mouseX, mouseY, springX, springY]);

  // Don't render on mobile/touch devices
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none)").matches
  ) {
    return null;
  }

  if (!isMounted || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
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
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </div>
  );
};

export { EnhancedGlowEffect };
export default EnhancedGlowEffect;

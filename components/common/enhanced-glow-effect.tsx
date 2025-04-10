"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function EnhancedGlowEffect() {
  const [isVisible, setIsVisible] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Only show the effect after a short delay to prevent flash on page load
    const timer = setTimeout(() => setIsVisible(true), 500);

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
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
  }, [mouseX, mouseY, isVisible]);

  // Don't render on mobile/touch devices
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none)").matches
  ) {
    return null;
  }

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
    >
      <motion.div
        className="absolute"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(100, 255, 218, 0.12) 0%, rgba(100, 255, 218, 0.03) 40%, transparent 70%)",
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </div>
  );
}

"use client"

import { useState, useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useTheme } from "next-themes"

export default function MouseGlowEffect() {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()

  // Mouse position values with spring physics for smooth movement
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Add spring physics for smoother, slightly delayed following
  const springConfig = { damping: 30, stiffness: 150, mass: 0.5 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Only show the effect after a short delay to prevent flash on page load
    const timer = setTimeout(() => setIsVisible(true), 500)

    const handleMouseMove = (e: MouseEvent) => {
      // Update motion values with current mouse position
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timer)
    }
  }, [mouseX, mouseY])

  // Don't render on mobile/touch devices
  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
    return null
  }

  // Don't render until we're ready to show the effect
  if (!isVisible) return null

  // Determine glow color based on theme
  const glowColor = theme === "dark" ? "64, 255, 218" : "64, 255, 218" // aqua color in RGB

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 opacity-0 transition-opacity duration-300"
      animate={{ opacity: 1 }}
      style={{
        opacity: 0.15, // Keep the glow subtle
      }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle at center, rgba(${glowColor}, 0.15) 0%, rgba(${glowColor}, 0.05) 35%, transparent 70%)`,
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </motion.div>
  )
}


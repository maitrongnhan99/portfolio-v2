"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface AnimatedGradientProps {
  className?: string
}

export default function AnimatedGradient({ className = "" }: AnimatedGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    // Set canvas dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Animation function
    const animate = () => {
      time += 0.003

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient
      const isDark = theme === "dark"
      const colorStops = isDark
        ? [
            { pos: 0, color: "rgba(30, 64, 175, 0.15)" },
            { pos: 0.5, color: "rgba(79, 70, 229, 0.1)" },
            { pos: 1, color: "rgba(30, 58, 138, 0.15)" },
          ]
        : [
            { pos: 0, color: "rgba(59, 130, 246, 0.1)" },
            { pos: 0.5, color: "rgba(99, 102, 241, 0.08)" },
            { pos: 1, color: "rgba(37, 99, 235, 0.1)" },
          ]

      // Draw animated gradient blobs
      for (let i = 0; i < 3; i++) {
        const x = Math.sin(time + i * 2) * canvas.width * 0.25 + canvas.width * 0.5
        const y = Math.cos(time + i * 2) * canvas.height * 0.25 + canvas.height * 0.5
        const radius = Math.max(canvas.width, canvas.height) * 0.5

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        colorStops.forEach((stop) => {
          gradient.addColorStop(stop.pos, stop.color)
        })

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      animationFrameId = window.requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [theme])

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} />
}


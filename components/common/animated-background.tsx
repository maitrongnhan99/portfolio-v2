"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

type Particle = {
  id: number
  x: number
  y: number
  size: number
  color: string
  velocity: {
    x: number
    y: number
  }
}

export default function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([])
  const { theme } = useTheme()

  useEffect(() => {
    // Create particles
    const particleCount = 30
    const newParticles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        color:
          theme === "dark"
            ? `rgba(255, 255, 255, ${Math.random() * 0.07 + 0.03})`
            : `rgba(0, 0, 100, ${Math.random() * 0.07 + 0.03})`,
        velocity: {
          x: (Math.random() - 0.5) * 0.2,
          y: (Math.random() - 0.5) * 0.2,
        },
      })
    }

    setParticles(newParticles)

    // Animation loop
    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          // Update position
          let newX = particle.x + particle.velocity.x
          let newY = particle.y + particle.velocity.y

          // Bounce off edges
          if (newX < 0 || newX > 100) {
            particle.velocity.x *= -1
            newX = particle.x
          }

          if (newY < 0 || newY > 100) {
            particle.velocity.y *= -1
            newY = particle.y
          }

          return {
            ...particle,
            x: newX,
            y: newY,
          }
        }),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [theme])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          animate={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
          }}
          transition={{
            duration: 3,
            ease: "linear",
          }}
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
        />
      ))}
    </div>
  )
}


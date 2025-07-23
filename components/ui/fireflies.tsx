"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface Firefly {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulseSpeed: number;
  glowIntensity: number;
}

interface FirefliesProps {
  count?: number;
  minSize?: number;
  maxSize?: number;
  minSpeed?: number;
  maxSpeed?: number;
  color?: string;
  glowColor?: string;
  className?: string;
}

const generateFirefly = (
  width: number,
  height: number,
  minSize: number,
  maxSize: number,
  minSpeed: number,
  maxSpeed: number
): Firefly => {
  const size = Math.random() * (maxSize - minSize) + minSize;
  const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
  const angle = Math.random() * Math.PI * 2;

  return {
    id: Date.now() + Math.random(),
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size,
    opacity: Math.random() * 0.5 + 0.5,
    pulseSpeed: Math.random() * 2 + 1,
    glowIntensity: Math.random() * 0.5 + 0.5,
  };
};

const Fireflies: React.FC<FirefliesProps> = ({
  count = 20,
  minSize = 2,
  maxSize = 4,
  minSpeed = 0.2,
  maxSpeed = 0.8,
  color = "#FFD700",
  glowColor = "#FFA500",
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fireflies, setFireflies] = useState<Firefly[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      setFireflies(
        Array.from({ length: count }, () =>
          generateFirefly(width, height, minSize, maxSize, minSpeed, maxSpeed)
        )
      );
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [count, minSize, maxSize, minSpeed, maxSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    const firefliesRef = { current: fireflies };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      firefliesRef.current = firefliesRef.current.map((firefly) => {
        let newX = firefly.x + firefly.vx;
        let newY = firefly.y + firefly.vy;
        let newVx = firefly.vx;
        let newVy = firefly.vy;

        if (Math.random() < 0.02) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
          newVx = Math.cos(angle) * speed;
          newVy = Math.sin(angle) * speed;
        }

        if (newX < -firefly.size) newX = canvas.width + firefly.size;
        if (newX > canvas.width + firefly.size) newX = -firefly.size;
        if (newY < -firefly.size) newY = canvas.height + firefly.size;
        if (newY > canvas.height + firefly.size) newY = -firefly.size;

        const pulse = Math.sin(time * firefly.pulseSpeed) * 0.3 + 0.7;
        const opacity = firefly.opacity * pulse;

        ctx.save();
        ctx.globalAlpha = opacity;

        const gradient = ctx.createRadialGradient(
          newX,
          newY,
          0,
          newX,
          newY,
          firefly.size * 4 * firefly.glowIntensity
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, glowColor);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
          newX,
          newY,
          firefly.size * 4 * firefly.glowIntensity,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(newX, newY, firefly.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        return {
          ...firefly,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color, glowColor, minSpeed, maxSpeed, fireflies]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full", className)}
    />
  );
};

export { Fireflies };

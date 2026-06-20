"use client";
import { motion } from "motion/react";
import React, { useMemo } from "react";

export function ColourfulText({ text }: { text: string }) {
  const colors = useMemo(() => [
    "rgb(0, 0, 0)",
    "rgb(78, 78, 78)",
    "rgb(119, 113, 105)",
    "rgb(78, 50, 23)",
    "rgb(119, 113, 105)",
    "rgb(78, 78, 78)",
  ], []);

  const [currentColors, setCurrentColors] = React.useState(colors);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      setCurrentColors(shuffled);
      setCount((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [colors]);

  return (
    <span data-testid="colourful-text">
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${count}-${index}`}
          data-testid={`colourful-text-char-${index}`}
          initial={{
            y: 0,
          }}
          animate={{
            color: currentColors[index % currentColors.length],
            y: [0, -3, 0],
            scale: [1, 1.01, 1],
            filter: ["blur(0px)", `blur(5px)`, "blur(0px)"],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
          }}
          className="inline-block whitespace-pre font-sans tracking-body"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

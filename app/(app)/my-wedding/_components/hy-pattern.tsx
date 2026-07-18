// Deterministic scatter of 囍 (double-happiness) glyphs used as the atmospheric
// backdrop behind the cover card. Positions are hardcoded (not random) so the
// server- and client-rendered markup match and there is no hydration mismatch.

interface Glyph {
  top: string;
  left: string;
  size: string;
  opacity: number;
  rotate: number;
  tone: "green" | "cream";
}

const GLYPHS: Glyph[] = [
  { top: "6%", left: "12%", size: "1.5rem", opacity: 0.06, rotate: -8, tone: "green" },
  { top: "9%", left: "72%", size: "2rem", opacity: 0.08, rotate: 6, tone: "cream" },
  { top: "16%", left: "30%", size: "1.1rem", opacity: 0.05, rotate: 0, tone: "green" },
  { top: "14%", left: "88%", size: "1.3rem", opacity: 0.05, rotate: 10, tone: "green" },
  { top: "24%", left: "6%", size: "1.6rem", opacity: 0.07, rotate: -12, tone: "cream" },
  { top: "30%", left: "54%", size: "1rem", opacity: 0.04, rotate: 4, tone: "green" },
  { top: "34%", left: "82%", size: "1.4rem", opacity: 0.06, rotate: -6, tone: "green" },
  { top: "44%", left: "18%", size: "1.2rem", opacity: 0.05, rotate: 8, tone: "green" },
  { top: "52%", left: "90%", size: "1.7rem", opacity: 0.07, rotate: -4, tone: "cream" },
  { top: "60%", left: "8%", size: "1.3rem", opacity: 0.05, rotate: 12, tone: "green" },
  { top: "66%", left: "40%", size: "1rem", opacity: 0.04, rotate: -10, tone: "green" },
  { top: "70%", left: "68%", size: "2.1rem", opacity: 0.08, rotate: 6, tone: "cream" },
  { top: "78%", left: "22%", size: "1.5rem", opacity: 0.06, rotate: -8, tone: "green" },
  { top: "82%", left: "84%", size: "1.2rem", opacity: 0.05, rotate: 4, tone: "green" },
  { top: "88%", left: "48%", size: "1.6rem", opacity: 0.07, rotate: -6, tone: "cream" },
  { top: "90%", left: "14%", size: "1.1rem", opacity: 0.04, rotate: 10, tone: "green" },
  { top: "20%", left: "60%", size: "1.2rem", opacity: 0.05, rotate: -14, tone: "green" },
  { top: "48%", left: "62%", size: "1rem", opacity: 0.04, rotate: 2, tone: "green" },
  { top: "38%", left: "38%", size: "1.3rem", opacity: 0.05, rotate: -4, tone: "cream" },
  { top: "74%", left: "54%", size: "1.1rem", opacity: 0.04, rotate: 8, tone: "green" },
];

export function HyPattern({ className }: { className?: string } = {}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className || ""}`}
    >
      {GLYPHS.map((glyph, index) => (
        <span
          key={index}
          className="wed-display absolute select-none leading-none"
          style={{
            top: glyph.top,
            left: glyph.left,
            fontSize: glyph.size,
            opacity: glyph.opacity,
            transform: `rotate(${glyph.rotate}deg)`,
            color:
              glyph.tone === "cream"
                ? "var(--wed-cream)"
                : "var(--wed-gold)",
          }}
        >
          囍
        </span>
      ))}
    </div>
  );
}

export function HyPattern({ className }: { className?: string } = {}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className || ""}`}
    >
      {/* Scattered 囍 (double-happiness) glyphs at low opacity */}
      <div className="absolute top-10 left-5 text-6xl opacity-5 text-[var(--wed-green)]">
        囍
      </div>
      <div className="absolute top-20 right-10 text-7xl opacity-5 text-[var(--wed-red)]">
        囍
      </div>
      <div className="absolute bottom-20 left-1/4 text-5xl opacity-5 text-[var(--wed-green)]">
        囍
      </div>
      <div className="absolute bottom-10 right-1/3 text-6xl opacity-5 text-[var(--wed-red)]">
        囍
      </div>
      <div className="absolute top-1/2 left-1/2 text-8xl opacity-5 text-[var(--wed-green)]">
        囍
      </div>
      <div className="absolute top-1/3 right-1/4 text-5xl opacity-5 text-[var(--wed-red)]">
        囍
      </div>
    </div>
  );
}

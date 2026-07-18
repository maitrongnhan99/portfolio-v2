export function SectionHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--wed-green)] px-8 py-3 text-center">
      <span className="font-[Inter] text-sm uppercase tracking-[0.25em] text-[var(--wed-cream-text)]">
        {children}
      </span>
    </div>
  );
}

import { cn } from "@/lib/utils";

interface GridAndDotBackgroundProps {
  className?: string;
}
export function GridAndDotBackground({ className }: GridAndDotBackgroundProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex w-full items-center justify-center z-1",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0",
          "bg-size-[40px_40px]",
          "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      {/* <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div> */}
    </div>
  );
}

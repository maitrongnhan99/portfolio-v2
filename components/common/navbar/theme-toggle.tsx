"use client";

import { Button } from "@/components/ui/button";
import { MoonStarsIcon, SunDimIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { FC } from "react";
import { useMountedState } from "react-use";

const ThemeToggle: FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMountedState();

  if (!mounted()) {
    return <div className="h-8 w-16" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative h-8 w-16 rounded-full p-0 transition-all duration-300 ease-out ring-1 ring-borderSubtle shadow-warm-lift data-[state=light]:bg-canvas-warm data-[state=dark]:bg-[rgba(255,255,255,0.08)] hover:opacity-95"
      data-state={isDark ? "dark" : "light"}
    >
      <div className="absolute inset-0 flex items-center justify-between px-[9px] pointer-events-none">
        <MoonStarsIcon className="h-3.5 w-3.5 text-text-muted transition-colors" />
        <SunDimIcon className="h-3.5 w-3.5 text-text-muted transition-colors" />
      </div>
      <span
        className={`absolute top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px] transition-all duration-300 ${
          isDark ? "left-1 bg-white text-black" : "left-[calc(100%-1.75rem)] bg-canvas-white text-text-primary"
        }`}
      >
        {isDark ? <MoonStarsIcon className="h-3.5 w-3.5" /> : <SunDimIcon className="h-3.5 w-3.5" />}
      </span>
      <span className="sr-only">
        {isDark ? "Enable light mode" : "Enable dark mode"}
      </span>
    </Button>
  );
};

export { ThemeToggle };

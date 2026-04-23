"use client";

import { Button } from "@/components/ui/button";
import { MoonStarsIcon, SunDimIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { FC } from "react";

const ThemeToggle: FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative h-8 w-16 rounded-full p-0 transition-all duration-300 ease-out ring-1 ring-[rgba(0,0,0,0.06)] shadow-[rgba(0,0,0,0.04)_0px_4px_4px] data-[state=light]:bg-[rgba(245,242,239,0.8)] data-[state=dark]:bg-black hover:opacity-95"
      data-state={isDark ? "dark" : "light"}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300 ${
          isDark ? "left-2.5 text-white" : "right-2.5 text-black"
        }`}
      >
        {isDark ? <MoonStarsIcon className="h-3.5 w-3.5" /> : <SunDimIcon className="h-3.5 w-3.5" />}
      </span>
      <span
        className={`absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px] transition-all duration-300 ${
          isDark ? "left-1 bg-white" : "left-[calc(100%-1.75rem)] bg-black"
        }`}
      />
      <span className="sr-only">
        {isDark ? "Enable light mode" : "Enable dark mode"}
      </span>
    </Button>
  );
};

export { ThemeToggle };

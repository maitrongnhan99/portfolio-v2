"use client";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DesktopNav } from "./desktop-nav";
import { NavLogo } from "./logo";
import { MobileNavMenu } from "./mobile-nav-menu";
import { MobileNavToggle } from "./mobile-nav-toggle";
import { ThemeToggle } from "./theme-toggle";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isHome) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-canvas-white/90 backdrop-blur-md border-b border-borderSubtle shadow-outline-ring"
          : "bg-transparent"
      )}
    >
      <Container className="h-12 lg:h-16 flex items-center justify-between">
        <NavLogo />
        <div className="flex items-center gap-2">
          <DesktopNav isHome={isHome} />
          <ThemeToggle />
          <MobileNavToggle isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </Container>
      <MobileNavMenu isOpen={isOpen} setIsOpen={setIsOpen} isHome={isHome} />
    </header>
  );
};

export { Navbar };

"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DesktopNav } from "./desktop-nav";
import { NavLogo } from "./logo";
import { MobileNavMenu } from "./mobile-nav-menu";
import { MobileNavToggle } from "./mobile-nav-toggle";

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

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-navy/90 backdrop-blur-md shadow-md" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 h-12 lg:h-16 flex items-center justify-between">
        <NavLogo />
        <DesktopNav isHome={isHome} />
        <MobileNavToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <MobileNavMenu isOpen={isOpen} setIsOpen={setIsOpen} isHome={isHome} />
    </header>
  );
};

export { Navbar };

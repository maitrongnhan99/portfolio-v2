"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { navLinks } from "./nav-links";
import { When } from "react-if";

interface DesktopNavProps {
  isHome: boolean;
}

const DesktopNav: FC<DesktopNavProps> = ({ isHome }) => {
  const navItemVariants = {
    hidden: { opacity: 0.8, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.3,
      },
    }),
  };

  return (
    <nav className="hidden md:flex items-center space-x-1">
      <When condition={isHome}>
        <ol className="flex space-x-1">
          {navLinks.map((link, i) => (
            <motion.li
              key={link.name}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
            >
              <Link
                href={link.href}
                className="px-4 py-2 text-sm font-mono text-slate-light hover:text-primary transition-colors"
              >
                <span className="text-primary">0{i + 1}.</span> {link.name}
              </Link>
            </motion.li>
          ))}
        </ol>
      </When>
      <motion.div
        initial={{ opacity: 0.8, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          asChild
          variant="outline"
          size="sm"
          className="ml-4 font-mono border-primary text-primary hover:bg-primary/10"
        >
          <Link href="#contact">Resume</Link>
        </Button>
      </motion.div>
    </nav>
  );
};

export { DesktopNav };
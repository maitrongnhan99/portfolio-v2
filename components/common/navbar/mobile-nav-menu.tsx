"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "@phosphor-icons/react";
import { When } from "react-if";
import { navLinks } from "./nav-links";
import { ModeToggle } from "@/components/common/mode-toggle";

interface MobileNavMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isHome: boolean;
}

const MobileNavMenu: FC<MobileNavMenuProps> = ({ isOpen, setIsOpen, isHome }) => {
  return (
    <When condition={isOpen}>
      <motion.div
        className="md:hidden bg-navy-light fixed right-0 top-0 bottom-0 w-3/4 shadow-xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-end p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="text-slate-lighter hover:text-primary"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-col h-[80%] space-y-6 px-4">
          <When condition={isHome}>
            <ol className="flex flex-col space-y-6">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    className="text-lg font-mono text-slate-light hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-primary">0{i + 1}.</span>{" "}
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ol>
          </When>
          <div className="flex flex-col space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Button
                asChild
                variant="outline"
                className="w-full font-mono border-primary text-primary hover:bg-primary/10"
              >
                <Link href="#contact" onClick={() => setIsOpen(false)}>
                  Resume
                </Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="flex justify-center"
            >
              <ModeToggle />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </When>
  );
};

export { MobileNavMenu };
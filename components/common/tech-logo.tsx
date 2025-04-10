"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import { FC } from "react";
import { Else, If, Then } from "react-if";

interface TechLogoProps {
  name: string;
  logo: string;
  darkLogo?: string;
  delay?: number;
}

const TechLogo: FC<TechLogoProps> = ({ name, logo, darkLogo, delay = 0 }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="relative w-16 h-16 md:w-20 md:h-20 bg-background rounded-lg shadow-md overflow-hidden border border-border/50 flex items-center justify-center p-2">
        <If condition={isDark && !!darkLogo}>
          <Then>
            <Image
              src={darkLogo!}
              alt={name}
              width={80}
              height={80}
              className="object-contain"
            />
          </Then>
          <Else>
            <Image
              src={logo}
              alt={name}
              width={80}
              height={80}
              className="object-contain"
            />
          </Else>
        </If>
      </div>
      <span className="text-xs mt-2 text-muted-foreground">{name}</span>
    </motion.div>
  );
};

export { TechLogo };

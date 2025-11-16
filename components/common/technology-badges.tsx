"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FC } from "react";

interface TechnologyBadgesProps {
  technologies: string[];
  variant?: "secondary" | "outline";
  className?: string;
  badgeClassName?: string;
  animated?: boolean;
  testId?: string;
}

const TechnologyBadges: FC<TechnologyBadgesProps> = ({
  technologies,
  variant = "secondary",
  className,
  badgeClassName,
  animated = false,
  testId,
}) => {
  if (animated) {
    return (
      <div
        data-testid={testId}
        className={cn("flex flex-wrap gap-3", className)}
      >
        {technologies.map((tech: string, index: number) => (
          <motion.div
            key={tech}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * index, duration: 0.3 }}
          >
            <Badge
              variant={variant}
              className={cn(
                "bg-navy-light border-primary/20 text-slate-light px-3 py-1",
                badgeClassName
              )}
            >
              {tech}
            </Badge>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div
      data-testid={testId}
      className={cn(
        "flex flex-wrap",
        variant === "outline" ? "gap-2" : "gap-3",
        className
      )}
    >
      {technologies.map((tech: string) => (
        <Badge
          key={tech}
          variant={variant}
          className={cn(
            "bg-navy-light border-primary/20 text-slate-light px-3 py-1",
            badgeClassName
          )}
        >
          {tech}
        </Badge>
      ))}
    </div>
  );
};

export { TechnologyBadges };

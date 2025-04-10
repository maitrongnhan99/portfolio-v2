"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FC } from "react";
import ScrollReveal from "../scroll-reveal";

interface ProjectCategoriesProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const ProjectCategories: FC<ProjectCategoriesProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <ScrollReveal delay={0.2}>
      <div className="flex justify-center flex-wrap gap-2 mb-16">
        {categories.map((category, index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
          >
            <Button
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "rounded-full",
                activeCategory === category
                  ? "bg-primary/20 text-primary hover:bg-primary/30 border-primary"
                  : "border-slate text-slate hover:border-primary hover:text-primary bg-navy/10 hover:bg-navy/20"
              )}
            >
              {category}
            </Button>
          </motion.div>
        ))}
      </div>
    </ScrollReveal>
  );
};

export { ProjectCategories };

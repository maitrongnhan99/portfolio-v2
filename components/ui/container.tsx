import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ElementType } from "react";

const sizes = {
  default: "max-w-7xl", // 1280px - every standard section/page
  narrow: "max-w-4xl", // 896px - long-form reading + chat
} as const;

interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  size?: keyof typeof sizes;
  as?: ElementType;
}

export function Container({
  size = "default",
  as: Comp = "div",
  className,
  ...props
}: ContainerProps) {
  return (
    <Comp
      className={cn(
        "mx-auto w-full px-4 md:px-6 lg:px-8",
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

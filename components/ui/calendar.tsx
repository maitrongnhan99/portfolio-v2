"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import type { DayButtonProps, WeekNumberProps } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const baseClassNames = {
  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
  month: "space-y-4",
  month_caption: "flex justify-center pt-1 relative items-center",
  caption_label: "text-sm font-medium",
  nav: "space-x-1 flex items-center",
  button_previous: cn(
    buttonVariants({ variant: "outline" }),
    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
  ),
  button_next: cn(
    buttonVariants({ variant: "outline" }),
    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
  ),
  month_grid: "w-full border-collapse space-y-1",
  weekdays: "flex",
  weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
  week: "flex w-full mt-2",
  day:
    "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
  day_button: cn(
    buttonVariants({ variant: "ghost" }),
    "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
  ),
  range_end: "day-range-end",
  selected:
    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
  today: "bg-accent text-accent-foreground",
  outside:
    "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
  disabled: "text-muted-foreground opacity-50",
  range_middle:
    "aria-selected:bg-accent aria-selected:text-accent-foreground",
  hidden: "invisible",
  week_number: "rdp-weeknumber text-xs font-medium text-muted-foreground",
} satisfies Record<string, string>;

const CalendarDayButton = React.forwardRef<HTMLButtonElement, DayButtonProps>(
  ({ modifiers, ...buttonProps }, forwardedRef) => {
    const internalRef = React.useRef<HTMLButtonElement | null>(null);

    React.useEffect(() => {
      if (modifiers.focused) {
        internalRef.current?.focus();
      }
    }, [modifiers.focused]);

    const setRef = (node: HTMLButtonElement | null) => {
      internalRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    return (
      <button
        {...buttonProps}
        ref={setRef}
        aria-selected={modifiers.selected ? "true" : undefined}
      />
    );
  }
);

CalendarDayButton.displayName = "CalendarDayButton";

const CalendarWeekNumber: React.FC<WeekNumberProps> = ({ className, ...props }) => {
  return (
    <th
      {...props}
      className={cn(
        "rdp-weeknumber text-xs font-medium text-muted-foreground",
        className
      )}
    />
  );
};

function Calendar({
  className,
  classNames,
  components,
  showOutsideDays = true,
  defaultMonth,
  ...props
}: CalendarProps) {
  const safeDefaultMonth =
    defaultMonth instanceof Date && !Number.isNaN(defaultMonth.getTime())
      ? defaultMonth
      : undefined;

  const mergedClassNames: Record<string, string> = { ...baseClassNames };

  const aliasMap: Record<string, string[]> = {
    caption: ["month_caption", "caption_label"],
    table: ["month_grid"],
  };

  if (classNames) {
    Object.entries(classNames).forEach(([key, value]) => {
      const targets = aliasMap[key] ?? [key];
      targets.forEach((target) => {
        mergedClassNames[target] = cn(mergedClassNames[target] ?? "", value);
      });
    });
  }

  const {
    Chevron: customChevron,
    DayButton: customDayButton,
    WeekNumber: customWeekNumber,
    ...otherComponents
  } = components ?? {};

  const mergedComponents = {
    DayButton: customDayButton ?? CalendarDayButton,
    WeekNumber: customWeekNumber ?? CalendarWeekNumber,
    ...otherComponents,
    Chevron: ({ orientation }: { orientation: "left" | "right" }) => {
      if (customChevron) {
        const element = customChevron({ orientation });

        if (React.isValidElement(element)) {
          if (orientation === "right" && element.props["data-testid"]) {
            return React.cloneElement(element, {
              ...element.props,
              "data-testid": `${element.props["data-testid"]}-next`,
            });
          }
          return element;
        }

        return element;
      }

      return orientation === "left" ? (
        <ArrowLeftIcon className="h-4 w-4" />
      ) : (
        <ArrowRightIcon className="h-4 w-4" />
      );
    },
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      data-testid="calendar"
      classNames={mergedClassNames}
      components={mergedComponents}
      defaultMonth={safeDefaultMonth}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

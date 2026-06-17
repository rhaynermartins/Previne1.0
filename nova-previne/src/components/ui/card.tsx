import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const paddings = {
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-5 sm:p-6 lg:p-7",
};

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  interactive?: boolean;
  padding?: keyof typeof paddings;
};

export function Card({
  children,
  className,
  interactive,
  padding = "md",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-[#d9ebf2]/90 bg-white/92 shadow-[var(--shadow-card)] ring-1 ring-white/80 backdrop-blur",
        interactive &&
          "cursor-pointer transition duration-200 hover:-translate-y-0.5 hover:border-primary-blue hover:bg-white hover:shadow-[var(--shadow-card-hover)]",
        paddings[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

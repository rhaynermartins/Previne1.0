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
        "rounded-lg border border-[#d9ebf2] bg-white shadow-[var(--shadow-card)] ring-1 ring-white/70",
        interactive &&
          "transition duration-200 hover:-translate-y-0.5 hover:border-primary-blue hover:shadow-[var(--shadow-card-hover)]",
        paddings[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

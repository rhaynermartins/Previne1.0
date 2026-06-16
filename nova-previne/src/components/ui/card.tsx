import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const paddings = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
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
        "rounded-lg border border-[#d9ebf2] bg-white shadow-[0_14px_38px_rgba(0,59,111,0.08)]",
        interactive &&
          "transition duration-200 hover:-translate-y-0.5 hover:border-primary-blue hover:shadow-[0_18px_46px_rgba(0,59,111,0.12)]",
        paddings[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

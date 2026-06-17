import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const variants = {
  blue: "border-[#b9e4f4] bg-light-blue text-dark-blue",
  green: "border-[#b7ead3] bg-light-green text-[#006b3d]",
  gray: "border-[#e0e7ee] bg-[#f6f8fa] text-gray-text",
  amber: "border-[#fde68a] bg-[#fffbeb] text-[#92400e]",
  red: "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]",
  navy: "border-[#c7d7e5] bg-[#eef6fb] text-dark-blue",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: keyof typeof variants;
};

export function Badge({ children, className, variant = "blue", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full border px-3 py-1 text-xs font-semibold",
        "shadow-[0_6px_16px_rgba(0,59,111,0.04)]",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

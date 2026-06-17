import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const variants = {
  error: "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]",
  info: "border-[#b9e4f4] bg-light-blue text-dark-blue",
  success: "border-[#b7ead3] bg-light-green text-[#006b3d]",
  warning: "border-[#fde68a] bg-[#fffbeb] text-[#92400e]",
};

type AlertProps = {
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  title?: ReactNode;
  variant?: keyof typeof variants;
};

export function Alert({
  children,
  className,
  icon,
  title,
  variant = "info",
}: AlertProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 text-sm shadow-[0_10px_24px_rgba(0,59,111,0.06)]",
        variants[variant],
        className,
      )}
      role={variant === "error" ? "alert" : "status"}
    >
      <div className="flex items-start gap-3">
        {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
        <div className="min-w-0">
          {title && <p className="font-bold text-dark-blue">{title}</p>}
          {children && (
            <div className={cn("leading-6", Boolean(title) && "mt-1")}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const tones = {
  blue: "border-[#b9e4f4] bg-light-blue/65 text-primary-blue",
  green: "border-[#b7ead3] bg-light-green/70 text-primary-green",
  gray: "border-[#dbe8ef] bg-[#f6fafc] text-gray-text",
};

type EmptyStateProps = {
  actions?: ReactNode;
  className?: string;
  description: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
  tone?: keyof typeof tones;
};

export function EmptyState({
  actions,
  className,
  description,
  icon,
  title,
  tone = "blue",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_14px_34px_rgba(0,59,111,0.05)]",
        tones[tone],
        className,
      )}
    >
      {icon && (
        <span className="flex size-11 items-center justify-center rounded-lg border border-current/20 bg-white/72">
          {icon}
        </span>
      )}
      <h3 className="mt-4 text-xl font-bold leading-tight text-dark-blue">
        {title}
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-text">
        {description}
      </p>
      {actions && <div className="mt-5 flex flex-col gap-3 sm:flex-row">{actions}</div>}
    </div>
  );
}

import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tones = {
  amber: "border-[#fde68a] bg-[#fffbeb] text-[#92400e]",
  blue: "border-[#b9e4f4] bg-light-blue text-primary-blue",
  gray: "border-[#dbe8ef] bg-[#f6f8fa] text-gray-text",
  green: "border-[#b7ead3] bg-light-green text-primary-green",
  red: "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]",
};

type MetricCardProps = {
  description: ReactNode;
  icon: ReactNode;
  label: ReactNode;
  tone?: keyof typeof tones;
  value: ReactNode;
};

export function MetricCard({
  description,
  icon,
  label,
  tone = "blue",
  value,
}: MetricCardProps) {
  return (
    <Card className="min-h-full overflow-hidden">
      <div className="-mx-5 -mt-5 mb-5 h-1.5 bg-[image:var(--gradient-brand)] sm:-mx-6" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-text">{label}</p>
          <p className="mt-3 break-words text-3xl font-bold leading-none text-dark-blue">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-lg border",
            tones[tone],
          )}
        >
          {icon}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-gray-text">{description}</p>
    </Card>
  );
}

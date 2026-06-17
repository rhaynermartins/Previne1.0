import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionTitleProps = {
  align?: "left" | "center";
  className?: string;
  description?: ReactNode;
  eyebrow?: string;
  title: ReactNode;
};

export function SectionTitle({
  align = "left",
  className,
  description,
  eyebrow,
  title,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 inline-flex rounded-full border border-[#b7ead3] bg-light-green px-3 py-1 text-sm font-bold text-[#006b3d] shadow-[0_8px_20px_rgba(0,158,90,0.08)]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold leading-tight text-dark-blue text-balance sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-gray-text sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

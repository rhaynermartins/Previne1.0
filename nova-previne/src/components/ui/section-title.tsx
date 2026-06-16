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
        <p className="mb-3 text-sm font-bold text-primary-green">{eyebrow}</p>
      )}
      <h2 className="text-3xl font-bold leading-tight text-dark-blue sm:text-4xl">
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

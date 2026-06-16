import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
  helperText?: string;
  label?: string;
};

export function Select({
  children,
  className,
  error,
  helperText,
  id,
  label,
  name,
  ...props
}: SelectProps) {
  const selectId = id ?? name;

  return (
    <div className="space-y-2">
      {label && selectId && (
        <label className="text-sm font-semibold text-dark-blue" htmlFor={selectId}>
          {label}
        </label>
      )}
      <select
        className={cn(
          "min-h-11 w-full rounded-lg border border-[#cfe2ec] bg-white px-4 text-sm text-dark-blue outline-none transition focus:border-primary-blue focus:ring-4 focus:ring-[#008fd3]/10 disabled:cursor-not-allowed disabled:bg-gray-light disabled:text-gray-text",
          error && "border-[#fca5a5] focus:border-[#dc2626] focus:ring-[#dc2626]/10",
          className,
        )}
        id={selectId}
        name={name}
        {...props}
      >
        {children}
      </select>
      {helperText && !error && (
        <p className="text-sm leading-6 text-gray-text">{helperText}</p>
      )}
      {error && <p className="text-sm leading-6 text-[#b42318]">{error}</p>}
    </div>
  );
}

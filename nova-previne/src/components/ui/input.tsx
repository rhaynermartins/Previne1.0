import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  helperText?: string;
  label?: string;
};

export function Input({
  className,
  error,
  helperText,
  id,
  label,
  name,
  ...props
}: InputProps) {
  const inputId = id ?? name;

  return (
    <div className="space-y-2">
      {label && inputId && (
        <label className="text-sm font-semibold text-dark-blue" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        className={cn(
          "min-h-11 w-full rounded-lg border border-[#cfe2ec] bg-white px-4 text-sm text-dark-blue outline-none transition placeholder:text-[#8a9aa8] focus:border-primary-blue focus:ring-4 focus:ring-[#008fd3]/10 disabled:cursor-not-allowed disabled:bg-gray-light disabled:text-gray-text",
          error && "border-[#fca5a5] focus:border-[#dc2626] focus:ring-[#dc2626]/10",
          className,
        )}
        id={inputId}
        name={name}
        {...props}
      />
      {helperText && !error && (
        <p className="text-sm leading-6 text-gray-text">{helperText}</p>
      )}
      {error && <p className="text-sm leading-6 text-[#b42318]">{error}</p>}
    </div>
  );
}

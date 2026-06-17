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
  const helperId = inputId ? `${inputId}-helper` : undefined;
  const errorId = inputId ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-2">
      {label && inputId && (
        <label className="text-sm font-bold text-dark-blue" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          "min-h-12 w-full rounded-lg border border-[#cfe2ec] bg-[#fbfdff] px-4 text-sm font-medium text-dark-blue shadow-[0_8px_22px_rgba(0,59,111,0.04)] outline-none transition placeholder:font-normal placeholder:text-[#8295a4] hover:border-[#b9dce9] focus:border-primary-blue focus:bg-white focus:ring-4 focus:ring-[#008fd3]/10 disabled:cursor-not-allowed disabled:bg-gray-light disabled:text-gray-text",
          error && "border-[#fca5a5] focus:border-[#dc2626] focus:ring-[#dc2626]/10",
          className,
        )}
        id={inputId}
        name={name}
        {...props}
      />
      {helperText && !error && (
        <p className="text-sm leading-6 text-gray-text" id={helperId}>
          {helperText}
        </p>
      )}
      {error && (
        <p className="text-sm font-medium leading-6 text-[#b42318]" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}

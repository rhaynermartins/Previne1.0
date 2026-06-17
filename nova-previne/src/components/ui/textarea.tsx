import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  helperText?: string;
  label?: string;
};

export function Textarea({
  className,
  error,
  helperText,
  id,
  label,
  name,
  ...props
}: TextareaProps) {
  const textareaId = id ?? name;
  const helperId = textareaId ? `${textareaId}-helper` : undefined;
  const errorId = textareaId ? `${textareaId}-error` : undefined;

  return (
    <div className="space-y-2">
      {label && textareaId && (
        <label className="text-sm font-bold text-dark-blue" htmlFor={textareaId}>
          {label}
        </label>
      )}
      <textarea
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          "min-h-32 w-full resize-y rounded-lg border border-[#cfe2ec] bg-white/88 px-4 py-3 text-sm font-medium leading-6 text-dark-blue shadow-[0_10px_26px_rgba(0,59,111,0.05)] outline-none transition placeholder:font-normal placeholder:text-[#7890a0] hover:border-[#a9d5e6] focus:border-primary-blue focus:bg-white focus:ring-4 focus:ring-[#008fd3]/12 disabled:cursor-not-allowed disabled:bg-gray-light disabled:text-gray-text",
          error && "border-[#fca5a5] focus:border-[#dc2626] focus:ring-[#dc2626]/10",
          className,
        )}
        id={textareaId}
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

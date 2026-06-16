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

  return (
    <div className="space-y-2">
      {label && textareaId && (
        <label className="text-sm font-semibold text-dark-blue" htmlFor={textareaId}>
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "min-h-32 w-full resize-y rounded-lg border border-[#cfe2ec] bg-white px-4 py-3 text-sm text-dark-blue outline-none transition placeholder:text-[#8a9aa8] focus:border-primary-blue focus:ring-4 focus:ring-[#008fd3]/10 disabled:cursor-not-allowed disabled:bg-gray-light disabled:text-gray-text",
          error && "border-[#fca5a5] focus:border-[#dc2626] focus:ring-[#dc2626]/10",
          className,
        )}
        id={textareaId}
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

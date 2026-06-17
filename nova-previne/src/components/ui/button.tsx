import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "border border-primary-blue bg-primary-blue text-white shadow-[0_12px_28px_rgba(0,143,211,0.24)] hover:border-[#007bb6] hover:bg-[#007bb6] hover:shadow-[0_16px_34px_rgba(0,143,211,0.28)] focus-visible:ring-[#008fd3]/20",
  secondary:
    "border border-[#b9e4f4] bg-white text-dark-blue shadow-[0_8px_22px_rgba(0,59,111,0.05)] hover:border-primary-blue hover:bg-light-blue hover:text-primary-blue focus-visible:ring-[#008fd3]/15",
  success:
    "border border-primary-green bg-primary-green text-white shadow-[0_12px_28px_rgba(0,158,90,0.22)] hover:border-[#00834b] hover:bg-[#00834b] hover:shadow-[0_16px_34px_rgba(0,158,90,0.26)] focus-visible:ring-[#009e5a]/20",
  neutral:
    "border border-[#dbe8ef] bg-[#f6fafc] text-dark-blue hover:border-[#c7d7e5] hover:bg-white hover:text-primary-blue focus-visible:ring-[#003b6f]/10",
  danger:
    "border border-[#b42318] bg-[#b42318] text-white shadow-[0_12px_28px_rgba(180,35,24,0.18)] hover:border-[#912018] hover:bg-[#912018] focus-visible:ring-[#b42318]/20",
};

const sizes = {
  sm: "min-h-10 px-4 py-2 text-sm",
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-12 px-6 py-3 text-base",
};

type ButtonTone = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

type SharedButtonProps = {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  size?: ButtonSize;
  variant?: ButtonTone;
};

const baseButtonClasses =
  "inline-flex min-w-0 select-none items-center justify-center gap-2 rounded-lg font-semibold leading-5 transition duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-60 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0";

function ButtonContent({
  children,
  icon,
  iconPosition = "left",
  isLoading,
}: Pick<SharedButtonProps, "children" | "icon" | "iconPosition" | "isLoading">) {
  const loadingIndicator = (
    <span
      aria-hidden="true"
      className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );

  return (
    <>
      {isLoading && loadingIndicator}
      {!isLoading && iconPosition === "left" && icon}
      <span className="min-w-0">{children}</span>
      {!isLoading && iconPosition === "right" && icon}
    </>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & SharedButtonProps;

export function Button({
  children,
  className,
  disabled,
  icon,
  iconPosition,
  isLoading,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(baseButtonClasses, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      <ButtonContent icon={icon} iconPosition={iconPosition} isLoading={isLoading}>
        {children}
      </ButtonContent>
    </button>
  );
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & SharedButtonProps;

export function ButtonLink({
  children,
  className,
  icon,
  iconPosition,
  isLoading,
  size = "md",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(baseButtonClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      <ButtonContent icon={icon} iconPosition={iconPosition} isLoading={isLoading}>
        {children}
      </ButtonContent>
    </Link>
  );
}

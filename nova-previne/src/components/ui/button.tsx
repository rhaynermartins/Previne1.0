import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary-blue text-white shadow-[0_10px_26px_rgba(0,143,211,0.22)] hover:bg-[#007bb6] focus-visible:outline-primary-blue",
  secondary:
    "border border-[#b9e4f4] bg-white text-dark-blue hover:border-primary-blue hover:bg-light-blue focus-visible:outline-primary-blue",
  success:
    "bg-primary-green text-white shadow-[0_10px_26px_rgba(0,158,90,0.2)] hover:bg-[#00834b] focus-visible:outline-primary-green",
  neutral:
    "border border-[#e5edf3] bg-gray-light text-dark-blue hover:bg-[#e8eef3] focus-visible:outline-dark-blue",
  danger:
    "bg-[#b42318] text-white shadow-[0_10px_26px_rgba(180,35,24,0.16)] hover:bg-[#912018] focus-visible:outline-[#b42318]",
};

const sizes = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
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
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60";

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
      <span>{children}</span>
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

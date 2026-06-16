import { AUTH_ROLES } from "@/lib/auth/constants";

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeOptionalText(value: string | null | undefined) {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : null;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));
}

export function isValidUserRole(value: unknown): value is (typeof AUTH_ROLES)[number] {
  return AUTH_ROLES.some((role) => role === value);
}

export function validatePasswordStrength(password: string) {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("A senha deve ter pelo menos 8 caracteres.");
  }

  if (!/[A-Za-z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra.");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("A senha deve conter pelo menos um numero.");
  }

  return errors;
}

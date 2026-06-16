import { UserRole } from "@/generated/prisma/enums";

export const AUTH_SESSION_COOKIE = "nova_previne_session";
export const AUTH_SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;
export const AUTH_PASSWORD_SALT_ROUNDS = 10;

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
} as const;

export const AUTH_ROLES = [UserRole.PATIENT, UserRole.DENTIST, UserRole.ADMIN] as const;

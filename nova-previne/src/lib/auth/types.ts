import type { UserRole } from "@/generated/prisma/enums";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthSessionPayload = {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
};

export type AuthSession = {
  user: AuthUser;
  issuedAt: Date;
  expiresAt: Date;
};

export type AuthValidationResult<T> =
  | {
      data: T;
      success: true;
    }
  | {
      errors: Record<string, string[]>;
      success: false;
    };

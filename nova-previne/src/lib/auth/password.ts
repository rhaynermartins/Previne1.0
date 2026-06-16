import bcrypt from "bcryptjs";

import { AUTH_PASSWORD_SALT_ROUNDS } from "@/lib/auth/constants";

export function hashPassword(password: string) {
  return bcrypt.hash(password, AUTH_PASSWORD_SALT_ROUNDS);
}

export function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

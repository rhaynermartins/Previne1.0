import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import type { AuthUser } from "@/lib/auth/types";
import { normalizeEmail } from "@/lib/auth/validation";

const authUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

const authUserWithPasswordSelect = {
  ...authUserSelect,
  passwordHash: true,
} as const;

export async function getAuthUserById(userId: string): Promise<AuthUser | null> {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: authUserSelect,
  });
}

export async function findAuthUserByEmail(email: string): Promise<AuthUser | null> {
  return prisma.user.findUnique({
    where: {
      email: normalizeEmail(email),
    },
    select: authUserSelect,
  });
}

export async function verifyUserCredentials(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: {
      email: normalizeEmail(email),
    },
    select: authUserWithPasswordSelect,
  });

  if (!user) {
    return null;
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

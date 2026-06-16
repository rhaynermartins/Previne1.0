import { cookies } from "next/headers";

import {
  AUTH_COOKIE_OPTIONS,
  AUTH_SESSION_COOKIE,
  AUTH_SESSION_DURATION_SECONDS,
} from "@/lib/auth/constants";
import { createSessionToken, verifySessionToken } from "@/lib/auth/token";
import type { AuthUser } from "@/lib/auth/types";
import { getAuthUserById } from "@/lib/auth/users";

export async function getCurrentAuthSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  return verifySessionToken(token);
}

export async function getCurrentAuthUser() {
  const session = await getCurrentAuthSession();

  if (!session) {
    return null;
  }

  return getAuthUserById(session.user.id);
}

export async function setAuthSessionCookie(user: AuthUser) {
  const token = createSessionToken(user);
  const cookieStore = await cookies();

  cookieStore.set(AUTH_SESSION_COOKIE, token, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: AUTH_SESSION_DURATION_SECONDS,
  });

  const session = verifySessionToken(token);

  if (!session) {
    throw new Error("Failed to verify generated authentication session.");
  }

  return session;
}

export async function clearAuthSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_SESSION_COOKIE);
}

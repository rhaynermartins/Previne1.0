import { createHmac, timingSafeEqual } from "node:crypto";

import {
  AUTH_SESSION_DURATION_SECONDS,
} from "@/lib/auth/constants";
import type { AuthSession, AuthSessionPayload, AuthUser } from "@/lib/auth/types";
import { isValidEmail, isValidUserRole } from "@/lib/auth/validation";

const tokenHeader = {
  alg: "HS256",
  typ: "JWT",
} as const;

function getSessionSecret({ required = true }: { required?: boolean } = {}) {
  const secret = process.env.SESSION_SECRET;

  if (!secret && required) {
    throw new Error("SESSION_SECRET is required to create authentication sessions.");
  }

  if (secret && secret.length < 32) {
    throw new Error("SESSION_SECRET must contain at least 32 characters.");
  }

  return secret;
}

function encodeBase64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signTokenParts(header: string, payload: string) {
  const secret = getSessionSecret();

  if (!secret) {
    throw new Error("SESSION_SECRET is required to sign authentication sessions.");
  }

  return createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url");
}

function signaturesMatch(receivedSignature: string, expectedSignature: string) {
  const received = Buffer.from(receivedSignature);
  const expected = Buffer.from(expectedSignature);

  return received.length === expected.length && timingSafeEqual(received, expected);
}

function parseTokenPart<T>(part: string): T | null {
  try {
    return JSON.parse(decodeBase64Url(part)) as T;
  } catch {
    return null;
  }
}

function isAuthSessionPayload(value: unknown): value is AuthSessionPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<AuthSessionPayload>;

  return (
    typeof payload.sub === "string" &&
    payload.sub.length > 0 &&
    typeof payload.name === "string" &&
    payload.name.length > 0 &&
    typeof payload.email === "string" &&
    isValidEmail(payload.email) &&
    isValidUserRole(payload.role) &&
    typeof payload.iat === "number" &&
    typeof payload.exp === "number" &&
    payload.exp > payload.iat
  );
}

function payloadToSession(payload: AuthSessionPayload): AuthSession {
  return {
    user: {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    },
    issuedAt: new Date(payload.iat * 1000),
    expiresAt: new Date(payload.exp * 1000),
  };
}

export function createSessionToken(user: AuthUser) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + AUTH_SESSION_DURATION_SECONDS;
  const header = encodeBase64Url(JSON.stringify(tokenHeader));
  const payload = encodeBase64Url(
    JSON.stringify({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      iat: issuedAt,
      exp: expiresAt,
    } satisfies AuthSessionPayload),
  );
  const signature = signTokenParts(header, payload);

  return `${header}.${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): AuthSession | null {
  if (!token || !getSessionSecret({ required: false })) {
    return null;
  }

  const [header, payload, receivedSignature] = token.split(".");

  if (!header || !payload || !receivedSignature) {
    return null;
  }

  const parsedHeader = parseTokenPart<typeof tokenHeader>(header);

  if (parsedHeader?.alg !== tokenHeader.alg || parsedHeader.typ !== tokenHeader.typ) {
    return null;
  }

  const expectedSignature = signTokenParts(header, payload);

  if (!signaturesMatch(receivedSignature, expectedSignature)) {
    return null;
  }

  const parsedPayload = parseTokenPart<unknown>(payload);

  if (!isAuthSessionPayload(parsedPayload)) {
    return null;
  }

  if (parsedPayload.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payloadToSession(parsedPayload);
}

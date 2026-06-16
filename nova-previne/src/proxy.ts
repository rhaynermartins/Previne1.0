import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { UserRole, type UserRole as UserRoleValue } from "@/generated/prisma/enums";
import { AUTH_SESSION_COOKIE } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/token";

const protectedRouteRules: Array<{
  path: string;
  roles: UserRoleValue[];
}> = [
  {
    path: "/dashboard/paciente",
    roles: [UserRole.PATIENT],
  },
  {
    path: "/dashboard/dentista",
    roles: [UserRole.DENTIST],
  },
  {
    path: "/dashboard/admin",
    roles: [UserRole.ADMIN],
  },
];

const dashboardPathsByRole: Record<UserRoleValue, string> = {
  [UserRole.ADMIN]: "/dashboard/admin",
  [UserRole.DENTIST]: "/dashboard/dentista",
  [UserRole.PATIENT]: "/dashboard/paciente",
};

function getMatchingProtectedRoute(pathname: string) {
  return protectedRouteRules.find(
    (rule) => pathname === rule.path || pathname.startsWith(`${rule.path}/`),
  );
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  const requestedPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  loginUrl.searchParams.set("next", requestedPath);

  return NextResponse.redirect(loginUrl);
}

function redirectToRoleDashboard(request: NextRequest, role: UserRoleValue) {
  return NextResponse.redirect(new URL(dashboardPathsByRole[role], request.url));
}

export function proxy(request: NextRequest) {
  const session = verifySessionToken(
    request.cookies.get(AUTH_SESSION_COOKIE)?.value,
  );
  const pathname = request.nextUrl.pathname;

  if (!session) {
    return redirectToLogin(request);
  }

  if (pathname === "/dashboard") {
    return redirectToRoleDashboard(request, session.user.role);
  }

  const protectedRoute = getMatchingProtectedRoute(pathname);

  if (!protectedRoute) {
    return NextResponse.next();
  }

  if (!protectedRoute.roles.includes(session.user.role)) {
    return redirectToRoleDashboard(request, session.user.role);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

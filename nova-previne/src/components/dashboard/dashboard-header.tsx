import { Bell, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { logout } from "@/app/login/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type DashboardHeaderProps = {
  roleLabel?: string;
  sessionLabel?: string;
  notificationsHref?: string;
  showNotifications?: boolean;
  unreadNotificationsCount?: number;
  user: {
    email: string;
    name: string;
  };
};

export function DashboardHeader({
  notificationsHref = "/dashboard/paciente/notificacoes",
  roleLabel = "Paciente",
  sessionLabel = "Sessão ativa em",
  showNotifications = true,
  unreadNotificationsCount = 0,
  user,
}: DashboardHeaderProps) {
  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <header className="overflow-hidden rounded-lg border border-[#d9ebf2] bg-white shadow-[var(--shadow-card)] ring-1 ring-white/70">
      <div className="h-2 bg-[linear-gradient(90deg,#008fd3,#009e5a)]" />
      <div className="p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-[#b9e4f4] bg-light-blue text-lg font-bold text-primary-blue">
            {initials || "NP"}
          </span>
          <div className="min-w-0">
            <Badge variant="green">{roleLabel}</Badge>
            <h1 className="mt-3 break-words text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Olá, {user.name}
            </h1>
            <div className="mt-3 flex items-start gap-2 text-sm leading-6 text-gray-text">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary-green"
              />
              <p className="min-w-0">
                {sessionLabel}{" "}
                <span className="break-all font-semibold text-dark-blue">
                  {user.email}
                </span>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
          {showNotifications && (
            <Link
              aria-label={
                unreadNotificationsCount > 0
                  ? `${unreadNotificationsCount} notificações não lidas`
                  : "Abrir notificações"
              }
              className="relative inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#b9e4f4] bg-white px-5 text-sm font-semibold text-dark-blue transition hover:border-primary-blue hover:bg-light-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
              href={notificationsHref}
            >
              <Bell aria-hidden="true" className="size-4" />
              <span>Notificações</span>
              {unreadNotificationsCount > 0 && (
                <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary-green px-2 py-0.5 text-xs font-bold text-white">
                  {unreadNotificationsCount > 99
                    ? "99+"
                    : unreadNotificationsCount}
                </span>
              )}
            </Link>
          )}

          <form action={logout} className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto"
              icon={<LogOut aria-hidden="true" className="size-4" />}
              type="submit"
              variant="secondary"
            >
              Sair
            </Button>
          </form>
        </div>
      </div>
      </div>
    </header>
  );
}

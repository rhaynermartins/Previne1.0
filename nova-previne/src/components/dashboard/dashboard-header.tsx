import { Bell, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { logout } from "@/app/login/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type DashboardHeaderProps = {
  roleLabel?: string;
  sessionLabel?: string;
  notificationsHref?: string;
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
  unreadNotificationsCount = 0,
  user,
}: DashboardHeaderProps) {
  return (
    <header className="rounded-lg border border-[#d9ebf2] bg-white p-5 shadow-[0_14px_38px_rgba(0,59,111,0.08)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
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

        <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
          <Link
            aria-label={
              unreadNotificationsCount > 0
                ? `${unreadNotificationsCount} notificacoes nao lidas`
                : "Abrir notificacoes"
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
    </header>
  );
}

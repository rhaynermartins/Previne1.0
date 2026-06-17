import { LogOut, ShieldCheck } from "lucide-react";

import { logout } from "@/app/login/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type DashboardHeaderProps = {
  roleLabel?: string;
  sessionLabel?: string;
  user: {
    email: string;
    name: string;
  };
};

export function DashboardHeader({
  roleLabel = "Paciente",
  sessionLabel = "Sessão ativa em",
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

        <form action={logout} className="w-full lg:w-auto">
          <Button
            className="w-full lg:w-auto"
            icon={<LogOut aria-hidden="true" className="size-4" />}
            type="submit"
            variant="secondary"
          >
            Sair
          </Button>
        </form>
      </div>
    </header>
  );
}

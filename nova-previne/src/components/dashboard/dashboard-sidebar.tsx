"use client";

import {
  CalendarDays,
  CalendarRange,
  Clock,
  History,
  LayoutDashboard,
  PlusCircle,
  Stethoscope,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type DashboardNavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

const patientNavItems: DashboardNavItem[] = [
  {
    href: "/dashboard/paciente",
    icon: LayoutDashboard,
    label: "Início",
  },
  {
    href: "/dashboard/paciente/perfil",
    icon: UserRound,
    label: "Perfil",
  },
  {
    href: "/dashboard/paciente/consultas",
    icon: CalendarDays,
    label: "Consultas",
  },
  {
    href: "/dashboard/paciente/historico",
    icon: History,
    label: "Histórico",
  },
  {
    href: "/dashboard/paciente/agendamento",
    icon: PlusCircle,
    label: "Agendar",
  },
];

const dentistNavItems: DashboardNavItem[] = [
  {
    href: "/dashboard/dentista",
    icon: LayoutDashboard,
    label: "Início",
  },
  {
    href: "/dashboard/dentista/perfil",
    icon: Stethoscope,
    label: "Perfil",
  },
  {
    href: "/dashboard/dentista/disponibilidade",
    icon: Clock,
    label: "Disponibilidade",
  },
  {
    href: "/dashboard/dentista/solicitacoes",
    icon: CalendarDays,
    label: "Solicitações",
  },
  {
    href: "/dashboard/dentista/agenda",
    icon: CalendarRange,
    label: "Agenda",
  },
  {
    href: "/dashboard/dentista/historico",
    icon: History,
    label: "Histórico",
  },
];

type DashboardSidebarProps = {
  areaLabel?: string;
  homeHref?: string;
  navLabel?: string;
  navItems?: DashboardNavItem[];
};

function isActivePath(pathname: string, href: string, homeHref: string) {
  if (href === homeHref) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar({
  areaLabel = "Área do paciente",
  homeHref = "/dashboard/paciente",
  navLabel = "Navegação do dashboard do paciente",
  navItems = patientNavItems,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-20 z-30 rounded-lg border border-[#d9ebf2] bg-white p-2 shadow-[0_14px_38px_rgba(0,59,111,0.08)] sm:p-3 lg:top-28">
      <div className="hidden border-b border-[#edf4f8] px-3 pb-4 lg:block">
        <p className="text-sm font-bold text-dark-blue">{areaLabel}</p>
        <p className="mt-1 text-xs font-medium text-gray-text">
          Nova Previne
        </p>
      </div>

      <nav
        aria-label={navLabel}
        className="flex snap-x gap-2 overflow-x-auto pb-1 lg:mt-3 lg:grid lg:overflow-visible lg:pb-0"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href, homeHref);

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue",
                active
                  ? "bg-light-blue text-primary-blue"
                  : "text-gray-text hover:bg-surface hover:text-dark-blue",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon aria-hidden="true" className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export { dentistNavItems, patientNavItems };

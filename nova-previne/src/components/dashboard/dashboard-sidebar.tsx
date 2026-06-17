"use client";

import {
  Bell,
  CalendarDays,
  CalendarRange,
  Clock,
  ClipboardList,
  History,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  Stethoscope,
  Users,
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
    href: "/dashboard/paciente/notificacoes",
    icon: Bell,
    label: "Notificações",
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
  {
    href: "/dashboard/dentista/notificacoes",
    icon: Bell,
    label: "Notificações",
  },
];

const adminNavItems: DashboardNavItem[] = [
  {
    href: "/dashboard/admin",
    icon: LayoutDashboard,
    label: "Início",
  },
  {
    href: "/dashboard/admin/pacientes",
    icon: Users,
    label: "Pacientes",
  },
  {
    href: "/dashboard/admin/dentistas",
    icon: Stethoscope,
    label: "Dentistas",
  },
  {
    href: "/dashboard/admin/servicos",
    icon: ClipboardList,
    label: "Serviços",
  },
  {
    href: "/dashboard/admin/consultas",
    icon: CalendarDays,
    label: "Consultas",
  },
  {
    href: "/dashboard/admin/contatos",
    icon: MessageSquare,
    label: "Contatos",
  },
];

type DashboardSidebarProps = {
  areaLabel?: string;
  homeHref?: string;
  navLabel?: string;
  navItems?: DashboardNavItem[];
  unreadNotificationsCount?: number;
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
  unreadNotificationsCount = 0,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-20 z-30 min-w-0 overflow-hidden rounded-lg border border-[#d9ebf2]/90 bg-white/90 p-2 shadow-[var(--shadow-card)] ring-1 ring-white/80 backdrop-blur-xl sm:p-3 lg:top-28">
      <div className="hidden border-b border-[#edf4f8] px-3 pb-4 lg:block">
        <div className="mb-4 h-1.5 rounded-full bg-[image:var(--gradient-brand)]" />
        <p className="text-sm font-bold text-dark-blue">{areaLabel}</p>
        <p className="mt-1 text-xs font-medium text-gray-text">
          Nova Previne
        </p>
        <p className="mt-3 rounded-lg border border-[#b7ead3] bg-light-green px-3 py-2 text-xs font-bold text-[#006b3d] shadow-[0_8px_20px_rgba(0,158,90,0.08)]">
          Painel seguro
        </p>
      </div>

      <nav
        aria-label={navLabel}
        className="flex min-w-0 snap-x gap-2 overflow-x-auto pb-1 lg:mt-3 lg:grid lg:overflow-visible lg:pb-0"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href, homeHref);

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-lg border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#008fd3]/15",
                active
                  ? "border-[#b9e4f4] bg-light-blue text-primary-blue shadow-[0_10px_26px_rgba(0,143,211,0.1)]"
                  : "border-transparent text-gray-text hover:border-[#d9ebf2] hover:bg-white hover:text-dark-blue",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon aria-hidden="true" className="size-4" />
              <span>{item.label}</span>
              {item.href.includes("/notificacoes") &&
                unreadNotificationsCount > 0 && (
                  <span
                    aria-label={`${unreadNotificationsCount} notificações não lidas`}
                    className="ml-auto inline-flex min-w-6 items-center justify-center rounded-full bg-primary-green px-2 py-0.5 text-xs font-bold text-white"
                  >
                    {unreadNotificationsCount > 99
                      ? "99+"
                      : unreadNotificationsCount}
                  </span>
                )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export { adminNavItems, dentistNavItems, patientNavItems };

import {
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  MessageSquare,
  Stethoscope,
  Users,
} from "lucide-react";
import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppointmentStatus, UserRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Início administrativo | Nova Previne",
  description:
    "Métricas e acompanhamento administrativo da Clínica Odontológica Nova Previne.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SummaryCardProps = {
  description: string;
  icon: React.ReactNode;
  label: string;
  tone: "blue" | "green" | "amber" | "gray";
  value: number;
};

const summaryTones = {
  amber: "border-[#fde68a] bg-[#fffbeb] text-[#92400e]",
  blue: "border-[#b9e4f4] bg-light-blue text-primary-blue",
  gray: "border-[#e5e7eb] bg-gray-light text-gray-text",
  green: "border-[#b7ead3] bg-light-green text-primary-green",
};

function SummaryCard({
  description,
  icon,
  label,
  tone,
  value,
}: SummaryCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-gray-text">{label}</p>
          <p className="mt-3 text-3xl font-bold text-dark-blue">{value}</p>
        </div>
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-lg border ${summaryTones[tone]}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-gray-text">{description}</p>
    </Card>
  );
}

async function getAdminDashboardData() {
  const [
    patientsCount,
    dentistsCount,
    activeDentistsCount,
    appointmentsCount,
    requestedAppointmentsCount,
    confirmedAppointmentsCount,
    servicesCount,
    unreadMessagesCount,
    recentAppointments,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        role: UserRole.PATIENT,
      },
    }),
    prisma.user.count({
      where: {
        role: UserRole.DENTIST,
      },
    }),
    prisma.dentistProfile.count({
      where: {
        active: true,
      },
    }),
    prisma.appointment.count(),
    prisma.appointment.count({
      where: {
        status: AppointmentStatus.REQUESTED,
      },
    }),
    prisma.appointment.count({
      where: {
        status: AppointmentStatus.CONFIRMED,
      },
    }),
    prisma.service.count(),
    prisma.contactMessage.count({
      where: {
        read: false,
      },
    }),
    prisma.appointment.findMany({
      orderBy: [
        {
          date: "desc",
        },
        {
          startTime: "desc",
        },
      ],
      select: {
        date: true,
        id: true,
        patient: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        service: {
          select: {
            name: true,
          },
        },
        status: true,
      },
      take: 4,
    }),
  ]);

  return {
    activeDentistsCount,
    appointmentsCount,
    confirmedAppointmentsCount,
    dentistsCount,
    patientsCount,
    recentAppointments,
    requestedAppointmentsCount,
    servicesCount,
    unreadMessagesCount,
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Painel administrativo
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Acompanhe a operação da Nova Previne.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Veja pacientes, dentistas, consultas, serviços e mensagens de
              contato em uma visão gerencial objetiva.
            </p>
          </div>

          <div className="rounded-lg border border-[#b7ead3] bg-light-green p-4 text-sm font-semibold text-[#006b3d] lg:text-right">
            {data.activeDentistsCount} dentistas ativos
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          description="Pacientes cadastrados no sistema."
          icon={<Users aria-hidden="true" className="size-5" />}
          label="Pacientes"
          tone="blue"
          value={data.patientsCount}
        />
        <SummaryCard
          description="Profissionais cadastrados, ativos ou inativos."
          icon={<Stethoscope aria-hidden="true" className="size-5" />}
          label="Dentistas"
          tone="green"
          value={data.dentistsCount}
        />
        <SummaryCard
          description="Consultas registradas em todos os status."
          icon={<CalendarCheck aria-hidden="true" className="size-5" />}
          label="Consultas"
          tone="amber"
          value={data.appointmentsCount}
        />
        <SummaryCard
          description="Mensagens de contato ainda não lidas."
          icon={<MessageSquare aria-hidden="true" className="size-5" />}
          label="Contatos pendentes"
          tone="gray"
          value={data.unreadMessagesCount}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card padding="lg">
          <p className="text-sm font-bold text-primary-green">Consultas</p>
          <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
            Status operacionais
          </h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] p-4">
              <CalendarClock
                aria-hidden="true"
                className="size-6 text-[#92400e]"
              />
              <p className="mt-3 text-2xl font-bold text-dark-blue">
                {data.requestedAppointmentsCount}
              </p>
              <p className="mt-1 text-sm text-gray-text">Solicitadas</p>
            </div>
            <div className="rounded-lg border border-[#b7ead3] bg-light-green p-4">
              <CalendarCheck
                aria-hidden="true"
                className="size-6 text-primary-green"
              />
              <p className="mt-3 text-2xl font-bold text-dark-blue">
                {data.confirmedAppointmentsCount}
              </p>
              <p className="mt-1 text-sm text-gray-text">Confirmadas</p>
            </div>
          </div>
          <ButtonLink
            className="mt-6 w-full sm:w-auto"
            href="/dashboard/admin/consultas"
            variant="secondary"
          >
            Ver consultas
          </ButtonLink>
        </Card>

        <Card padding="lg">
          <p className="text-sm font-bold text-primary-green">Ações rápidas</p>
          <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
            Gestão básica
          </h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ButtonLink href="/dashboard/admin/dentistas" variant="secondary">
              Gerenciar dentistas
            </ButtonLink>
            <ButtonLink href="/dashboard/admin/servicos" variant="secondary">
              Gerenciar serviços
            </ButtonLink>
            <ButtonLink href="/dashboard/admin/pacientes" variant="secondary">
              Ver pacientes
            </ButtonLink>
            <ButtonLink href="/dashboard/admin/contatos" variant="secondary">
              Ver contatos
            </ButtonLink>
          </div>
          <div className="mt-6 rounded-lg border border-[#d9ebf2] bg-surface p-4">
            <ClipboardList
              aria-hidden="true"
              className="size-6 text-primary-blue"
            />
            <p className="mt-3 text-sm leading-6 text-gray-text">
              {data.servicesCount} serviços cadastrados para uso nas páginas
              públicas e no agendamento.
            </p>
          </div>
        </Card>
      </div>

      <Card padding="lg">
        <p className="text-sm font-bold text-primary-green">Últimas consultas</p>
        <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
          Registros recentes
        </h3>

        <div className="mt-6 grid gap-3">
          {data.recentAppointments.map((appointment) => (
            <div
              className="rounded-lg border border-[#d9ebf2] bg-surface p-4"
              key={appointment.id}
            >
              <p className="text-sm font-bold text-dark-blue">
                {appointment.patient.user.name}
              </p>
              <p className="mt-1 text-sm leading-6 text-gray-text">
                {appointment.service.name} em {formatDate(appointment.date)} -
                status {appointment.status}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

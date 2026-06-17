import {
  Archive,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  History,
  Phone,
  Stethoscope,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { AppointmentStatus } from "@/generated/prisma/enums";
import { getCurrentAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Histórico do dentista | Nova Previne",
  description:
    "Histórico de atendimentos do dentista na Clínica Odontológica Nova Previne.",
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

type DentistHistoryCardProps = {
  appointment: {
    caseDescription: string;
    date: Date;
    endTime: string;
    patientName: string;
    patientPhone?: string | null;
    patientWhatsapp?: string | null;
    refusalReason?: string | null;
    serviceName: string;
    startTime: string;
    status: AppointmentStatus;
  };
};

function getTodayDate() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

function formatContactValue(value?: string | null) {
  return value?.trim() ? value : "Não informado";
}

function SummaryCard({
  description,
  icon,
  label,
  tone,
  value,
}: SummaryCardProps) {
  return (
    <MetricCard
      description={description}
      icon={icon}
      label={label}
      tone={tone}
      value={value}
    />
  );
}

function DentistHistoryCard({ appointment }: DentistHistoryCardProps) {
  return (
    <Card padding="lg">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
            <Stethoscope aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-primary-green">
              Registro de atendimento
            </p>
            <h3 className="mt-1 break-words text-xl font-bold text-dark-blue">
              {appointment.serviceName}
            </h3>
          </div>
        </div>

        <div className="self-start">
          <StatusBadge status={appointment.status} />
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
          <div className="flex items-start gap-3">
            <CalendarDays
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary-blue"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-dark-blue">Data</p>
              <p className="mt-1 break-words text-sm leading-6 text-gray-text">
                {formatDate(appointment.date)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
          <div className="flex items-start gap-3">
            <Clock
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary-green"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-dark-blue">Horário</p>
              <p className="mt-1 text-sm leading-6 text-gray-text">
                {appointment.startTime} às {appointment.endTime}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4 md:col-span-2">
          <div className="flex items-start gap-3">
            <UserRound
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary-blue"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-dark-blue">Paciente</p>
              <p className="mt-1 break-words text-sm font-semibold leading-6 text-dark-blue">
                {appointment.patientName}
              </p>
              <p className="break-words text-sm leading-6 text-gray-text">
                WhatsApp:{" "}
                {formatContactValue(
                  appointment.patientWhatsapp ?? appointment.patientPhone,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-[#d9ebf2] bg-white p-4">
          <div className="flex items-start gap-3">
            <FileText
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary-green"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-dark-blue">
                Descrição prévia do caso
              </p>
              <p className="mt-2 break-words text-sm leading-6 text-gray-text">
                {appointment.caseDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
          <div className="flex items-start gap-3">
            <Archive
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary-blue"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-dark-blue">
                Observação do registro
              </p>
              <p className="mt-2 break-words text-sm leading-6 text-gray-text">
                {appointment.refusalReason?.trim()
                  ? appointment.refusalReason
                  : "Nenhuma observação adicional registrada."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

async function getDentistAppointmentHistory(userId: string) {
  try {
    return prisma.dentistProfile.findUnique({
      select: {
        appointments: {
          orderBy: [
            {
              date: "desc",
            },
            {
              startTime: "desc",
            },
          ],
          select: {
            caseDescription: true,
            date: true,
            endTime: true,
            id: true,
            patient: {
              select: {
                user: {
                  select: {
                    name: true,
                    phone: true,
                    whatsapp: true,
                  },
                },
              },
            },
            refusalReason: true,
            service: {
              select: {
                name: true,
              },
            },
            startTime: true,
            status: true,
          },
          where: {
            OR: [
              {
                date: {
                  lt: getTodayDate(),
                },
              },
              {
                status: {
                  in: [
                    AppointmentStatus.COMPLETED,
                    AppointmentStatus.CANCELLED,
                    AppointmentStatus.REFUSED,
                  ],
                },
              },
            ],
          },
        },
      },
      where: {
        userId,
      },
    });
  } catch {
    return null;
  }
}

export default async function DentistHistoryPage() {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?next=/dashboard/dentista/historico");
  }

  const history = await getDentistAppointmentHistory(session.user.id);
  const appointments = history?.appointments ?? [];
  const completedCount = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.COMPLETED,
  ).length;
  const refusedCount = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.REFUSED,
  ).length;
  const cancelledCount = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.CANCELLED,
  ).length;
  const pastCount = appointments.filter(
    (appointment) => appointment.date < getTodayDate(),
  ).length;

  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Histórico de atendimentos
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Consulte registros anteriores da sua agenda.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Veja consultas passadas ou marcadas como concluídas, recusadas e
              canceladas, com paciente, tratamento, data, horário e descrição do
              caso.
            </p>
          </div>

          <div className="rounded-lg border border-[#b7ead3] bg-light-green p-4 text-sm font-semibold text-[#006b3d] lg:text-right">
            {appointments.length}{" "}
            {appointments.length === 1
              ? "registro encontrado"
              : "registros encontrados"}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          description="Consultas com status concluído."
          icon={<CheckCircle2 aria-hidden="true" className="size-5" />}
          label="Concluídas"
          tone="green"
          value={completedCount}
        />
        <SummaryCard
          description="Registros com data anterior a hoje."
          icon={<History aria-hidden="true" className="size-5" />}
          label="Passadas"
          tone="blue"
          value={pastCount}
        />
        <SummaryCard
          description="Consultas recusadas registradas no sistema."
          icon={<CalendarClock aria-hidden="true" className="size-5" />}
          label="Recusadas"
          tone="amber"
          value={refusedCount}
        />
        <SummaryCard
          description="Consultas canceladas que ficaram no histórico."
          icon={<Archive aria-hidden="true" className="size-5" />}
          label="Canceladas"
          tone="gray"
          value={cancelledCount}
        />
      </div>

      {appointments.length > 0 ? (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <DentistHistoryCard
              appointment={{
                caseDescription: appointment.caseDescription,
                date: appointment.date,
                endTime: appointment.endTime,
                patientName: appointment.patient.user.name,
                patientPhone: appointment.patient.user.phone,
                patientWhatsapp: appointment.patient.user.whatsapp,
                refusalReason: appointment.refusalReason,
                serviceName: appointment.service.name,
                startTime: appointment.startTime,
                status: appointment.status,
              }}
              key={appointment.id}
            />
          ))}
        </div>
      ) : (
        <Card padding="lg">
          <EmptyState
            description="Quando houver consultas passadas ou registros concluídos, recusados ou cancelados, eles aparecerão nesta área."
            icon={<History aria-hidden="true" className="size-6" />}
            title="Nenhum histórico encontrado."
          />
        </Card>
      )}

      <Card padding="lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
              <CalendarCheck aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-base font-bold text-dark-blue">
                Organização do histórico
              </p>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-text">
                Os registros anteriores ficam separados da agenda ativa para
                manter a consulta profissional rápida e fácil de revisar.
              </p>
            </div>
          </div>

          <ButtonLink
            className="w-full md:w-auto"
            href="/dashboard/dentista/agenda"
            variant="secondary"
          >
            Ver agenda
          </ButtonLink>
        </div>
      </Card>

      <Card className="flex items-start gap-4" padding="lg">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-green text-primary-green">
          <Phone aria-hidden="true" className="size-5" />
        </span>
        <div>
          <p className="text-base font-bold text-dark-blue">
            Contatos preservados para acompanhamento
          </p>
          <p className="mt-1 text-sm leading-6 text-gray-text">
            O histórico mantém os contatos básicos do paciente para consulta
            profissional autenticada, sem expor dados fora do painel.
          </p>
        </div>
      </Card>
    </section>
  );
}

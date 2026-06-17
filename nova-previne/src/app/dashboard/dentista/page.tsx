import {
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  Clock,
  ClipboardList,
  FileText,
  History,
  Mail,
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
  title: "Início do dentista | Nova Previne",
  description:
    "Página inicial do painel profissional do dentista na Clínica Odontológica Nova Previne.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const nextSteps = [
  "Acompanhe as solicitações pendentes antes da confirmação.",
  "Mantenha seu perfil profissional pronto para os pacientes.",
  "Use a agenda para organizar os próximos atendimentos clínicos.",
];

type SummaryCardProps = {
  description: string;
  icon: React.ReactNode;
  label: string;
  tone: "blue" | "green" | "amber" | "gray";
  value: number;
};

type DentistAppointmentCardProps = {
  appointment: {
    caseDescription: string;
    date: Date;
    endTime: string;
    patientName: string;
    patientPhone?: string | null;
    patientWhatsapp?: string | null;
    serviceName: string;
    startTime: string;
    status: AppointmentStatus;
  };
};

function getFirstName(name: string) {
  return name.split(" ").filter(Boolean)[0] ?? name;
}

function formatContactValue(value?: string | null) {
  return value?.trim() ? value : "Não informado";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

function formatDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
}

function getTodayDate() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
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

function DentistAppointmentCard({ appointment }: DentistAppointmentCardProps) {
  return (
    <Card padding="lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
            <Stethoscope aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-primary-green">Atendimento</p>
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

      <div className="mt-4 rounded-lg border border-[#d9ebf2] bg-white p-4">
        <div className="flex items-start gap-3">
          <FileText
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-primary-green"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-dark-blue">Descrição do caso</p>
            <p className="mt-1 break-words text-sm leading-6 text-gray-text">
              {appointment.caseDescription}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

async function getDentistDashboardData(userId: string) {
  try {
    return prisma.user.findUnique({
      select: {
        email: true,
        name: true,
        dentistProfile: {
          select: {
            active: true,
            appointments: {
              orderBy: [
                {
                  date: "asc",
                },
                {
                  startTime: "asc",
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
                service: {
                  select: {
                    name: true,
                  },
                },
                startTime: true,
                status: true,
              },
            },
            availabilities: {
              select: {
                active: true,
                weekDay: true,
              },
            },
            bio: true,
            cro: true,
            phone: true,
            specialty: true,
          },
        },
        phone: true,
        whatsapp: true,
      },
      where: {
        id: userId,
      },
    });
  } catch {
    return null;
  }
}

export default async function DentistDashboardPage() {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?next=/dashboard/dentista");
  }

  const dentist = await getDentistDashboardData(session.user.id);
  const profile = dentist?.dentistProfile ?? null;
  const today = getTodayDate();
  const todayKey = formatDateKey(today);
  const appointments = profile?.appointments ?? [];
  const todayAppointments = appointments.filter(
    (appointment) =>
      formatDateKey(appointment.date) === todayKey &&
      appointment.status !== AppointmentStatus.CANCELLED,
  );
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.REQUESTED,
  );
  const confirmedFutureCount = appointments.filter(
    (appointment) =>
      appointment.status === AppointmentStatus.CONFIRMED &&
      appointment.date >= today,
  ).length;
  const completedCount = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.COMPLETED,
  ).length;
  const activeAvailabilityDays = new Set(
    profile?.availabilities
      .filter((availability) => availability.active)
      .map((availability) => availability.weekDay) ?? [],
  ).size;
  const nextPendingAppointments = pendingAppointments.slice(0, 2);
  const todayAppointmentsPreview = todayAppointments.slice(0, 2);

  return (
    <section className="grid gap-5">
      <Card className="overflow-hidden" padding="lg">
        <div className="-mx-5 -mt-5 mb-5 h-1.5 bg-[image:var(--gradient-brand)] sm:-mx-6 lg:-mx-7" />
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Dashboard do dentista
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Bom trabalho, Dr(a). {getFirstName(dentist?.name ?? session.user.name)}.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Acompanhe sua rotina clínica, solicitações pendentes e informações
              profissionais em um painel organizado para o atendimento.
            </p>
          </div>

          <div className="rounded-lg border border-[#b7ead3] bg-light-green p-4 text-sm font-semibold text-[#006b3d]">
            {profile?.active === false
              ? "Perfil profissional inativo"
              : "Perfil profissional ativo"}
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-[#edf4f8] pt-5 sm:flex-row">
          <ButtonLink
            className="w-full sm:w-auto"
            href="/dashboard/dentista/solicitacoes"
            icon={<CalendarClock aria-hidden="true" className="size-5" />}
            size="lg"
            variant="success"
          >
            Ver solicitações
          </ButtonLink>
          <ButtonLink
            className="w-full sm:w-auto"
            href="/dashboard/dentista/agenda"
            icon={<CalendarRange aria-hidden="true" className="size-5" />}
            size="lg"
            variant="secondary"
          >
            Abrir agenda
          </ButtonLink>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          description="Consultas solicitadas aguardando avaliação do dentista."
          icon={<CalendarClock aria-hidden="true" className="size-5" />}
          label="Pendentes"
          tone="amber"
          value={pendingAppointments.length}
        />
        <SummaryCard
          description="Atendimentos confirmados a partir de hoje."
          icon={<CalendarCheck aria-hidden="true" className="size-5" />}
          label="Confirmadas"
          tone="green"
          value={confirmedFutureCount}
        />
        <SummaryCard
          description="Atendimentos encontrados para a data de hoje."
          icon={<CalendarDays aria-hidden="true" className="size-5" />}
          label="Hoje"
          tone="blue"
          value={todayAppointments.length}
        />
        <SummaryCard
          description="Consultas concluídas vinculadas ao perfil profissional."
          icon={<History aria-hidden="true" className="size-5" />}
          label="Histórico"
          tone="gray"
          value={completedCount}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card padding="lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold text-primary-green">
                Consultas de hoje
              </p>
              <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
                Rotina clínica do dia
              </h3>
            </div>
            <ButtonLink
              className="w-full sm:w-auto"
              href="/dashboard/dentista/agenda"
              variant="secondary"
            >
              Ver agenda
            </ButtonLink>
          </div>

          {todayAppointmentsPreview.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {todayAppointmentsPreview.map((appointment) => (
                <DentistAppointmentCard
                  appointment={{
                    caseDescription: appointment.caseDescription,
                    date: appointment.date,
                    endTime: appointment.endTime,
                    patientName: appointment.patient.user.name,
                    patientPhone: appointment.patient.user.phone,
                    patientWhatsapp: appointment.patient.user.whatsapp,
                    serviceName: appointment.service.name,
                    startTime: appointment.startTime,
                    status: appointment.status,
                  }}
                  key={appointment.id}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-6"
              description="Quando houver atendimento solicitado ou confirmado para a data atual, ele aparecerá neste espaço de acompanhamento rápido."
              icon={<CalendarDays aria-hidden="true" className="size-6" />}
              title="Nenhuma consulta encontrada para hoje."
            />
          )}
        </Card>

        <Card padding="lg">
          <p className="text-sm font-bold text-primary-green">
            Dados profissionais
          </p>
          <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
            Perfil clínico
          </h3>

          <div className="mt-6 grid gap-3">
            <div className="flex items-start gap-3 rounded-lg border border-[#d9ebf2] bg-surface p-4">
              <Stethoscope
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-primary-blue"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-dark-blue">Especialidade</p>
                <p className="mt-1 break-words text-sm text-gray-text">
                  {formatContactValue(profile?.specialty)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[#d9ebf2] bg-surface p-4">
              <ClipboardList
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-primary-green"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-dark-blue">CRO</p>
                <p className="mt-1 break-words text-sm text-gray-text">
                  {formatContactValue(profile?.cro)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[#d9ebf2] bg-surface p-4">
              <Phone
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-primary-blue"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-dark-blue">Telefone</p>
                <p className="mt-1 break-words text-sm text-gray-text">
                  {formatContactValue(profile?.phone ?? dentist?.phone)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[#d9ebf2] bg-surface p-4">
              <Clock
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-primary-green"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-dark-blue">
                  Dias com disponibilidade
                </p>
                <p className="mt-1 text-sm text-gray-text">
                  {activeAvailabilityDays}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card padding="lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold text-primary-green">
                Solicitações pendentes
              </p>
              <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
                Casos aguardando avaliação
              </h3>
            </div>
            <ButtonLink
              className="w-full sm:w-auto"
              href="/dashboard/dentista/solicitacoes"
              variant="secondary"
            >
              Ver todas
            </ButtonLink>
          </div>

          {nextPendingAppointments.length > 0 ? (
            <div className="mt-6 grid gap-3">
              {nextPendingAppointments.map((appointment) => (
                <div
                  className="rounded-lg border border-[#d9ebf2] bg-surface p-4"
                  key={appointment.id}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-bold text-dark-blue">
                        {appointment.patient.user.name}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-text">
                        {appointment.service.name} em{" "}
                        {formatDate(appointment.date)}, das{" "}
                        {appointment.startTime} às {appointment.endTime}
                      </p>
                    </div>
                    <StatusBadge status={appointment.status} />
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-text">
                    {appointment.caseDescription}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-6"
              description="Novas solicitações de pacientes ficarão destacadas aqui para acompanhamento inicial."
              icon={<CheckCircle2 aria-hidden="true" className="size-6" />}
              title="Nenhuma solicitação pendente."
              tone="green"
            />
          )}
        </Card>

        <Card padding="lg">
          <p className="text-sm font-bold text-primary-green">Acompanhamento</p>
          <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
            Rotina profissional na Nova Previne
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
            A página inicial concentra o que o dentista precisa ver primeiro,
            mantendo as ações completas reservadas para as telas próprias da
            Fase 8.
          </p>

          <div className="mt-6 grid gap-3">
            {nextSteps.map((step) => (
              <div
                className="flex items-start gap-3 rounded-lg border border-[#d9ebf2] bg-surface p-4"
                key={step}
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-primary-green"
                />
                <p className="text-sm font-semibold leading-6 text-dark-blue">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card padding="lg">
        <div className="grid gap-4 md:grid-cols-3">
          <ButtonLink
            href="/dashboard/dentista/perfil"
            icon={<Mail aria-hidden="true" className="size-4" />}
            variant="secondary"
          >
            Revisar perfil
          </ButtonLink>
          <ButtonLink
            href="/dashboard/dentista/disponibilidade"
            icon={<Clock aria-hidden="true" className="size-4" />}
            variant="secondary"
          >
            Ver disponibilidade
          </ButtonLink>
          <ButtonLink
            href="/dashboard/dentista/historico"
            icon={<History aria-hidden="true" className="size-4" />}
            variant="secondary"
          >
            Abrir histórico
          </ButtonLink>
        </div>
      </Card>
    </section>
  );
}

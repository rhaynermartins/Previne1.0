import {
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  Clock,
  FileText,
  History,
  ShieldAlert,
  Stethoscope,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DentistAppointmentActions } from "@/components/dashboard/dentist-appointment-actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { AppointmentStatus } from "@/generated/prisma/enums";
import { getCurrentAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Agenda do dentista | Nova Previne",
  description:
    "Agenda de consultas do dentista na Clínica Odontológica Nova Previne.",
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

type AgendaAppointment = {
  caseDescription: string;
  date: Date;
  endTime: string;
  id: string;
  patientName: string;
  patientWhatsapp?: string | null;
  serviceName: string;
  startTime: string;
  status: AppointmentStatus;
};

const agendaStatuses = [
  AppointmentStatus.REQUESTED,
  AppointmentStatus.CONFIRMED,
];

const summaryTones = {
  amber: "border-[#fde68a] bg-[#fffbeb] text-[#92400e]",
  blue: "border-[#b9e4f4] bg-light-blue text-primary-blue",
  gray: "border-[#e5e7eb] bg-gray-light text-gray-text",
  green: "border-[#b7ead3] bg-light-green text-primary-green",
};

const weekDayFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "UTC",
  weekday: "long",
});

function getTodayDate() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);

  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
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

function AgendaAppointmentCard({
  appointment,
}: {
  appointment: AgendaAppointment;
}) {
  return (
    <div className="rounded-lg border border-[#d9ebf2] bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
            <Stethoscope aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="break-words text-sm font-bold text-dark-blue">
              {appointment.serviceName}
            </p>
            <p className="mt-1 text-sm leading-6 text-gray-text">
              {appointment.startTime} às {appointment.endTime}
            </p>
          </div>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
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
                WhatsApp: {formatContactValue(appointment.patientWhatsapp)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
          <div className="flex items-start gap-3">
            <FileText
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary-green"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-dark-blue">Descrição</p>
              <p className="mt-1 line-clamp-3 break-words text-sm leading-6 text-gray-text">
                {appointment.caseDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DentistAppointmentActions
        appointmentId={appointment.id}
        status={appointment.status}
      />
    </div>
  );
}

async function getDentistAgenda(userId: string) {
  try {
    return prisma.dentistProfile.findUnique({
      select: {
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
          where: {
            date: {
              gte: getTodayDate(),
            },
            status: {
              in: agendaStatuses,
            },
          },
        },
        scheduleBlocks: {
          orderBy: [
            {
              date: "asc",
            },
            {
              startTime: "asc",
            },
          ],
          select: {
            date: true,
            endTime: true,
            id: true,
            reason: true,
            startTime: true,
          },
          where: {
            date: {
              gte: getTodayDate(),
            },
          },
        },
        specialty: true,
      },
      where: {
        userId,
      },
    });
  } catch {
    return null;
  }
}

export default async function DentistSchedulePage() {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?next=/dashboard/dentista/agenda");
  }

  const agenda = await getDentistAgenda(session.user.id);
  const appointments =
    agenda?.appointments.map((appointment) => ({
      caseDescription: appointment.caseDescription,
      date: appointment.date,
      endTime: appointment.endTime,
      id: appointment.id,
      patientName: appointment.patient.user.name,
      patientWhatsapp: appointment.patient.user.whatsapp,
      serviceName: appointment.service.name,
      startTime: appointment.startTime,
      status: appointment.status,
    })) ?? [];
  const scheduleBlocks = agenda?.scheduleBlocks ?? [];
  const today = getTodayDate();
  const todayKey = formatDateKey(today);
  const weekDates = Array.from({ length: 7 }, (_, index) => addDays(today, index));
  const weekDateKeys = new Set(weekDates.map(formatDateKey));
  const todayAppointments = appointments.filter(
    (appointment) => formatDateKey(appointment.date) === todayKey,
  );
  const weekAppointments = appointments.filter((appointment) =>
    weekDateKeys.has(formatDateKey(appointment.date)),
  );
  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.CONFIRMED,
  );
  const requestedAppointments = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.REQUESTED,
  );

  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Agenda profissional
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Visualize seus próximos atendimentos.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Acompanhe consultas solicitadas e confirmadas, organizadas por dia,
              com bloqueios futuros destacados para planejamento da rotina.
            </p>
          </div>

          <div className="rounded-lg border border-[#b9e4f4] bg-light-blue p-4 text-sm font-semibold text-dark-blue lg:text-right">
            {appointments.length}{" "}
            {appointments.length === 1
              ? "item na agenda"
              : "itens na agenda"}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          description="Atendimentos solicitados ou confirmados para hoje."
          icon={<CalendarDays aria-hidden="true" className="size-5" />}
          label="Hoje"
          tone="blue"
          value={todayAppointments.length}
        />
        <SummaryCard
          description="Consultas confirmadas a partir de hoje."
          icon={<CalendarCheck aria-hidden="true" className="size-5" />}
          label="Confirmadas"
          tone="green"
          value={confirmedAppointments.length}
        />
        <SummaryCard
          description="Solicitações ainda aguardando avaliação."
          icon={<CalendarClock aria-hidden="true" className="size-5" />}
          label="Solicitadas"
          tone="amber"
          value={requestedAppointments.length}
        />
        <SummaryCard
          description="Bloqueios futuros cadastrados no perfil."
          icon={<ShieldAlert aria-hidden="true" className="size-5" />}
          label="Bloqueios"
          tone="gray"
          value={scheduleBlocks.length}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card padding="lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold text-primary-green">
                Próximos 7 dias
              </p>
              <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
                Agenda semanal
              </h3>
            </div>
            <ButtonLink
              className="w-full sm:w-auto"
              href="/dashboard/dentista/solicitacoes"
              variant="secondary"
            >
              Ver solicitações
            </ButtonLink>
          </div>

          <div className="mt-6 grid gap-3">
            {weekDates.map((date) => {
              const dateKey = formatDateKey(date);
              const dayAppointments = appointments.filter(
                (appointment) => formatDateKey(appointment.date) === dateKey,
              );
              const dayBlocks = scheduleBlocks.filter(
                (block) => formatDateKey(block.date) === dateKey,
              );
              const hasItems = dayAppointments.length > 0 || dayBlocks.length > 0;

              return (
                <div
                  className="rounded-lg border border-[#d9ebf2] bg-surface p-4"
                  key={dateKey}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-bold capitalize text-dark-blue">
                        {weekDayFormatter.format(date)}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-text">
                        {formatDate(date)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#d9ebf2] bg-white px-3 py-2 text-sm font-semibold text-dark-blue">
                      {dayAppointments.length} consulta
                      {dayAppointments.length === 1 ? "" : "s"}
                    </div>
                  </div>

                  {hasItems ? (
                    <div className="mt-4 grid gap-3">
                      {dayAppointments.map((appointment) => (
                        <AgendaAppointmentCard
                          appointment={appointment}
                          key={appointment.id}
                        />
                      ))}

                      {dayBlocks.map((block) => (
                        <div
                          className="rounded-lg border border-[#fde68a] bg-[#fffbeb] p-4"
                          key={block.id}
                        >
                          <div className="flex items-start gap-3">
                            <ShieldAlert
                              aria-hidden="true"
                              className="mt-0.5 size-5 shrink-0 text-[#92400e]"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[#92400e]">
                                Bloqueio de agenda
                              </p>
                              <p className="mt-1 text-sm leading-6 text-gray-text">
                                {block.startTime} às {block.endTime}
                              </p>
                              <p className="mt-2 break-words text-sm leading-6 text-gray-text">
                                {block.reason}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 rounded-lg border border-dashed border-[#b9e4f4] bg-light-blue/60 p-4 text-sm leading-6 text-gray-text">
                      Nenhum atendimento ou bloqueio cadastrado para este dia.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card padding="lg">
            <p className="text-sm font-bold text-primary-green">
              Visão rápida
            </p>
            <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
              {agenda?.specialty ?? "Agenda clínica"}
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-text">
              A agenda considera consultas solicitadas e confirmadas. Consultas
              recusadas, canceladas ou concluídas ficam fora desta visão de
              trabalho.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="flex items-start gap-3 rounded-lg border border-[#d9ebf2] bg-surface p-4">
                <CalendarRange
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-primary-blue"
                />
                <div>
                  <p className="text-xs font-bold text-dark-blue">
                    Atendimentos na semana
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-text">
                    {weekAppointments.length}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-[#d9ebf2] bg-surface p-4">
                <Clock
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-primary-green"
                />
                <div>
                  <p className="text-xs font-bold text-dark-blue">
                    Próximo atendimento
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-text">
                    {appointments[0]
                      ? `${formatDate(appointments[0].date)} às ${
                          appointments[0].startTime
                        }`
                      : "Nenhum atendimento futuro encontrado"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <p className="text-sm font-bold text-primary-green">
              Próximos bloqueios
            </p>
            <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
              Exceções da agenda
            </h3>

            {scheduleBlocks.length > 0 ? (
              <div className="mt-6 grid gap-3">
                {scheduleBlocks.slice(0, 4).map((block) => (
                  <div
                    className="rounded-lg border border-[#d9ebf2] bg-surface p-4"
                    key={block.id}
                  >
                    <p className="text-sm font-bold text-dark-blue">
                      {formatDate(block.date)}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-gray-text">
                      {block.startTime} às {block.endTime}
                    </p>
                    <p className="mt-2 break-words text-sm leading-6 text-gray-text">
                      {block.reason}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-dashed border-[#b7ead3] bg-light-green/60 p-6">
                <CheckCircle2
                  aria-hidden="true"
                  className="size-10 text-primary-green"
                />
                <p className="mt-4 text-base font-bold text-dark-blue">
                  Nenhum bloqueio futuro.
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-text">
                  Bloqueios cadastrados aparecerão nesta área de apoio.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Card padding="lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
              <History aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-base font-bold text-dark-blue">
                Organização da agenda
              </p>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-text">
                A visão semanal separa consultas e bloqueios para facilitar o
                planejamento da rotina clínica.
              </p>
            </div>
          </div>

          <ButtonLink
            className="w-full md:w-auto"
            href="/dashboard/dentista/historico"
            variant="secondary"
          >
            Ver histórico
          </ButtonLink>
        </div>
      </Card>
    </section>
  );
}

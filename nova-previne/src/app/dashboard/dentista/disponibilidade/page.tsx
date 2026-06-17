import {
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  Clock,
  Coffee,
  Hourglass,
  Info,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCurrentAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

import { AvailabilityForm } from "./availability-form";

export const metadata: Metadata = {
  title: "Disponibilidade do dentista | Nova Previne",
  description:
    "Visualização da disponibilidade profissional do dentista na Nova Previne.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SummaryCardProps = {
  description: string;
  icon: React.ReactNode;
  label: string;
  tone: "blue" | "green" | "amber" | "gray";
  value: string | number;
};

type AvailabilityFieldProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const weekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const summaryTones = {
  amber: "border-[#fde68a] bg-[#fffbeb] text-[#92400e]",
  blue: "border-[#b9e4f4] bg-light-blue text-primary-blue",
  gray: "border-[#e5e7eb] bg-gray-light text-gray-text",
  green: "border-[#b7ead3] bg-light-green text-primary-green",
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

function formatDuration(minutes?: number | null) {
  if (!minutes) {
    return "Não definido";
  }

  return `${minutes} min`;
}

function formatInterval(intervalStart?: string | null, intervalEnd?: string | null) {
  if (!intervalStart || !intervalEnd) {
    return "Sem intervalo cadastrado";
  }

  return `${intervalStart} às ${intervalEnd}`;
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

function AvailabilityField({ icon, label, value }: AvailabilityFieldProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[#d9ebf2] bg-surface p-4">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold text-dark-blue">{label}</p>
        <p className="mt-1 break-words text-sm leading-6 text-gray-text">
          {value}
        </p>
      </div>
    </div>
  );
}

async function getDentistAvailabilityData(userId: string) {
  try {
    return prisma.user.findUnique({
      select: {
        name: true,
        dentistProfile: {
          select: {
            active: true,
            availabilities: {
              orderBy: [
                {
                  weekDay: "asc",
                },
                {
                  startTime: "asc",
                },
              ],
              select: {
                active: true,
                appointmentDuration: true,
                endTime: true,
                id: true,
                intervalEnd: true,
                intervalStart: true,
                startTime: true,
                weekDay: true,
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
              take: 5,
              where: {
                date: {
                  gte: getTodayDate(),
                },
              },
            },
            specialty: true,
          },
        },
      },
      where: {
        id: userId,
      },
    });
  } catch {
    return null;
  }
}

export default async function DentistAvailabilityPage() {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?next=/dashboard/dentista/disponibilidade");
  }

  const dentist = await getDentistAvailabilityData(session.user.id);
  const profile = dentist?.dentistProfile ?? null;
  const availabilities = profile?.availabilities ?? [];
  const activeAvailabilities = availabilities.filter(
    (availability) => availability.active,
  );
  const inactiveAvailabilities = availabilities.filter(
    (availability) => !availability.active,
  );
  const activeDays = new Set(
    activeAvailabilities.map((availability) => availability.weekDay),
  ).size;
  const averageDuration =
    activeAvailabilities.length > 0
      ? Math.round(
          activeAvailabilities.reduce(
            (total, availability) => total + availability.appointmentDuration,
            0,
          ) / activeAvailabilities.length,
        )
      : null;
  const availabilitiesByDay = weekDays.map((day, weekDay) => ({
    day,
    periods: availabilities.filter(
      (availability) => availability.weekDay === weekDay,
    ),
  }));

  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Disponibilidade profissional
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Horários de atendimento cadastrados.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Consulte, cadastre e ajuste os dias e períodos disponíveis para
              atendimento na plataforma.
            </p>
          </div>

          <Badge variant={profile?.active === false ? "amber" : "green"}>
            {profile?.active === false
              ? "Perfil inativo"
              : "Gerenciamento de horários"}
          </Badge>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          description="Dias da semana com pelo menos um período ativo."
          icon={<CalendarDays aria-hidden="true" className="size-5" />}
          label="Dias ativos"
          tone="blue"
          value={activeDays}
        />
        <SummaryCard
          description="Períodos ativos cadastrados para atendimento."
          icon={<Clock aria-hidden="true" className="size-5" />}
          label="Períodos ativos"
          tone="green"
          value={activeAvailabilities.length}
        />
        <SummaryCard
          description="Duração média dos períodos ativos de consulta."
          icon={<Hourglass aria-hidden="true" className="size-5" />}
          label="Duração média"
          tone="amber"
          value={formatDuration(averageDuration)}
        />
        <SummaryCard
          description="Períodos desativados que não devem aparecer para pacientes."
          icon={<ShieldCheck aria-hidden="true" className="size-5" />}
          label="Inativos"
          tone="gray"
          value={inactiveAvailabilities.length}
        />
      </div>

      <AvailabilityForm mode="create" />

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card padding="lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold text-primary-green">
                Semana de atendimento
              </p>
              <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
                Grade semanal
              </h3>
            </div>
            <Badge variant="blue">{dentist?.name ?? session.user.name}</Badge>
          </div>

          <div className="mt-6 grid gap-3">
            {availabilitiesByDay.map(({ day, periods }) => (
              <div
                className="rounded-lg border border-[#d9ebf2] bg-surface p-4"
                key={day}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-bold text-dark-blue">{day}</p>
                    <p className="mt-1 text-sm leading-6 text-gray-text">
                      {periods.length > 0
                        ? `${periods.length} período${
                            periods.length === 1 ? "" : "s"
                          } cadastrado${periods.length === 1 ? "" : "s"}`
                        : "Sem período cadastrado"}
                    </p>
                  </div>
                  <Badge variant={periods.some((period) => period.active) ? "green" : "gray"}>
                    {periods.some((period) => period.active)
                      ? "Com atendimento"
                      : "Sem atendimento"}
                  </Badge>
                </div>

                {periods.length > 0 && (
                  <div className="mt-4 grid gap-3">
                    {periods.map((period) => (
                      <div
                        className="rounded-lg border border-[#d9ebf2] bg-white p-4"
                        key={period.id}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="break-words text-sm font-bold text-dark-blue">
                              {period.startTime} às {period.endTime}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-gray-text">
                              Consulta padrão de{" "}
                              {formatDuration(period.appointmentDuration)}
                            </p>
                          </div>
                          <Badge variant={period.active ? "green" : "amber"}>
                            {period.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <AvailabilityField
                            icon={<Coffee aria-hidden="true" className="size-5" />}
                            label="Intervalo"
                            value={formatInterval(
                              period.intervalStart,
                              period.intervalEnd,
                            )}
                          />
                          <AvailabilityField
                            icon={<Hourglass aria-hidden="true" className="size-5" />}
                            label="Duração por consulta"
                            value={formatDuration(period.appointmentDuration)}
                          />
                        </div>

                        <details className="mt-4 rounded-lg border border-[#d9ebf2] bg-surface p-3">
                          <summary className="cursor-pointer text-sm font-bold text-dark-blue transition hover:text-primary-blue">
                            Editar este período
                          </summary>
                          <div className="mt-4">
                            <AvailabilityForm
                              initialValues={{
                                active: period.active,
                                appointmentDuration: String(
                                  period.appointmentDuration,
                                ),
                                availabilityId: period.id,
                                endTime: period.endTime,
                                intervalEnd: period.intervalEnd ?? "",
                                intervalStart: period.intervalStart ?? "",
                                startTime: period.startTime,
                                weekDay: String(period.weekDay),
                              }}
                              mode="edit"
                              surface="panel"
                            />
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card padding="lg">
            <p className="text-sm font-bold text-primary-green">
              Perfil associado
            </p>
            <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
              {profile?.specialty ?? "Especialidade não informada"}
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-text">
              Esta disponibilidade pertence ao seu perfil profissional e será
              usada nas próximas etapas para orientar a agenda e as solicitações.
            </p>

            <div className="mt-6 grid gap-3">
              <AvailabilityField
                icon={<CalendarRange aria-hidden="true" className="size-5" />}
                label="Períodos cadastrados"
                value={`${availabilities.length}`}
              />
              <AvailabilityField
                icon={<CheckCircle2 aria-hidden="true" className="size-5" />}
                label="Períodos ativos"
                value={`${activeAvailabilities.length}`}
              />
            </div>
          </Card>

          <Card padding="lg">
            <p className="text-sm font-bold text-primary-green">
              Bloqueios futuros
            </p>
            <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
              Exceções cadastradas
            </h3>

            {(profile?.scheduleBlocks.length ?? 0) > 0 ? (
              <div className="mt-6 grid gap-3">
                {profile?.scheduleBlocks.map((block) => (
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
              <div className="mt-6 rounded-lg border border-dashed border-[#b9e4f4] bg-light-blue/60 p-6">
                <CalendarRange
                  aria-hidden="true"
                  className="size-10 text-primary-blue"
                />
                <p className="mt-4 text-base font-bold text-dark-blue">
                  Nenhum bloqueio futuro encontrado.
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-text">
                  Bloqueios de agenda aparecerão aqui quando forem cadastrados em
                  etapa própria.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Card padding="lg">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-green text-primary-green">
            <Info aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-base font-bold text-dark-blue">
              Gestão dos horários
            </p>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-text">
              Use esta área para manter seus períodos de atendimento claros e
              atualizados. Bloqueios específicos e consultas permanecem
              organizados nas telas próprias da agenda.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}

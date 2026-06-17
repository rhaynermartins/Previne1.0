import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { redirect } from "next/navigation";

import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserRole } from "@/generated/prisma/enums";
import { getCurrentAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  formatScheduleDate,
  getAvailableAppointmentSlots,
  getTodayScheduleDate,
  parseScheduleDate,
  type AvailableAppointmentSlot,
} from "@/services/availabilityService";

import { AppointmentRequestForm } from "./appointment-request-form";

export const metadata: Metadata = {
  title: "Agendamento do paciente | Nova Previne",
  description:
    "Fluxo de solicitação de consulta do paciente na Clínica Odontológica Nova Previne.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type SchedulingPageProps = {
  searchParams?: SearchParams;
};

type ServiceOption = {
  description: string;
  durationMinutes: number;
  id: string;
  name: string;
};

type DentistOption = {
  activeDays: number;
  bio?: string | null;
  cro: string;
  id: string;
  name: string;
  specialty: string;
};

const steps = [
  "Tratamento",
  "Dentista",
  "Data",
  "Horário",
  "Descrição",
  "Confirmação",
];

function getSingleParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = searchParams[key];

  return typeof value === "string" ? value : "";
}

function buildSchedulingHref(params: {
  date?: string;
  dentistId?: string;
  serviceId?: string;
  startTime?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params.serviceId) {
    searchParams.set("serviceId", params.serviceId);
  }

  if (params.dentistId) {
    searchParams.set("dentistId", params.dentistId);
  }

  if (params.date) {
    searchParams.set("date", params.date);
  }

  if (params.startTime) {
    searchParams.set("startTime", params.startTime);
  }

  const queryString = searchParams.toString();

  return queryString
    ? `/dashboard/paciente/agendamento?${queryString}`
    : "/dashboard/paciente/agendamento";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

function getCurrentStep({
  date,
  dentistId,
  serviceId,
  startTime,
}: {
  date: string;
  dentistId: string;
  serviceId: string;
  startTime: string;
}) {
  if (!serviceId) {
    return 1;
  }

  if (!dentistId) {
    return 2;
  }

  if (!date) {
    return 3;
  }

  if (!startTime) {
    return 4;
  }

  return 5;
}

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const completed = stepNumber < currentStep;
        const active = stepNumber === currentStep;

        return (
          <div
            className={
              active
                ? "rounded-lg border border-[#b9e4f4] bg-light-blue p-3 text-primary-blue"
                : completed
                  ? "rounded-lg border border-[#b7ead3] bg-light-green p-3 text-primary-green"
                  : "rounded-lg border border-[#e5edf3] bg-white p-3 text-gray-text"
            }
            key={step}
          >
            <div className="flex items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-current text-xs font-bold">
                {completed ? (
                  <CheckCircle2 aria-hidden="true" className="size-4" />
                ) : (
                  stepNumber
                )}
              </span>
              <span className="text-sm font-bold">{step}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SelectionSummary({
  date,
  dentist,
  service,
  slot,
}: {
  date?: Date | null;
  dentist?: DentistOption;
  service?: ServiceOption;
  slot?: AvailableAppointmentSlot;
}) {
  return (
    <Card padding="lg">
      <p className="text-sm font-bold text-primary-green">Resumo</p>
      <h3 className="mt-2 text-xl font-bold text-dark-blue">
        Solicitação em andamento
      </h3>
      <div className="mt-5 grid gap-3">
        <SummaryRow
          icon={<Stethoscope aria-hidden="true" className="size-5" />}
          label="Tratamento"
          value={service ? service.name : "Escolha um tratamento"}
        />
        <SummaryRow
          icon={<UserRound aria-hidden="true" className="size-5" />}
          label="Dentista"
          value={dentist ? `Dr(a). ${dentist.name}` : "Escolha um dentista"}
        />
        <SummaryRow
          icon={<CalendarDays aria-hidden="true" className="size-5" />}
          label="Data"
          value={date ? formatDate(date) : "Escolha uma data"}
        />
        <SummaryRow
          icon={<Clock aria-hidden="true" className="size-5" />}
          label="Horário"
          value={slot ? `${slot.startTime} às ${slot.endTime}` : "Escolha um horário"}
        />
      </div>
    </Card>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[#d9ebf2] bg-surface p-4">
      <span className="mt-0.5 shrink-0 text-primary-blue">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-bold text-dark-blue">{label}</p>
        <p className="mt-1 break-words text-sm leading-6 text-gray-text">
          {value}
        </p>
      </div>
    </div>
  );
}

async function getSchedulingOptions() {
  const [services, dentists] = await Promise.all([
    prisma.service.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        description: true,
        durationMinutes: true,
        id: true,
        name: true,
      },
      where: {
        active: true,
      },
    }),
    prisma.dentistProfile.findMany({
      orderBy: {
        user: {
          name: "asc",
        },
      },
      select: {
        availabilities: {
          select: {
            weekDay: true,
          },
          where: {
            active: true,
          },
        },
        bio: true,
        cro: true,
        id: true,
        specialty: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      where: {
        active: true,
      },
    }),
  ]);

  return {
    dentists: dentists.map((dentist) => ({
      activeDays: new Set(
        dentist.availabilities.map((availability) => availability.weekDay),
      ).size,
      bio: dentist.bio,
      cro: dentist.cro,
      id: dentist.id,
      name: dentist.user.name,
      specialty: dentist.specialty,
    })),
    services,
  };
}

export default async function PatientSchedulingPage({
  searchParams,
}: SchedulingPageProps) {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?next=/dashboard/paciente/agendamento");
  }

  if (session.user.role !== UserRole.PATIENT) {
    redirect("/dashboard");
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedServiceId = getSingleParam(resolvedSearchParams, "serviceId");
  const selectedDentistId = getSingleParam(resolvedSearchParams, "dentistId");
  const selectedDateValue = getSingleParam(resolvedSearchParams, "date");
  const selectedStartTime = getSingleParam(resolvedSearchParams, "startTime");
  const { dentists, services } = await getSchedulingOptions();
  const selectedService = services.find(
    (service) => service.id === selectedServiceId,
  );
  const selectedDentist = dentists.find(
    (dentist) => dentist.id === selectedDentistId,
  );
  const parsedDate = selectedDateValue
    ? parseScheduleDate(selectedDateValue)
    : null;
  const today = getTodayScheduleDate();
  const minDate = formatScheduleDate(today);
  const hasValidDate = Boolean(parsedDate && parsedDate >= today);
  const availability =
    selectedService && selectedDentist && parsedDate && hasValidDate
      ? await getAvailableAppointmentSlots({
          date: parsedDate,
          dentistId: selectedDentist.id,
          serviceId: selectedService.id,
        })
      : null;
  const slots = availability?.slots ?? [];
  const selectedSlot = slots.find((slot) => slot.startTime === selectedStartTime);
  const currentStep = getCurrentStep({
    date: hasValidDate ? selectedDateValue : "",
    dentistId: selectedDentist ? selectedDentist.id : "",
    serviceId: selectedService ? selectedService.id : "",
    startTime: selectedSlot ? selectedSlot.startTime : "",
  });

  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Novo agendamento
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Solicite sua consulta em poucos passos.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Escolha tratamento, dentista, data e horário disponível. A consulta
              será criada como solicitada e ficará aguardando confirmação do
              dentista.
            </p>
          </div>

          <span className="flex size-14 items-center justify-center rounded-lg bg-light-green text-primary-green">
            <CalendarCheck aria-hidden="true" className="size-7" />
          </span>
        </div>

        <div className="mt-6 border-t border-[#edf4f8] pt-5">
          <Stepper currentStep={currentStep} />
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-5">
          <Card padding="lg">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
                <Stethoscope aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-primary-green">
                  Etapa 1
                </p>
                <h3 className="mt-1 text-xl font-bold text-dark-blue">
                  Escolha o tratamento
                </h3>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {services.map((service) => {
                const selected = service.id === selectedService?.id;

                return (
                  <ButtonLink
                    className={
                      selected
                        ? "h-full justify-start border-primary-green bg-light-green text-left text-primary-green"
                        : "h-full justify-start text-left"
                    }
                    href={buildSchedulingHref({
                      serviceId: service.id,
                    })}
                    key={service.id}
                    variant={selected ? "secondary" : "neutral"}
                  >
                    <span className="grid gap-1">
                      <span>{service.name}</span>
                      <span className="text-xs font-medium leading-5 text-gray-text">
                        {service.durationMinutes} min · {service.description}
                      </span>
                    </span>
                  </ButtonLink>
                );
              })}
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-green text-primary-green">
                <UserRound aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-primary-green">
                  Etapa 2
                </p>
                <h3 className="mt-1 text-xl font-bold text-dark-blue">
                  Escolha o dentista
                </h3>
              </div>
            </div>

            {selectedService ? (
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {dentists.map((dentist) => {
                  const selected = dentist.id === selectedDentist?.id;

                  return (
                    <ButtonLink
                      className={
                        selected
                          ? "h-full justify-start border-primary-blue bg-light-blue text-left text-primary-blue"
                          : "h-full justify-start text-left"
                      }
                      href={buildSchedulingHref({
                        dentistId: dentist.id,
                        serviceId: selectedService.id,
                      })}
                      key={dentist.id}
                      variant={selected ? "secondary" : "neutral"}
                    >
                      <span className="grid gap-1">
                        <span>Dr(a). {dentist.name}</span>
                        <span className="text-xs font-medium leading-5 text-gray-text">
                          {dentist.specialty} · {dentist.cro} ·{" "}
                          {dentist.activeDays} dia
                          {dentist.activeDays === 1 ? "" : "s"} ativo
                          {dentist.activeDays === 1 ? "" : "s"}
                        </span>
                      </span>
                    </ButtonLink>
                  );
                })}
              </div>
            ) : (
              <EmptyStep message="Escolha um tratamento para visualizar dentistas ativos." />
            )}
          </Card>

          <Card padding="lg">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
                <CalendarDays aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-primary-green">
                  Etapa 3
                </p>
                <h3 className="mt-1 text-xl font-bold text-dark-blue">
                  Escolha a data
                </h3>
              </div>
            </div>

            {selectedService && selectedDentist ? (
              <form className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]" method="get">
                <input name="serviceId" type="hidden" value={selectedService.id} />
                <input name="dentistId" type="hidden" value={selectedDentist.id} />
                <Input
                  defaultValue={hasValidDate ? selectedDateValue : ""}
                  error={
                    selectedDateValue && !hasValidDate
                      ? "Escolha uma data a partir de hoje."
                      : undefined
                  }
                  label="Data da consulta"
                  min={minDate}
                  name="date"
                  required
                  type="date"
                />
                <Button
                  className="self-end"
                  icon={<ArrowRight aria-hidden="true" className="size-4" />}
                  type="submit"
                  variant="primary"
                >
                  Ver horários
                </Button>
              </form>
            ) : (
              <EmptyStep message="Escolha tratamento e dentista para selecionar uma data." />
            )}
          </Card>

          <Card padding="lg">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-green text-primary-green">
                <Clock aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-primary-green">
                  Etapa 4
                </p>
                <h3 className="mt-1 text-xl font-bold text-dark-blue">
                  Escolha o horário disponível
                </h3>
              </div>
            </div>

            {selectedService && selectedDentist && parsedDate && hasValidDate ? (
              slots.length > 0 ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {slots.map((slot) => {
                    const selected = slot.startTime === selectedSlot?.startTime;

                    return (
                      <ButtonLink
                        className={
                          selected
                            ? "border-primary-green bg-light-green text-primary-green"
                            : ""
                        }
                        href={buildSchedulingHref({
                          date: selectedDateValue,
                          dentistId: selectedDentist.id,
                          serviceId: selectedService.id,
                          startTime: slot.startTime,
                        })}
                        key={`${slot.startTime}-${slot.endTime}`}
                        variant={selected ? "secondary" : "neutral"}
                      >
                        {slot.startTime} às {slot.endTime}
                      </ButtonLink>
                    );
                  })}
                </div>
              ) : (
                <EmptyStep message="Nenhum horário disponível para esta data. Tente outro dia dentro da disponibilidade do dentista." />
              )
            ) : (
              <EmptyStep message="Escolha uma data válida para carregar os horários disponíveis." />
            )}
          </Card>

          <Card padding="lg">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
                <FileText aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-primary-green">
                  Etapas 5 e 6
                </p>
                <h3 className="mt-1 text-xl font-bold text-dark-blue">
                  Descreva seu caso e confirme
                </h3>
              </div>
            </div>

            {selectedService && selectedDentist && parsedDate && selectedSlot ? (
              <div className="mt-6">
                <AppointmentRequestForm
                  initialValues={{
                    caseDescription: "",
                    date: selectedDateValue,
                    dentistId: selectedDentist.id,
                    serviceId: selectedService.id,
                    startTime: selectedSlot.startTime,
                  }}
                />
              </div>
            ) : (
              <EmptyStep message="Complete as etapas anteriores para enviar a solicitação ao dentista." />
            )}
          </Card>
        </div>

        <aside className="grid h-fit gap-5 xl:sticky xl:top-28">
          <SelectionSummary
            date={hasValidDate ? parsedDate : null}
            dentist={selectedDentist}
            service={selectedService}
            slot={selectedSlot}
          />

          <Card padding="lg">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-green text-primary-green">
                <ShieldCheck aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-base font-bold text-dark-blue">
                  Regras do agendamento
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-text">
                  Apenas serviços e dentistas ativos aparecem no fluxo. Horários
                  com consulta ou bloqueio não são exibidos como disponíveis.
                </p>
              </div>
            </div>
          </Card>

          {(selectedService || selectedDentist || selectedDateValue) && (
            <ButtonLink
              className="w-full"
              href="/dashboard/paciente/agendamento"
              icon={<ArrowLeft aria-hidden="true" className="size-4" />}
              variant="secondary"
            >
              Recomeçar escolha
            </ButtonLink>
          )}
        </aside>
      </div>
    </section>
  );
}

function EmptyStep({ message }: { message: string }) {
  return (
    <div className="mt-6 rounded-lg border border-dashed border-[#b9e4f4] bg-light-blue/60 p-5">
      <p className="text-sm font-semibold leading-6 text-gray-text">{message}</p>
    </div>
  );
}

import {
  CalendarClock,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  ClipboardList,
  Mail,
  Phone,
  PlusCircle,
  UserRound,
} from "lucide-react";
import { redirect } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card } from "@/components/ui/card";
import { AppointmentStatus } from "@/generated/prisma/enums";
import { getCurrentAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const nextSteps = [
  "Acompanhe a próxima consulta em destaque.",
  "Confira os contatos cadastrados para atendimento.",
  "Mantenha sua conta ativa para receber atualizações da clínica.",
];

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

function getFirstName(name: string) {
  return name.split(" ").filter(Boolean)[0] ?? name;
}

function formatContactValue(value?: string | null) {
  return value?.trim() ? value : "Não informado";
}

function formatDate(date?: Date | null) {
  if (!date) {
    return "Não informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
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

async function getPatientDashboardData(userId: string) {
  try {
    return prisma.user.findUnique({
      select: {
        email: true,
        name: true,
        patientProfile: {
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
                dentist: {
                  select: {
                    specialty: true,
                    user: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
                endTime: true,
                service: {
                  select: {
                    name: true,
                  },
                },
                startTime: true,
                status: true,
              },
            },
            birthDate: true,
            emergencyContact: true,
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

export default async function PatientDashboardPage() {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?next=/dashboard/paciente");
  }

  const patient = await getPatientDashboardData(session.user.id);
  const displayUser = {
    birthDate: patient?.patientProfile?.birthDate ?? null,
    email: patient?.email ?? session.user.email,
    emergencyContact: patient?.patientProfile?.emergencyContact ?? null,
    name: patient?.name ?? session.user.name,
    phone: patient?.phone ?? null,
    whatsapp: patient?.whatsapp ?? null,
  };
  const today = getTodayDate();
  const appointments = patient?.patientProfile?.appointments ?? [];
  const nextAppointment = appointments.find(
    (appointment) =>
      appointment.date >= today && appointment.status !== AppointmentStatus.COMPLETED,
  );
  const requestedCount = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.REQUESTED,
  ).length;
  const confirmedFutureCount = appointments.filter(
    (appointment) =>
      appointment.status === AppointmentStatus.CONFIRMED &&
      appointment.date >= today,
  ).length;
  const historyCount = appointments.filter(
    (appointment) =>
      appointment.status === AppointmentStatus.COMPLETED ||
      appointment.date < today,
  ).length;
  const totalAppointments = appointments.length;

  return (
    <section className="grid gap-5">
      <Card className="overflow-hidden" padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Dashboard do paciente
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Bom ter você aqui, {getFirstName(displayUser.name)}.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Este é o ponto de partida para acompanhar seus dados e atendimentos
              na Nova Previne.
            </p>
          </div>

          <div className="rounded-lg border border-[#b7ead3] bg-light-green p-4 text-sm font-semibold text-[#006b3d]">
            Sessão de paciente ativa
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-[#edf4f8] pt-5 sm:flex-row">
          <ButtonLink
            className="w-full sm:w-auto"
            href="/dashboard/paciente/agendamento"
            icon={<PlusCircle aria-hidden="true" className="size-5" />}
            size="lg"
            variant="success"
          >
            Novo agendamento
          </ButtonLink>
          <ButtonLink
            className="w-full sm:w-auto"
            href="/dashboard/paciente/consultas"
            icon={<CalendarDays aria-hidden="true" className="size-5" />}
            size="lg"
            variant="secondary"
          >
            Ver consultas
          </ButtonLink>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          description="Consultas aguardando confirmação da clínica ou do dentista."
          icon={<CalendarClock aria-hidden="true" className="size-5" />}
          label="Solicitadas"
          tone="amber"
          value={requestedCount}
        />
        <SummaryCard
          description="Próximos atendimentos já confirmados no seu perfil."
          icon={<CalendarCheck aria-hidden="true" className="size-5" />}
          label="Confirmadas"
          tone="green"
          value={confirmedFutureCount}
        />
        <SummaryCard
          description="Registros passados ou concluídos guardados no histórico."
          icon={<ClipboardList aria-hidden="true" className="size-5" />}
          label="Histórico"
          tone="blue"
          value={historyCount}
        />
        <SummaryCard
          description="Total de consultas vinculadas ao seu cadastro de paciente."
          icon={<CheckCircle2 aria-hidden="true" className="size-5" />}
          label="Total"
          tone="gray"
          value={totalAppointments}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card padding="lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold text-primary-green">
                Próxima consulta
              </p>
              <h3 className="mt-2 break-words text-xl font-bold text-dark-blue sm:text-2xl">
                {nextAppointment
                  ? nextAppointment.service.name
                  : "Nenhuma consulta futura encontrada"}
              </h3>
            </div>
            {nextAppointment && <StatusBadge status={nextAppointment.status} />}
          </div>

          {nextAppointment ? (
            <div className="mt-6 grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
                  <div className="flex items-start gap-3">
                    <CalendarDays
                      aria-hidden="true"
                      className="mt-0.5 size-5 text-primary-blue"
                    />
                    <div>
                      <p className="text-xs font-bold text-dark-blue">Data</p>
                      <p className="mt-1 text-sm leading-6 text-gray-text">
                        {formatDate(nextAppointment.date)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
                  <div className="flex items-start gap-3">
                    <Clock
                      aria-hidden="true"
                      className="mt-0.5 size-5 text-primary-green"
                    />
                    <div>
                      <p className="text-xs font-bold text-dark-blue">Horário</p>
                      <p className="mt-1 text-sm leading-6 text-gray-text">
                        {nextAppointment.startTime} às {nextAppointment.endTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[#d9ebf2] bg-white p-4">
                <p className="text-sm font-bold text-dark-blue">
                  Dr(a). {nextAppointment.dentist.user.name}
                </p>
                <p className="mt-1 text-sm text-gray-text">
                  {nextAppointment.dentist.specialty}
                </p>
                <p className="mt-4 text-sm leading-6 text-gray-text">
                  {nextAppointment.caseDescription}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-dashed border-[#b9e4f4] bg-light-blue/60 p-6">
              <CalendarClock
                aria-hidden="true"
                className="size-10 text-primary-blue"
              />
              <p className="mt-4 text-base font-bold text-dark-blue">
                Você ainda não possui consulta futura em destaque.
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-text">
                Quando uma solicitação ou confirmação de atendimento existir, ela
                aparecerá nesta área.
              </p>
              <ButtonLink
                className="mt-5 w-full sm:w-auto"
                href="/dashboard/paciente/agendamento"
                icon={<PlusCircle aria-hidden="true" className="size-4" />}
                variant="success"
              >
                Iniciar novo agendamento
              </ButtonLink>
            </div>
          )}
        </Card>

        <Card padding="lg">
          <p className="text-sm font-bold text-primary-green">Dados básicos</p>
          <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
            Contato do paciente
          </h3>

          <div className="mt-6 grid gap-3">
            <div className="flex items-start gap-3 rounded-lg border border-[#d9ebf2] bg-surface p-4">
              <Mail
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-primary-blue"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-dark-blue">E-mail</p>
                <p className="mt-1 break-all text-sm text-gray-text">
                  {displayUser.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[#d9ebf2] bg-surface p-4">
              <Phone
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-primary-green"
              />
              <div>
                <p className="text-xs font-bold text-dark-blue">Telefone</p>
                <p className="mt-1 text-sm text-gray-text">
                  {formatContactValue(displayUser.phone)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[#d9ebf2] bg-surface p-4">
              <UserRound
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-primary-blue"
              />
              <div>
                <p className="text-xs font-bold text-dark-blue">Nascimento</p>
                <p className="mt-1 text-sm text-gray-text">
                  {formatDate(displayUser.birthDate)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card padding="lg">
        <p className="text-sm font-bold text-primary-green">Acompanhamento</p>
        <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
          Sua jornada na Nova Previne
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
          O painel centraliza as informações essenciais para que seu atendimento
          continue claro, organizado e fácil de acompanhar.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
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
    </section>
  );
}

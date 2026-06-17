import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock,
  ClipboardList,
  FileText,
  Mail,
  Phone,
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
  title: "Solicitações do dentista | Nova Previne",
  description:
    "Solicitações de consulta recebidas pelo dentista na Clínica Odontológica Nova Previne.",
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

type RequestCardProps = {
  request: {
    caseDescription: string;
    createdAt: Date;
    date: Date;
    endTime: string;
    id: string;
    patientEmail: string;
    patientName: string;
    patientPhone?: string | null;
    patientWhatsapp?: string | null;
    serviceDuration: number;
    serviceName: string;
    startTime: string;
    status: AppointmentStatus;
  };
};

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

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
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

function RequestCard({ request }: RequestCardProps) {
  return (
    <Card padding="lg">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
            <Stethoscope aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-primary-green">
              Solicitação de consulta
            </p>
            <h3 className="mt-1 break-words text-xl font-bold text-dark-blue">
              {request.serviceName}
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-text">
              Recebida em {formatDateTime(request.createdAt)}
            </p>
          </div>
        </div>

        <div className="self-start">
          <StatusBadge status={request.status} />
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
              <p className="text-xs font-bold text-dark-blue">Data solicitada</p>
              <p className="mt-1 break-words text-sm leading-6 text-gray-text">
                {formatDate(request.date)}
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
                {request.startTime} às {request.endTime}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
          <div className="flex items-start gap-3">
            <ClipboardList
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary-blue"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-dark-blue">Duração</p>
              <p className="mt-1 text-sm leading-6 text-gray-text">
                {request.serviceDuration} min
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
          <div className="flex items-start gap-3">
            <UserRound
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary-green"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-dark-blue">Paciente</p>
              <p className="mt-1 break-words text-sm font-semibold leading-6 text-dark-blue">
                {request.patientName}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-3">
          <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
            <div className="flex items-start gap-3">
              <Mail
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-primary-blue"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-dark-blue">E-mail</p>
                <p className="mt-1 break-all text-sm leading-6 text-gray-text">
                  {request.patientEmail}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
            <div className="flex items-start gap-3">
              <Phone
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-primary-green"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-dark-blue">Contato</p>
                <p className="mt-1 break-words text-sm leading-6 text-gray-text">
                  WhatsApp:{" "}
                  {formatContactValue(
                    request.patientWhatsapp ?? request.patientPhone,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

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
                {request.caseDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DentistAppointmentActions
        appointmentId={request.id}
        status={request.status}
      />
    </Card>
  );
}

async function getDentistRequests(userId: string) {
  try {
    const dentistProfile = await prisma.dentistProfile.findUnique({
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
            createdAt: true,
            date: true,
            endTime: true,
            id: true,
            patient: {
              select: {
                user: {
                  select: {
                    email: true,
                    name: true,
                    phone: true,
                    whatsapp: true,
                  },
                },
              },
            },
            service: {
              select: {
                durationMinutes: true,
                name: true,
              },
            },
            startTime: true,
            status: true,
          },
          where: {
            status: AppointmentStatus.REQUESTED,
          },
        },
        specialty: true,
      },
      where: {
        userId,
      },
    });

    return dentistProfile;
  } catch {
    return null;
  }
}

export default async function DentistRequestsPage() {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?next=/dashboard/dentista/solicitacoes");
  }

  const dentistProfile = await getDentistRequests(session.user.id);
  const requests = dentistProfile?.appointments ?? [];
  const today = getTodayDate();
  const futureRequests = requests.filter((request) => request.date >= today);
  const overdueRequests = requests.filter((request) => request.date < today);
  const uniquePatients = new Set(
    requests.map((request) => request.patient.user.email),
  ).size;

  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Solicitações de consulta
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Avalie os pedidos enviados pelos pacientes.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Veja paciente, tratamento, data, horário e descrição prévia do
              caso. Aceite a consulta ou registre o motivo caso precise recusar.
            </p>
          </div>

          <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] p-4 text-sm font-semibold text-[#92400e] lg:text-right">
            {requests.length}{" "}
            {requests.length === 1
              ? "solicitação pendente"
              : "solicitações pendentes"}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          description="Pedidos com status solicitado aguardando avaliação."
          icon={<CalendarClock aria-hidden="true" className="size-5" />}
          label="Pendentes"
          tone="amber"
          value={requests.length}
        />
        <SummaryCard
          description="Solicitações com data a partir de hoje."
          icon={<CalendarDays aria-hidden="true" className="size-5" />}
          label="Futuras"
          tone="blue"
          value={futureRequests.length}
        />
        <SummaryCard
          description="Pacientes únicos com solicitações pendentes."
          icon={<UserRound aria-hidden="true" className="size-5" />}
          label="Pacientes"
          tone="green"
          value={uniquePatients}
        />
        <SummaryCard
          description="Pedidos pendentes com data anterior a hoje."
          icon={<Clock aria-hidden="true" className="size-5" />}
          label="Atrasadas"
          tone="gray"
          value={overdueRequests.length}
        />
      </div>

      {requests.length > 0 ? (
        <div className="grid gap-4">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={{
                caseDescription: request.caseDescription,
                createdAt: request.createdAt,
                date: request.date,
                endTime: request.endTime,
                id: request.id,
                patientEmail: request.patient.user.email,
                patientName: request.patient.user.name,
                patientPhone: request.patient.user.phone,
                patientWhatsapp: request.patient.user.whatsapp,
                serviceDuration: request.service.durationMinutes,
                serviceName: request.service.name,
                startTime: request.startTime,
                status: request.status,
              }}
            />
          ))}
        </div>
      ) : (
        <Card padding="lg">
          <div className="rounded-lg border border-dashed border-[#b7ead3] bg-light-green/60 p-6">
            <CheckCircle2
              aria-hidden="true"
              className="size-10 text-primary-green"
            />
            <h3 className="mt-4 text-xl font-bold text-dark-blue">
              Nenhuma solicitação pendente.
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-text">
              Quando um paciente solicitar uma consulta com você, o pedido será
              exibido aqui com os dados necessários para análise inicial.
            </p>
          </div>
        </Card>
      )}

      <Card padding="lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
              <ClipboardList aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-base font-bold text-dark-blue">
                Acompanhamento das solicitações
              </p>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-text">
                Cada solicitação reúne os dados essenciais para análise inicial
                do caso antes da confirmação do atendimento.
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
    </section>
  );
}

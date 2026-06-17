import { CalendarDays, Clock, Stethoscope, UserRound } from "lucide-react";
import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { AppointmentStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Consultas | Administração Nova Previne",
  description:
    "Visualização administrativa de consultas da Clínica Odontológica Nova Previne.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const statusOrder = [
  AppointmentStatus.REQUESTED,
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.REFUSED,
  AppointmentStatus.CANCELLED,
  AppointmentStatus.COMPLETED,
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

async function getAppointments() {
  return prisma.appointment.findMany({
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
      id: true,
      patient: {
        select: {
          user: {
            select: {
              email: true,
              name: true,
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
  });
}

export default async function AdminAppointmentsPage() {
  const appointments = await getAppointments();
  const countsByStatus = new Map(
    statusOrder.map((status) => [
      status,
      appointments.filter((appointment) => appointment.status === status).length,
    ]),
  );

  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Gestão de consultas
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Visualize a operação de agendamentos.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Acompanhe paciente, dentista, tratamento, horário, status e
              descrição do caso.
            </p>
          </div>

          <div className="rounded-lg border border-[#b9e4f4] bg-light-blue p-4 text-sm font-semibold text-dark-blue lg:text-right">
            {appointments.length} consultas
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {statusOrder.map((status) => (
          <Card key={status}>
            <StatusBadge status={status} />
            <p className="mt-4 text-3xl font-bold text-dark-blue">
              {countsByStatus.get(status) ?? 0}
            </p>
          </Card>
        ))}
      </div>

      {appointments.length > 0 ? (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} padding="lg">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
                  <CalendarDays aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="break-words text-xl font-bold text-dark-blue">
                    {appointment.service.name}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-text">
                    {formatDate(appointment.date)}, das {appointment.startTime}{" "}
                    às {appointment.endTime}
                  </p>
                </div>
              </div>
              <StatusBadge status={appointment.status} />
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
                <UserRound
                  aria-hidden="true"
                  className="size-5 text-primary-blue"
                />
                <p className="mt-3 text-xs font-bold text-dark-blue">
                  Paciente
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-dark-blue">
                  {appointment.patient.user.name}
                </p>
                <p className="break-all text-sm text-gray-text">
                  {appointment.patient.user.email}
                </p>
              </div>
              <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
                <Stethoscope
                  aria-hidden="true"
                  className="size-5 text-primary-green"
                />
                <p className="mt-3 text-xs font-bold text-dark-blue">
                  Dentista
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-dark-blue">
                  Dr(a). {appointment.dentist.user.name}
                </p>
                <p className="break-words text-sm text-gray-text">
                  {appointment.dentist.specialty}
                </p>
              </div>
              <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
                <Clock
                  aria-hidden="true"
                  className="size-5 text-primary-blue"
                />
                <p className="mt-3 text-xs font-bold text-dark-blue">Horário</p>
                <p className="mt-1 text-sm text-gray-text">
                  {appointment.startTime} às {appointment.endTime}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-[#d9ebf2] bg-white p-4">
              <p className="text-xs font-bold text-dark-blue">
                Descrição do caso
              </p>
              <p className="mt-2 break-words text-sm leading-6 text-gray-text">
                {appointment.caseDescription}
              </p>
            </div>

            {appointment.refusalReason?.trim() && (
              <div className="mt-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4">
                <p className="text-xs font-bold text-[#991b1b]">
                  Motivo da recusa
                </p>
                <p className="mt-2 break-words text-sm leading-6 text-gray-text">
                  {appointment.refusalReason}
                </p>
              </div>
            )}
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="lg">
          <EmptyState
            description="Assim que pacientes solicitarem consultas, os registros aparecerão nesta visão administrativa."
            icon={<CalendarDays aria-hidden="true" className="size-6" />}
            title="Nenhuma consulta registrada."
          />
        </Card>
      )}
    </section>
  );
}

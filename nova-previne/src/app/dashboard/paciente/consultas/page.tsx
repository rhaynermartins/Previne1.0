import type { Metadata } from "next";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  PlusCircle,
} from "lucide-react";
import { redirect } from "next/navigation";

import { AppointmentCard } from "@/components/dashboard/appointment-card";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppointmentStatus } from "@/generated/prisma/enums";
import { getCurrentAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Consultas do paciente | Nova Previne",
  description:
    "Listagem das consultas futuras e em acompanhamento do paciente na Clínica Odontológica Nova Previne.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PatientAppointmentsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const activeAppointmentStatuses = [
  AppointmentStatus.REQUESTED,
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.REFUSED,
  AppointmentStatus.CANCELLED,
];

function getTodayDate() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
}

async function getPatientAppointments(userId: string) {
  try {
    const patientProfile = await prisma.patientProfile.findUnique({
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
            id: true,
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
              in: activeAppointmentStatuses,
            },
          },
        },
      },
      where: {
        userId,
      },
    });

    return patientProfile?.appointments ?? [];
  } catch {
    return [];
  }
}

function getSingleParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = searchParams[key];

  return typeof value === "string" ? value : "";
}

export default async function PatientAppointmentsPage({
  searchParams,
}: PatientAppointmentsPageProps) {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?next=/dashboard/paciente/consultas");
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const schedulingSuccess =
    getSingleParam(resolvedSearchParams, "agendamento") === "sucesso";
  const appointments = await getPatientAppointments(session.user.id);

  return (
    <section className="grid gap-5">
      {schedulingSuccess && (
        <Card padding="lg">
          <div
            className="flex items-start gap-3 rounded-lg border border-[#b7ead3] bg-light-green p-4"
            role="status"
          >
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary-green"
            />
            <div>
              <p className="font-bold text-dark-blue">
                Sua consulta foi solicitada com sucesso.
              </p>
              <p className="mt-1 text-sm leading-6 text-gray-text">
                O dentista ainda precisa confirmar este horário. A solicitação já
                aparece abaixo com status solicitado.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Consultas do paciente
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Acompanhe suas consultas futuras e solicitações.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Veja os atendimentos vinculados ao seu perfil, com dentista, data,
              horário, tratamento e status atual.
            </p>
          </div>

          <div className="rounded-lg border border-[#b9e4f4] bg-light-blue p-4 text-sm font-semibold text-dark-blue lg:text-right">
            {appointments.length}{" "}
            {appointments.length === 1 ? "consulta encontrada" : "consultas encontradas"}
          </div>
        </div>
        <div className="mt-6 border-t border-[#edf4f8] pt-5">
          <ButtonLink
            className="w-full sm:w-auto"
            href="/dashboard/paciente/agendamento"
            icon={<PlusCircle aria-hidden="true" className="size-5" />}
            size="lg"
            variant="success"
          >
            Novo agendamento
          </ButtonLink>
        </div>
      </Card>

      {appointments.length > 0 ? (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              appointment={{
                caseDescription: appointment.caseDescription,
                date: appointment.date,
                dentistName: appointment.dentist.user.name,
                dentistSpecialty: appointment.dentist.specialty,
                endTime: appointment.endTime,
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
          <div className="rounded-lg border border-dashed border-[#b9e4f4] bg-light-blue/60 p-6">
            <CalendarClock
              aria-hidden="true"
              className="size-10 text-primary-blue"
            />
            <h3 className="mt-4 text-xl font-bold text-dark-blue">
              Nenhuma consulta futura encontrada.
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-text">
              Quando houver uma consulta solicitada, confirmada, recusada ou
              cancelada para uma data futura, ela aparecerá nesta listagem.
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
        </Card>
      )}

      <Card className="flex items-start gap-4" padding="lg">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-green text-primary-green">
          <ClipboardList aria-hidden="true" className="size-5" />
        </span>
        <div>
          <p className="text-base font-bold text-dark-blue">
            Histórico em etapa separada
          </p>
          <p className="mt-1 text-sm leading-6 text-gray-text">
            Consultas concluídas ou atendimentos passados serão organizados no
            histórico do paciente.
          </p>
        </div>
      </Card>
    </section>
  );
}

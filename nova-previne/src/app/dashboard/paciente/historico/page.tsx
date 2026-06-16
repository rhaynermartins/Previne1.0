import type { Metadata } from "next";
import { Archive, CalendarClock, History } from "lucide-react";
import { redirect } from "next/navigation";

import { AppointmentCard } from "@/components/dashboard/appointment-card";
import { Card } from "@/components/ui/card";
import { AppointmentStatus } from "@/generated/prisma/enums";
import { getCurrentAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Histórico do paciente | Nova Previne",
  description:
    "Histórico de consultas passadas e concluídas do paciente na Clínica Odontológica Nova Previne.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getTodayDate() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
}

async function getPatientAppointmentHistory(userId: string) {
  try {
    const patientProfile = await prisma.patientProfile.findUnique({
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
            OR: [
              {
                date: {
                  lt: getTodayDate(),
                },
              },
              {
                status: AppointmentStatus.COMPLETED,
              },
            ],
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

export default async function PatientAppointmentHistoryPage() {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?next=/dashboard/paciente/historico");
  }

  const appointments = await getPatientAppointmentHistory(session.user.id);

  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Histórico do paciente
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Consulte seus atendimentos anteriores.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Veja consultas passadas ou marcadas como concluídas, com serviço,
              dentista, data, horário e status registrado.
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
            <History aria-hidden="true" className="size-10 text-primary-blue" />
            <h3 className="mt-4 text-xl font-bold text-dark-blue">
              Nenhum histórico encontrado.
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-text">
              Quando você tiver consultas concluídas ou registros passados, eles
              aparecerão nesta área.
            </p>
          </div>
        </Card>
      )}

      <Card className="flex items-start gap-4" padding="lg">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
          <Archive aria-hidden="true" className="size-5" />
        </span>
        <div>
          <p className="text-base font-bold text-dark-blue">
            Organização do histórico
          </p>
          <p className="mt-1 text-sm leading-6 text-gray-text">
            Os registros ficam separados das consultas futuras para facilitar o
            acompanhamento da sua jornada de atendimento.
          </p>
        </div>
      </Card>

      <Card className="flex items-start gap-4" padding="lg">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-green text-primary-green">
          <CalendarClock aria-hidden="true" className="size-5" />
        </span>
        <div>
          <p className="text-base font-bold text-dark-blue">
            Consultas futuras continuam em outra tela
          </p>
          <p className="mt-1 text-sm leading-6 text-gray-text">
            Solicitações e próximos atendimentos permanecem na listagem de
            consultas do paciente.
          </p>
        </div>
      </Card>
    </section>
  );
}

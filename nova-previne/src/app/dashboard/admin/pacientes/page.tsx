import { CalendarDays, Mail, Phone, UserRound } from "lucide-react";
import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { UserRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Pacientes | Administração Nova Previne",
  description:
    "Listagem administrativa de pacientes cadastrados na Clínica Nova Previne.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function formatValue(value?: string | null) {
  return value?.trim() ? value : "Não informado";
}

async function getPatients() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      email: true,
      id: true,
      name: true,
      patientProfile: {
        select: {
          appointments: {
            select: {
              id: true,
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
      role: UserRole.PATIENT,
    },
  });
}

export default async function AdminPatientsPage() {
  const patients = await getPatients();

  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Gestão de pacientes
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Visualize os pacientes cadastrados.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Acompanhe dados básicos de contato e volume de consultas
              vinculadas a cada paciente.
            </p>
          </div>

          <div className="rounded-lg border border-[#b9e4f4] bg-light-blue p-4 text-sm font-semibold text-dark-blue lg:text-right">
            {patients.length} pacientes
          </div>
        </div>
      </Card>

      {patients.length > 0 ? (
        <div className="grid gap-4">
          {patients.map((patient) => (
            <Card key={patient.id} padding="lg">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
                    <UserRound aria-hidden="true" className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="break-words text-xl font-bold text-dark-blue">
                      {patient.name}
                    </h3>
                    <p className="mt-1 break-all text-sm leading-6 text-gray-text">
                      {patient.email}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border border-[#d9ebf2] bg-surface px-3 py-2 text-sm font-semibold text-dark-blue">
                  {patient.patientProfile?.appointments.length ?? 0} consultas
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
                  <Mail
                    aria-hidden="true"
                    className="size-5 text-primary-blue"
                  />
                  <p className="mt-3 text-xs font-bold text-dark-blue">E-mail</p>
                  <p className="mt-1 break-all text-sm text-gray-text">
                    {patient.email}
                  </p>
                </div>
                <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
                  <Phone
                    aria-hidden="true"
                    className="size-5 text-primary-green"
                  />
                  <p className="mt-3 text-xs font-bold text-dark-blue">
                    WhatsApp
                  </p>
                  <p className="mt-1 break-words text-sm text-gray-text">
                    {formatValue(patient.whatsapp ?? patient.phone)}
                  </p>
                </div>
                <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
                  <CalendarDays
                    aria-hidden="true"
                    className="size-5 text-primary-blue"
                  />
                  <p className="mt-3 text-xs font-bold text-dark-blue">
                    Emergência
                  </p>
                  <p className="mt-1 break-words text-sm text-gray-text">
                    {formatValue(patient.patientProfile?.emergencyContact)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="lg">
          <div className="rounded-lg border border-dashed border-[#b9e4f4] bg-light-blue/60 p-6">
            <UserRound aria-hidden="true" className="size-10 text-primary-blue" />
            <h3 className="mt-4 text-xl font-bold text-dark-blue">
              Nenhum paciente encontrado.
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-text">
              Pacientes cadastrados aparecerão nesta listagem administrativa.
            </p>
          </div>
        </Card>
      )}
    </section>
  );
}

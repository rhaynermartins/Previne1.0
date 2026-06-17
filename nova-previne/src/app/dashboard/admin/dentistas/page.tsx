import { CheckCircle2, Mail, Phone, Stethoscope, XCircle } from "lucide-react";
import type { Metadata } from "next";

import { toggleDentistActive } from "@/app/dashboard/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dentistas | Administração Nova Previne",
  description:
    "Gestão administrativa de dentistas da Clínica Odontológica Nova Previne.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function formatValue(value?: string | null) {
  return value?.trim() ? value : "Não informado";
}

async function getDentists() {
  return prisma.dentistProfile.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      active: true,
      appointments: {
        select: {
          id: true,
        },
      },
      cro: true,
      id: true,
      phone: true,
      specialty: true,
      user: {
        select: {
          email: true,
          name: true,
          phone: true,
          whatsapp: true,
        },
      },
    },
  });
}

export default async function AdminDentistsPage() {
  const dentists = await getDentists();

  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Gestão de dentistas
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Ative ou desative profissionais.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Dentistas inativos deixam de aparecer para agendamento, sem perder
              histórico ou dados profissionais.
            </p>
          </div>

          <div className="rounded-lg border border-[#b7ead3] bg-light-green p-4 text-sm font-semibold text-[#006b3d] lg:text-right">
            {dentists.filter((dentist) => dentist.active).length} ativos
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        {dentists.map((dentist) => (
          <Card key={dentist.id} padding="lg">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
                  <Stethoscope aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="break-words text-xl font-bold text-dark-blue">
                      Dr(a). {dentist.user.name}
                    </h3>
                    <Badge variant={dentist.active ? "green" : "gray"}>
                      {dentist.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-gray-text">
                    {dentist.specialty} - {dentist.cro}
                  </p>
                </div>
              </div>

              <form action={toggleDentistActive}>
                <input name="dentistId" type="hidden" value={dentist.id} />
                <input
                  name="active"
                  type="hidden"
                  value={dentist.active ? "false" : "true"}
                />
                <Button
                  className="w-full sm:w-auto"
                  icon={
                    dentist.active ? (
                      <XCircle aria-hidden="true" className="size-4" />
                    ) : (
                      <CheckCircle2 aria-hidden="true" className="size-4" />
                    )
                  }
                  type="submit"
                  variant={dentist.active ? "danger" : "success"}
                >
                  {dentist.active ? "Desativar" : "Ativar"}
                </Button>
              </form>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
                <Mail aria-hidden="true" className="size-5 text-primary-blue" />
                <p className="mt-3 text-xs font-bold text-dark-blue">E-mail</p>
                <p className="mt-1 break-all text-sm text-gray-text">
                  {dentist.user.email}
                </p>
              </div>
              <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
                <Phone
                  aria-hidden="true"
                  className="size-5 text-primary-green"
                />
                <p className="mt-3 text-xs font-bold text-dark-blue">Contato</p>
                <p className="mt-1 break-words text-sm text-gray-text">
                  {formatValue(
                    dentist.phone ?? dentist.user.whatsapp ?? dentist.user.phone,
                  )}
                </p>
              </div>
              <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
                <Stethoscope
                  aria-hidden="true"
                  className="size-5 text-primary-blue"
                />
                <p className="mt-3 text-xs font-bold text-dark-blue">
                  Consultas
                </p>
                <p className="mt-1 text-sm text-gray-text">
                  {dentist.appointments.length}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

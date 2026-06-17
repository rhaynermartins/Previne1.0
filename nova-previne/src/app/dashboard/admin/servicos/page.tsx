import { CheckCircle2, ClipboardList, Save, XCircle } from "lucide-react";
import type { Metadata } from "next";

import {
  createService,
  toggleServiceActive,
  updateService,
} from "@/app/dashboard/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Serviços | Administração Nova Previne",
  description:
    "Gestão administrativa de serviços odontológicos da Clínica Nova Previne.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getServices() {
  return prisma.service.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      active: true,
      appointments: {
        select: {
          id: true,
        },
      },
      description: true,
      durationMinutes: true,
      id: true,
      name: true,
    },
  });
}

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Gestão de serviços
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Mantenha tratamentos e durações atualizados.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Serviços ativos aparecem para pacientes nas páginas públicas e no
              fluxo de agendamento.
            </p>
          </div>

          <div className="rounded-lg border border-[#b9e4f4] bg-light-blue p-4 text-sm font-semibold text-dark-blue lg:text-right">
            {services.length} serviços
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-green text-primary-green">
            <ClipboardList aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-base font-bold text-dark-blue">
              Novo serviço odontológico
            </p>
            <p className="mt-1 text-sm leading-6 text-gray-text">
              Cadastre tratamentos que poderão ser escolhidos no agendamento.
            </p>
          </div>
        </div>

        <form action={createService} className="mt-6 grid gap-4 lg:grid-cols-4">
          <Input
            label="Nome"
            maxLength={80}
            name="name"
            placeholder="Ex.: Avaliação odontológica"
            required
          />
          <Input
            label="Duração"
            min={10}
            name="durationMinutes"
            placeholder="40"
            required
            type="number"
          />
          <div className="lg:col-span-2">
            <Textarea
              label="Descrição"
              maxLength={400}
              name="description"
              placeholder="Descreva o serviço de forma clara para o paciente."
              required
              rows={3}
            />
          </div>
          <div className="lg:col-span-4">
            <Button
              className="w-full sm:w-auto"
              icon={<CheckCircle2 aria-hidden="true" className="size-4" />}
              type="submit"
              variant="success"
            >
              Cadastrar serviço
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id} padding="lg">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="break-words text-xl font-bold text-dark-blue">
                    {service.name}
                  </h3>
                  <Badge variant={service.active ? "green" : "gray"}>
                    {service.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-text">
                  {service.durationMinutes} minutos -{" "}
                  {service.appointments.length} consultas vinculadas
                </p>
              </div>

              <form action={toggleServiceActive}>
                <input name="serviceId" type="hidden" value={service.id} />
                <input
                  name="active"
                  type="hidden"
                  value={service.active ? "false" : "true"}
                />
                <Button
                  className="w-full sm:w-auto"
                  icon={
                    service.active ? (
                      <XCircle aria-hidden="true" className="size-4" />
                    ) : (
                      <CheckCircle2 aria-hidden="true" className="size-4" />
                    )
                  }
                  type="submit"
                  variant={service.active ? "danger" : "success"}
                >
                  {service.active ? "Desativar" : "Ativar"}
                </Button>
              </form>
            </div>

            <form action={updateService} className="mt-6 grid gap-4 lg:grid-cols-4">
              <input name="serviceId" type="hidden" value={service.id} />
              <Input
                defaultValue={service.name}
                label="Nome"
                maxLength={80}
                name="name"
                required
              />
              <Input
                defaultValue={service.durationMinutes}
                label="Duração"
                min={10}
                name="durationMinutes"
                required
                type="number"
              />
              <div className="lg:col-span-2">
                <Textarea
                  defaultValue={service.description}
                  label="Descrição"
                  maxLength={400}
                  name="description"
                  required
                  rows={3}
                />
              </div>
              <div className="lg:col-span-4">
                <Button
                  className="w-full sm:w-auto"
                  icon={<Save aria-hidden="true" className="size-4" />}
                  type="submit"
                  variant="primary"
                >
                  Salvar alterações
                </Button>
              </div>
            </form>
          </Card>
        ))}
      </div>
    </section>
  );
}

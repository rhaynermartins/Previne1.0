import type { Metadata } from "next";
import { CalendarPlus, MessageCircle, Stethoscope } from "lucide-react";
import { redirect } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentAuthSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Novo agendamento | Nova Previne",
  description:
    "Atalho para novo agendamento do paciente na Clínica Odontológica Nova Previne.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function PatientSchedulingShortcutPage() {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?next=/dashboard/paciente/agendamento");
  }

  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Novo agendamento
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Atalho preparado para solicitar uma nova consulta.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              O fluxo completo de agendamento será implementado em etapa própria.
              Por enquanto, este espaço centraliza o acesso ao próximo passo do
              atendimento.
            </p>
          </div>

          <span className="flex size-14 items-center justify-center rounded-lg bg-light-green text-primary-green">
            <CalendarPlus aria-hidden="true" className="size-7" />
          </span>
        </div>
      </Card>

      <Card padding="lg">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
            <Stethoscope aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-base font-bold text-dark-blue sm:text-lg">
              Fluxo de agendamento reservado
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-text">
              A escolha de tratamento, dentista, data, horário e descrição do caso
              ainda não foi criada nesta task para manter o escopo da Fase 7.8.
            </p>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <p className="text-sm font-bold text-primary-green">
          Precisa falar com a clínica agora?
        </p>
        <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
          Use o contato direto da Nova Previne.
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
          Enquanto o fluxo completo não entra no sistema, a equipe pode orientar
          você sobre tratamentos e horários disponíveis.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            className="w-full sm:w-auto"
            href="/contato"
            icon={<MessageCircle aria-hidden="true" className="size-5" />}
            size="lg"
            variant="success"
          >
            Falar com a clínica
          </ButtonLink>
          <ButtonLink
            className="w-full sm:w-auto"
            href="/dashboard/paciente/consultas"
            size="lg"
            variant="secondary"
          >
            Ver minhas consultas
          </ButtonLink>
        </div>
      </Card>
    </section>
  );
}

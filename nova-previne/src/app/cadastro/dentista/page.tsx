import type { Metadata } from "next";
import {
  CalendarClock,
  ClipboardCheck,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";

import { DentistRegisterForm } from "./dentist-register-form";

export const metadata: Metadata = {
  title: "Cadastro de dentista | Nova Previne",
  description:
    "Crie seu cadastro profissional de dentista na Clínica Odontológica Nova Previne com CRO, especialidade e dados de contato.",
};

export const runtime = "nodejs";

const benefits = [
  {
    description:
      "O CRO e a especialidade ajudam a clínica a validar o perfil profissional.",
    icon: <GraduationCap aria-hidden="true" className="size-5" />,
    title: "Credenciais claras",
  },
  {
    description:
      "A bio profissional prepara uma apresentação consistente para pacientes.",
    icon: <ClipboardCheck aria-hidden="true" className="size-5" />,
    title: "Perfil organizado",
  },
  {
    description:
      "O cadastro fica pronto para os próximos recursos de agenda e solicitações.",
    icon: <CalendarClock aria-hidden="true" className="size-5" />,
    title: "Base para atendimento",
  },
];

export default function DentistRegisterPage() {
  return (
    <main>
      <section className="bg-white">
        <Container className="grid gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:py-20">
          <div className="lg:sticky lg:top-28">
            <Badge variant="blue">Cadastro de dentista</Badge>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-dark-blue sm:text-5xl">
              Cadastre seu perfil profissional para atender pela Nova Previne.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-text">
              Informe seus dados clínicos e de contato para que a plataforma prepare
              seu perfil de dentista com segurança, organização e padrão profissional.
            </p>

            <div className="mt-8 grid gap-4">
              {benefits.map((benefit) => (
                <Card className="flex items-start gap-4" key={benefit.title}>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-green text-primary-green">
                    {benefit.icon}
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-dark-blue">
                      {benefit.title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-text">
                      {benefit.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <DentistRegisterForm />
        </Container>
      </section>

      <section className="border-t border-[#d9ebf2] bg-light-green/70 py-14">
        <Container className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <SectionTitle
            description="O cadastro profissional reúne as informações necessárias para associar dentistas, agenda e futuras solicitações de consulta."
            eyebrow="Perfil clínico"
            title="Dados profissionais bem estruturados desde o início."
          />
          <Card className="flex items-start gap-4" padding="lg">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white text-primary-blue">
              <ShieldCheck aria-hidden="true" className="size-6" />
            </span>
            <div>
              <p className="text-base leading-7 text-gray-text">
                O perfil criado pelo formulário fica inicialmente fora da exibição
                pública. Assim, a clínica mantém controle sobre quais profissionais
                aparecem para pacientes.
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary-green">
                <Sparkles aria-hidden="true" className="size-4" />
                Cadastro preparado para ativação administrativa futura.
              </p>
            </div>
          </Card>
        </Container>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import { HeartPulse, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";

import { PatientRegisterForm } from "./patient-register-form";

export const metadata: Metadata = {
  title: "Cadastro de paciente | Nova Previne",
  description:
    "Crie seu cadastro de paciente na Clínica Odontológica Nova Previne com dados básicos de contato e saúde.",
};

export const runtime = "nodejs";

const benefits = [
  {
    description: "Cadastro com senha criptografada e dados preparados para a área do paciente.",
    icon: <LockKeyhole aria-hidden="true" className="size-5" />,
    title: "Conta segura",
  },
  {
    description: "WhatsApp e contato de emergência ajudam a clínica a orientar próximos passos.",
    icon: <HeartPulse aria-hidden="true" className="size-5" />,
    title: "Contato organizado",
  },
  {
    description: "Observações iniciais apoiam um atendimento mais acolhedor desde o primeiro contato.",
    icon: <ShieldCheck aria-hidden="true" className="size-5" />,
    title: "Dados úteis",
  },
];

export default function PatientRegisterPage() {
  return (
    <main>
      <section className="bg-white">
        <Container className="grid gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:py-20">
          <div className="lg:sticky lg:top-28">
            <Badge variant="green">Cadastro de paciente</Badge>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-dark-blue sm:text-5xl">
              Crie sua conta para organizar seus atendimentos na Nova Previne.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-text">
              Informe seus dados básicos para que a clínica tenha um cadastro inicial
              seguro e pronto para acompanhar seu relacionamento com a Nova Previne.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/login" size="lg" variant="secondary">
                Já tenho conta
              </ButtonLink>
              <ButtonLink href="/cadastro" size="lg" variant="neutral">
                Ver opções de cadastro
              </ButtonLink>
            </div>

            <div className="mt-8 grid gap-4">
              {benefits.map((benefit) => (
                <Card className="flex items-start gap-4" key={benefit.title}>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
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

          <PatientRegisterForm />
        </Container>
      </section>

      <section className="border-t border-[#d9ebf2] bg-light-blue/60 py-14">
        <Container className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <SectionTitle
            description="O cadastro reúne informações essenciais para contato, identificação e preparação inicial do atendimento."
            eyebrow="Cuidado organizado"
            title="Uma base limpa para acompanhar seu sorriso."
          />
          <Card className="flex items-start gap-4" padding="lg">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white text-primary-green">
              <Sparkles aria-hidden="true" className="size-6" />
            </span>
            <p className="text-base leading-7 text-gray-text">
              Após enviar seus dados, a conta de paciente fica registrada com as
              informações necessárias para facilitar os próximos contatos com a clínica.
            </p>
          </Card>
        </Container>
      </section>
    </main>
  );
}

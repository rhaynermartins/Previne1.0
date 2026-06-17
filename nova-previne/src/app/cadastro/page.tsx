import type { Metadata } from "next";
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
  UserRoundPlus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";

export const metadata: Metadata = {
  title: "Cadastro | Nova Previne",
  description:
    "Escolha entre cadastro de paciente ou cadastro de dentista na plataforma da Clínica Odontológica Nova Previne.",
};

const registerOptions = [
  {
    description:
      "Crie sua conta para manter seus dados organizados e preparar o acesso à área do paciente.",
    href: "/cadastro/paciente",
    icon: <UserRoundPlus aria-hidden="true" className="size-7" />,
    label: "Sou paciente",
    title: "Cadastro de paciente",
    variant: "success" as const,
  },
  {
    description:
      "Informe CRO, especialidade e dados profissionais para preparar seu perfil clínico.",
    href: "/cadastro/dentista",
    icon: <Stethoscope aria-hidden="true" className="size-7" />,
    label: "Sou dentista",
    title: "Cadastro de dentista",
    variant: "primary" as const,
  },
];

const steps = [
  "Escolha o tipo de cadastro adequado ao seu perfil.",
  "Preencha os dados obrigatórios com atenção.",
  "Guarde seu e-mail e senha para acessar a plataforma.",
];

export default function RegisterPage() {
  return (
    <main>
      <section className="public-hero border-b border-[#d9ebf2]">
        <Container className="grid gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
          <div>
            <Badge variant="green">Cadastro Nova Previne</Badge>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-dark-blue text-balance sm:text-5xl">
              Escolha como você quer se cadastrar na plataforma.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-text">
              Pacientes e dentistas têm cadastros diferentes para manter os dados
              certos no lugar certo, com segurança e organização desde o primeiro
              acesso.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href="/login"
                icon={<ShieldCheck aria-hidden="true" className="size-5" />}
                size="lg"
                variant="secondary"
              >
                Já tenho conta
              </ButtonLink>
              <ButtonLink href="/contato" size="lg" variant="neutral">
                Falar com a clínica
              </ButtonLink>
            </div>
          </div>

          <div className="grid gap-5">
            {registerOptions.map((option) => (
              <Card interactive key={option.href} padding="lg">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
                    {option.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold text-dark-blue">
                      {option.title}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-gray-text">
                      {option.description}
                    </p>
                    <ButtonLink
                      className="mt-5 w-full sm:w-auto"
                      href={option.href}
                      icon={<ArrowRight aria-hidden="true" className="size-4" />}
                      iconPosition="right"
                      variant={option.variant}
                    >
                      {option.label}
                    </ButtonLink>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-[#d9ebf2] bg-light-green/70 py-14">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <SectionTitle
            description="O cadastro é simples e mantém cada perfil com as informações necessárias para os próximos fluxos da clínica."
            eyebrow="Como funciona"
            title="Uma entrada clara, sem misturar perfis."
          />
          <Card className="grid gap-4" padding="lg">
            {steps.map((step, index) => (
              <div className="flex items-start gap-4" key={step}>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-light-blue text-sm font-bold text-primary-blue">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-6 text-gray-text">{step}</p>
              </div>
            ))}
          </Card>
        </Container>
      </section>

      <section className="bg-white py-14">
        <Container>
          <Card className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between" padding="lg">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-light-green text-primary-green">
                <HeartHandshake aria-hidden="true" className="size-6" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-dark-blue">
                  Precisa de orientação antes de criar a conta?
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-text">
                  A equipe da Nova Previne pode ajudar a escolher o melhor caminho.
                </p>
              </div>
            </div>
            <ButtonLink href="/contato" variant="secondary">
              Entrar em contato
            </ButtonLink>
          </Card>
        </Container>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import {
  Award,
  Building2,
  CheckCircle2,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";

export const metadata: Metadata = {
  title: "Sobre a Clínica | Nova Previne",
  description:
    "Conheça a história, os valores e o compromisso da Clínica Odontológica Nova Previne com atendimento humanizado há 20 anos.",
};

const highlights = [
  { label: "20 anos", description: "de cuidado preventivo e odontologia humana" },
  { label: "Belo Horizonte", description: "atendimento próximo para famílias e pacientes" },
  { label: "Equipe clínica", description: "profissionais focados em clareza e confiança" },
  { label: "Prevenção", description: "orientação contínua para manter a saúde bucal" },
];

const values = [
  {
    icon: <HeartHandshake aria-hidden="true" className="size-5" />,
    title: "Missão",
    description:
      "Cuidar da saúde bucal com acolhimento, prevenção e orientação clara para cada paciente.",
  },
  {
    icon: <Sparkles aria-hidden="true" className="size-5" />,
    title: "Visão",
    description:
      "Ser reconhecida como uma clínica odontológica moderna, confiável e próxima das famílias.",
  },
  {
    icon: <ShieldCheck aria-hidden="true" className="size-5" />,
    title: "Valores",
    description:
      "Ética, respeito, transparência, organização e compromisso com a experiência do paciente.",
  },
];

const commitments = [
  "Explicações simples sobre cada etapa do tratamento.",
  "Atendimento preventivo com foco em saúde de longo prazo.",
  "Ambiente limpo, organizado e preparado para receber bem.",
  "Comunicação acolhedora antes, durante e depois da consulta.",
];

export default function AboutPage() {
  return (
    <main>
      <section className="overflow-hidden border-b border-[#d9ebf2] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfd_100%)]">
        <Container className="grid gap-12 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-20">
          <div>
            <Badge variant="green">Sobre a Nova Previne</Badge>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-dark-blue text-balance sm:text-5xl">
              Uma clínica odontológica construída sobre cuidado, confiança e
              prevenção.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-text">
              A Nova Previne atende pacientes com uma proposta simples e essencial:
              cuidar do sorriso com escuta, clareza e acompanhamento profissional.
              São 20 anos valorizando a prevenção e uma experiência odontológica
              mais tranquila.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contato" size="lg">
                Falar com a clínica
              </ButtonLink>
              <ButtonLink href="/tratamentos" size="lg" variant="secondary">
                Conhecer tratamentos
              </ButtonLink>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-lg border border-[#d9ebf2] bg-light-blue shadow-[0_24px_70px_rgba(0,59,111,0.14)]">
              <Image
                alt="Consultório odontológico moderno da Nova Previne"
                className="h-[340px] w-full object-cover sm:h-[440px] lg:h-[520px]"
                height={916}
                priority
                src="/images/nova-previne-clinic-hero.png"
                width={1717}
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/70 bg-white/95 p-4 shadow-[0_16px_38px_rgba(0,59,111,0.16)] backdrop-blur sm:left-auto sm:w-80">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-lg bg-light-green text-primary-green">
                  <Award aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-dark-blue">
                    20 anos de cuidado
                  </p>
                  <p className="text-sm text-gray-text">
                    História, prevenção e acolhimento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-[#d9ebf2] bg-light-blue/60">
        <Container className="grid gap-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <div className="min-h-24 rounded-lg bg-white/75 p-5" key={item.label}>
              <p className="text-2xl font-bold text-dark-blue">{item.label}</p>
              <p className="mt-1 text-sm font-medium text-gray-text">
                {item.description}
              </p>
            </div>
          ))}
        </Container>
      </section>

      <section className="bg-surface py-16 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionTitle
            description="A clínica evoluiu com a tecnologia e com as necessidades dos pacientes, mas manteve o mesmo princípio: atendimento próximo, preventivo e responsável."
            eyebrow="Nossa história"
            title="Duas décadas cuidando de pessoas antes de cuidar de sorrisos."
          />

          <Card padding="lg">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
                <Building2 aria-hidden="true" className="size-6" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-dark-blue">
                  Uma experiência clínica mais clara e acolhedora
                </h2>
                <p className="mt-4 text-base leading-7 text-gray-text">
                  A Nova Previne combina cuidado preventivo, estrutura organizada e
                  comunicação objetiva para que o paciente entenda suas opções e se
                  sinta seguro ao iniciar um tratamento odontológico.
                </p>
                <p className="mt-4 text-base leading-7 text-gray-text">
                  O atendimento valoriza a escuta, o planejamento e a continuidade do
                  cuidado, com uma identidade visual limpa e moderna que reflete a
                  confiança da clínica.
                </p>
              </div>
            </div>
          </Card>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <Container>
          <SectionTitle
            align="center"
            description="A base da Nova Previne é unir técnica, acolhimento e transparência em cada consulta."
            eyebrow="Missão, visão e valores"
            title="Princípios que guiam o atendimento."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <Card interactive key={value.title} padding="lg">
                <span className="flex size-11 items-center justify-center rounded-lg bg-light-green text-primary-green">
                  {value.icon}
                </span>
                <h2 className="mt-5 text-lg font-bold text-dark-blue">
                  {value.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-gray-text">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-light-green/60 py-16 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <SectionTitle
              description="A clínica prioriza uma jornada sem ruído, com informações importantes bem explicadas e foco no conforto do paciente."
              eyebrow="Atendimento humanizado"
              title="Cuidado profissional com linguagem simples."
            />
            <div className="mt-8 grid gap-3">
              {commitments.map((commitment) => (
                <div
                  className="flex items-start gap-3 rounded-lg border border-[#d9ebf2] bg-white/80 p-4"
                  key={commitment}
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-primary-green"
                  />
                  <p className="text-sm font-medium leading-6 text-gray-text">
                    {commitment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Card padding="lg">
            <span className="flex size-12 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
              <Stethoscope aria-hidden="true" className="size-6" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-dark-blue">
              Prevenção como parte da rotina
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-text">
              A Nova Previne incentiva consultas preventivas, acompanhamento
              contínuo e decisões tomadas com tranquilidade. O objetivo é cuidar da
              saúde bucal antes que pequenos desconfortos se tornem problemas
              maiores.
            </p>
            <ButtonLink className="mt-6 w-full sm:w-fit" href="/contato">
              Agendar avaliação
            </ButtonLink>
          </Card>
        </Container>
      </section>
    </main>
  );
}

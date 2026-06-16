import type { Metadata } from "next";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { connection } from "next/server";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tratamentos | Nova Previne",
  description:
    "Conheça os tratamentos odontológicos da Clínica Nova Previne, com foco em prevenção, estética e reabilitação oral.",
};

export const runtime = "nodejs";

type ServiceItem = {
  description: string;
  durationMinutes: number;
  id: string;
  name: string;
};

const fallbackServices: ServiceItem[] = [
  {
    description:
      "Consulta inicial para entender suas necessidades e indicar o melhor plano de cuidado.",
    durationMinutes: 40,
    id: "fallback-avaliacao",
    name: "Avaliação odontológica",
  },
  {
    description:
      "Profilaxia, orientação preventiva e acompanhamento para manter a saúde bucal em dia.",
    durationMinutes: 45,
    id: "fallback-prevencao",
    name: "Limpeza e prevenção",
  },
  {
    description:
      "Tratamentos para alinhamento dental e correção da mordida com planejamento profissional.",
    durationMinutes: 60,
    id: "fallback-ortodontia",
    name: "Ortodontia",
  },
];

const benefits = [
  {
    icon: <ShieldCheck aria-hidden="true" className="size-5" />,
    title: "Indicação com clareza",
    description:
      "Cada tratamento é explicado com linguagem simples, respeitando o momento e as dúvidas do paciente.",
  },
  {
    icon: <Stethoscope aria-hidden="true" className="size-5" />,
    title: "Foco preventivo",
    description:
      "O cuidado começa pela avaliação e pela prevenção, evitando intervenções maiores quando possível.",
  },
  {
    icon: <Sparkles aria-hidden="true" className="size-5" />,
    title: "Estética com segurança",
    description:
      "Procedimentos estéticos são orientados por critérios clínicos, conforto e saúde bucal.",
  },
];

async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        description: true,
        durationMinutes: true,
        id: true,
        name: true,
      },
      where: {
        active: true,
      },
    });

    return services.length > 0 ? services : fallbackServices;
  } catch {
    return fallbackServices;
  }
}

export default async function TreatmentsPage() {
  await connection();

  const services = await getServices();

  return (
    <main>
      <section className="bg-white">
        <Container className="py-14 lg:py-20">
          <div className="max-w-4xl">
            <Badge variant="green">Tratamentos Nova Previne</Badge>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-dark-blue sm:text-5xl">
              Cuidados odontológicos para prevenção, estética e reabilitação.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-text">
              A Nova Previne reúne tratamentos essenciais para cuidar da saúde bucal
              com planejamento, orientação clara e uma experiência acolhedora desde a
              primeira avaliação.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href="/#contato"
                icon={<CalendarCheck aria-hidden="true" className="size-5" />}
                size="lg"
              >
                Agendar avaliação
              </ButtonLink>
              <ButtonLink href="/dentistas" size="lg" variant="secondary">
                Conhecer dentistas
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-[#d9ebf2] bg-light-blue/60 py-12">
        <Container className="grid gap-5 md:grid-cols-3">
          {benefits.map((benefit) => (
            <Card interactive key={benefit.title} padding="lg">
              <span className="flex size-11 items-center justify-center rounded-lg bg-white text-primary-blue">
                {benefit.icon}
              </span>
              <h2 className="mt-5 text-lg font-bold text-dark-blue">
                {benefit.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-text">
                {benefit.description}
              </p>
            </Card>
          ))}
        </Container>
      </section>

      <section className="bg-surface py-16 lg:py-20">
        <Container>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              description="Todos os serviços listados aqui estão ativos para atendimento e aparecem com duração média para facilitar a orientação inicial."
              eyebrow="Serviços disponíveis"
              title="Escolha o cuidado ideal para o seu sorriso."
            />
            <Badge variant="blue">{services.length} tratamentos ativos</Badge>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <Card interactive key={service.id} padding="lg">
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-green text-primary-green">
                    <CheckCircle2 aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-dark-blue">
                      {service.name}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-gray-text">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 rounded-lg border border-[#d9ebf2] bg-white p-3 text-sm font-semibold text-primary-blue">
                  <Clock aria-hidden="true" className="size-4" />
                  <span>{service.durationMinutes} minutos em média</span>
                </div>
                <ButtonLink
                  className="mt-5 w-full"
                  href="/contato"
                  icon={<MessageCircle aria-hidden="true" className="size-4" />}
                  variant="secondary"
                >
                  Tirar dúvidas
                </ButtonLink>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-dark-blue py-16 text-white lg:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold text-[#94f0c1]">
              Avaliação personalizada
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
              Não sabe qual tratamento escolher?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#d7eaf4]">
              Fale com a equipe da Nova Previne para receber orientação inicial e
              combinar uma avaliação com tranquilidade.
            </p>
          </div>
          <ButtonLink
            className="w-full lg:w-auto"
            href="/contato"
            icon={<CalendarCheck aria-hidden="true" className="size-5" />}
            size="lg"
            variant="success"
          >
            Agendar avaliação
          </ButtonLink>
        </Container>
      </section>
    </main>
  );
}

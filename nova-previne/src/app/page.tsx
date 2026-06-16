import {
  Activity,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { StatusBadge } from "@/components/ui/status-badge";

const stats = [
  { label: "20 anos", description: "de cuidado odontológico" },
  { label: "Equipe", description: "especializada e acolhedora" },
  { label: "Prevenção", description: "como prioridade no atendimento" },
  { label: "Tecnologia", description: "a serviço do seu sorriso" },
];

const careCards = [
  {
    icon: <ShieldCheck aria-hidden="true" className="size-5" />,
    title: "Confiança clínica",
    description:
      "Atendimento conduzido com clareza, escuta atenta e orientação profissional em cada decisão.",
  },
  {
    icon: <UsersRound aria-hidden="true" className="size-5" />,
    title: "Acolhimento",
    description:
      "Uma jornada pensada para deixar o paciente seguro antes, durante e depois da consulta.",
  },
  {
    icon: <Activity aria-hidden="true" className="size-5" />,
    title: "Organização",
    description:
      "Informações importantes aparecem com destaque, linguagem simples e acompanhamento transparente.",
  },
];

const servicePreview = [
  {
    name: "Ortodontia",
    description:
      "Planejamento para alinhamento dental, mordida e acompanhamento do sorriso.",
  },
  {
    name: "Clareamento dental",
    description:
      "Protocolos seguros para recuperar brilho com orientação profissional.",
  },
  {
    name: "Limpeza e prevenção",
    description:
      "Profilaxia, avaliação preventiva e cuidado contínuo com a saúde bucal.",
  },
  {
    name: "Implantes",
    description: "Reabilitação com foco em segurança, mastigação e qualidade de vida.",
  },
];

export default function Home() {
  return (
    <main>
      <section id="sobre" className="overflow-hidden bg-white">
        <Container className="grid min-h-[calc(100vh-80px)] items-center gap-12 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:py-16">
          <div>
            <Badge variant="green">Clínica Odontológica Nova Previne</Badge>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-dark-blue sm:text-5xl lg:text-6xl">
              Há 20 anos cuidando do seu sorriso com confiança.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-text">
              Uma experiência digital clara, moderna e acolhedora para aproximar
              pacientes, dentistas e equipe clínica em cada etapa do atendimento.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                className="w-full sm:w-auto"
                href="/#contato"
                icon={<CalendarCheck aria-hidden="true" className="size-5" />}
                size="lg"
              >
                Agendar consulta
              </ButtonLink>
              <ButtonLink
                className="w-full sm:w-auto"
                href="/#tratamentos"
                icon={<ArrowRight aria-hidden="true" className="size-5" />}
                iconPosition="right"
                size="lg"
                variant="secondary"
              >
                Conhecer tratamentos
              </ButtonLink>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-lg border border-[#d9ebf2] bg-light-blue shadow-[0_24px_70px_rgba(0,59,111,0.16)]">
              <Image
                alt="Consultório odontológico moderno e iluminado"
                className="h-[360px] w-full object-cover sm:h-[460px] lg:h-[560px]"
                height={916}
                priority
                src="/images/nova-previne-clinic-hero.png"
                width={1717}
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/70 bg-white/95 p-4 shadow-[0_16px_38px_rgba(0,59,111,0.16)] backdrop-blur sm:left-auto sm:w-72">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-light-green text-primary-green">
                  <Sparkles aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-dark-blue">Cuidado premium</p>
                  <p className="text-sm text-gray-text">Visual limpo e acolhedor</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-[#d9ebf2] bg-light-blue/60">
        <Container className="grid gap-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div className="min-h-24 rounded-lg bg-white/70 p-5" key={item.label}>
              <p className="text-2xl font-bold text-dark-blue">{item.label}</p>
              <p className="mt-1 text-sm font-medium text-gray-text">
                {item.description}
              </p>
            </div>
          ))}
        </Container>
      </section>

      <section className="bg-surface py-16 lg:py-20">
        <Container>
          <SectionTitle
            align="center"
            description="A Nova Previne combina cuidado humano, prevenção e tecnologia para tornar o atendimento odontológico mais simples de acompanhar."
            eyebrow="Nossa essência"
            title="Cuidado organizado para uma clínica moderna."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {careCards.map((card) => (
              <Card interactive key={card.title} padding="lg">
                <span className="flex size-11 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
                  {card.icon}
                </span>
                <h3 className="mt-5 text-lg font-bold text-dark-blue">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-text">
                  {card.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="tratamentos" className="bg-white py-16 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionTitle
            description="Os tratamentos aparecem com descrição objetiva, bom contraste e chamadas claras para o paciente encontrar o melhor caminho."
            eyebrow="Tratamentos"
            title="Serviços apresentados com clareza e confiança."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {servicePreview.map((service) => (
              <Card interactive key={service.name}>
                <div className="flex items-start gap-4">
                  <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg bg-light-green text-primary-green">
                    <CheckCircle2 aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-dark-blue">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-text">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="dentistas" className="bg-light-green/60 py-16 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <SectionTitle
              description="Cada etapa do atendimento deve ser fácil de reconhecer, com texto direto e reforço visual acessível."
              eyebrow="Acompanhamento"
              title="Status de consulta com leitura rápida."
            />
            <div className="mt-7 flex flex-wrap gap-3">
              <StatusBadge status="REQUESTED" />
              <StatusBadge status="CONFIRMED" />
              <StatusBadge status="REFUSED" />
              <StatusBadge status="CANCELLED" />
              <StatusBadge status="COMPLETED" />
            </div>
          </div>

          <Card padding="lg">
            <div className="flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-lg bg-white text-primary-blue">
                <UsersRound aria-hidden="true" className="size-6" />
              </span>
              <div>
                <p className="text-sm font-semibold text-primary-green">
                  Profissionais em destaque
                </p>
                <h3 className="text-xl font-bold text-dark-blue">
                  Dr. João, Dra. Marina e Dr. Pedro
                </h3>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-gray-text">
              A equipe pode ser apresentada com especialidade, registro profissional,
              horários e chamada direta para agendamento.
            </p>
          </Card>
        </Container>
      </section>

      <section id="contato" className="bg-dark-blue py-16 text-white lg:py-20">
        <Container className="lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div>
            <p className="text-sm font-bold text-[#94f0c1]">Atendimento Nova Previne</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              Prefere falar direto com a clínica?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#d7eaf4]">
              Nossa equipe está pronta para orientar você sobre tratamentos, horários e
              cuidados antes da consulta.
            </p>
          </div>
          <ButtonLink
            className="mt-6 w-full lg:mt-0 lg:w-auto"
            href="https://wa.me/5531999990000"
            rel="noreferrer"
            size="lg"
            target="_blank"
            variant="success"
          >
            Chamar no WhatsApp
          </ButtonLink>
        </Container>
      </section>
    </main>
  );
}

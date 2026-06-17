import {
  ArrowRight,
  Award,
  CalendarCheck,
  CheckCircle2,
  Clock,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import { connection } from "next/server";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type ServicePreview = {
  description: string;
  durationMinutes?: number;
  id: string;
  name: string;
};

type DentistPreview = {
  availability: string;
  bio: string;
  cro: string;
  id: string;
  initials: string;
  name: string;
  specialty: string;
};

const stats = [
  { label: "20 anos", description: "de cuidado com sorrisos" },
  { label: "3 áreas", description: "com profissionais especializados" },
  { label: "6+ tratamentos", description: "para prevenção, estética e reabilitação" },
  { label: "Atendimento", description: "humano, organizado e preventivo" },
];

const differentials = [
  {
    icon: <ShieldCheck aria-hidden="true" className="size-5" />,
    title: "Confiança em cada etapa",
    description:
      "Orientação clara desde a primeira avaliação, com explicações objetivas sobre tratamento, tempo e próximos passos.",
  },
  {
    icon: <HeartHandshake aria-hidden="true" className="size-5" />,
    title: "Atendimento acolhedor",
    description:
      "Uma experiência pensada para deixar o paciente seguro, ouvido e bem acompanhado durante toda a jornada.",
  },
  {
    icon: <Stethoscope aria-hidden="true" className="size-5" />,
    title: "Prevenção como prioridade",
    description:
      "Foco em saúde bucal contínua, diagnóstico preventivo e cuidados personalizados para cada sorriso.",
  },
];

const processSteps = [
  {
    icon: <CheckCircle2 aria-hidden="true" className="size-5" />,
    title: "Escolha o tratamento",
    description: "Veja as opções principais e encontre o cuidado mais indicado.",
  },
  {
    icon: <UsersRound aria-hidden="true" className="size-5" />,
    title: "Conheça a equipe",
    description: "Confira dentistas ativos, especialidades e registro profissional.",
  },
  {
    icon: <MessageCircle aria-hidden="true" className="size-5" />,
    title: "Fale com a clínica",
    description: "Tire dúvidas pelo WhatsApp e combine o melhor horário disponível.",
  },
];

const fallbackServices: ServicePreview[] = [
  {
    id: "fallback-ortodontia",
    name: "Ortodontia",
    description:
      "Planejamento para alinhamento dental, mordida e acompanhamento preventivo do sorriso.",
    durationMinutes: 60,
  },
  {
    id: "fallback-clareamento",
    name: "Clareamento dental",
    description:
      "Protocolos seguros para recuperar brilho com orientação profissional.",
    durationMinutes: 50,
  },
  {
    id: "fallback-prevencao",
    name: "Limpeza e prevenção",
    description:
      "Profilaxia, avaliação preventiva e cuidado contínuo com a saúde bucal.",
    durationMinutes: 45,
  },
];

const fallbackDentists: DentistPreview[] = [
  {
    availability: "Disponibilidade em configuração",
    bio: "Perfil profissional preparado para apresentar especialidade, registro e horários da clínica.",
    cro: "CRO cadastrado",
    id: "fallback-dentist",
    initials: "NP",
    name: "Equipe Nova Previne",
    specialty: "Odontologia preventiva",
  },
];

const weekDays = [
  "domingo",
  "segunda",
  "terça",
  "quarta",
  "quinta",
  "sexta",
  "sábado",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatAvailability(
  availabilities: Array<{
    endTime: string;
    startTime: string;
    weekDay: number;
  }>,
) {
  if (availabilities.length === 0) {
    return "Horários sob consulta";
  }

  return availabilities
    .slice(0, 2)
    .map((availability) => {
      const day = weekDays[availability.weekDay] ?? "dia definido";

      return `${day}, ${availability.startTime}-${availability.endTime}`;
    })
    .join(" · ");
}

async function getHomeData() {
  try {
    const [services, dentists] = await Promise.all([
      prisma.service.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          description: true,
          durationMinutes: true,
          id: true,
          name: true,
        },
        take: 6,
        where: {
          active: true,
        },
      }),
      prisma.dentistProfile.findMany({
        include: {
          availabilities: {
            orderBy: [
              {
                weekDay: "asc",
              },
              {
                startTime: "asc",
              },
            ],
            select: {
              endTime: true,
              startTime: true,
              weekDay: true,
            },
            where: {
              active: true,
            },
          },
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 3,
        where: {
          active: true,
        },
      }),
    ]);

    return {
      dentists:
        dentists.length > 0
          ? dentists.map((dentist) => ({
              availability: formatAvailability(dentist.availabilities),
              bio:
                dentist.bio ??
                "Atendimento odontológico com foco em cuidado, clareza e acompanhamento próximo.",
              cro: dentist.cro,
              id: dentist.id,
              initials: getInitials(dentist.user.name),
              name: dentist.user.name,
              specialty: dentist.specialty,
            }))
          : fallbackDentists,
      services: services.length > 0 ? services : fallbackServices,
    };
  } catch {
    return {
      dentists: fallbackDentists,
      services: fallbackServices,
    };
  }
}

export default async function Home() {
  await connection();

  const { dentists, services } = await getHomeData();

  return (
    <main>
      <section
        id="sobre"
        className="overflow-hidden border-b border-[#d9ebf2] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfd_100%)]"
      >
        <Container className="grid min-h-[calc(88vh-80px)] items-center gap-12 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:py-14">
          <div>
            <Badge variant="green">Clínica Odontológica Nova Previne</Badge>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-dark-blue text-balance sm:text-5xl lg:text-6xl">
              Nova Previne: há 20 anos cuidando do seu sorriso.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-text">
              Atendimento odontológico moderno, acolhedor e organizado para
              prevenção, estética e reabilitação oral em Belo Horizonte.
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

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {stats.slice(0, 2).map((item) => (
                <div
                  className="rounded-lg border border-[#d9ebf2] bg-white/82 p-4 shadow-[0_12px_28px_rgba(0,59,111,0.06)]"
                  key={item.label}
                >
                  <p className="text-2xl font-bold text-dark-blue">{item.label}</p>
                  <p className="mt-1 text-sm font-medium text-gray-text">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-lg border border-[#d9ebf2] bg-light-blue shadow-[0_26px_72px_rgba(0,59,111,0.18)] ring-1 ring-white/80">
              <Image
                alt="Consultório odontológico moderno da Nova Previne"
                className="h-[360px] w-full object-cover sm:h-[460px] lg:h-[560px]"
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
                    20 anos de história
                  </p>
                  <p className="text-sm text-gray-text">
                    Prevenção, confiança e cuidado contínuo.
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute left-4 right-4 top-4 rounded-lg border border-[#b9e4f4] bg-white/92 px-4 py-3 text-sm font-bold text-dark-blue shadow-[0_14px_34px_rgba(0,59,111,0.12)] backdrop-blur sm:right-auto sm:max-w-xs">
              Odontologia preventiva, estética e reabilitação
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-[#d9ebf2] bg-white">
        <Container className="grid gap-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              className="min-h-24 rounded-lg border border-[#d9ebf2] bg-surface p-5 shadow-[0_10px_26px_rgba(0,59,111,0.05)]"
              key={item.label}
            >
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
            description="A clínica une experiência, prevenção e atendimento humanizado para que cada paciente entenda seu tratamento e se sinta seguro."
            eyebrow="Diferenciais"
            title="Cuidado odontológico claro, próximo e profissional."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {differentials.map((card) => (
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
        <Container>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              description="Conheça os principais cuidados disponíveis na clínica, com descrições objetivas para ajudar você a iniciar sua avaliação com mais segurança."
              eyebrow="Tratamentos principais"
              title="Serviços para prevenção, estética e reabilitação."
            />
            <ButtonLink
              className="w-full sm:w-fit"
              href="/#contato"
              icon={<CalendarCheck aria-hidden="true" className="size-4" />}
              variant="secondary"
            >
              Agendar avaliação
            </ButtonLink>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <Card interactive key={service.id} padding="lg">
                <div className="flex items-start gap-4">
                  <span className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-green text-primary-green">
                    <Sparkles aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-dark-blue">
                      {service.name}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-gray-text">
                      {service.description}
                    </p>
                  </div>
                </div>
                {service.durationMinutes && (
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary-blue">
                    <Clock aria-hidden="true" className="size-4" />
                    <span>{service.durationMinutes} minutos em média</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="dentistas" className="bg-light-green/60 py-16 lg:py-20">
        <Container>
          <SectionTitle
            align="center"
            description="Conheça profissionais da Nova Previne, suas especialidades, registros profissionais e períodos de atendimento."
            eyebrow="Dentistas"
            title="Equipe preparada para cuidar do seu sorriso."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {dentists.map((dentist) => (
              <Card interactive key={dentist.id} padding="lg">
                <div className="flex items-start gap-4">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-light-blue text-lg font-bold text-primary-blue">
                    {dentist.initials}
                  </span>
                  <div>
                    <Badge variant="blue">{dentist.specialty}</Badge>
                    <h3 className="mt-3 text-xl font-bold text-dark-blue">
                      {dentist.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-primary-green">
                      {dentist.cro}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-gray-text">{dentist.bio}</p>
                <div className="mt-5 rounded-lg border border-[#d9ebf2] bg-surface p-4">
                  <div className="flex items-start gap-3">
                    <Clock
                      aria-hidden="true"
                      className="mt-0.5 size-4 text-primary-blue"
                    />
                    <div>
                      <p className="text-xs font-bold text-dark-blue">
                        Disponibilidade
                      </p>
                      <p className="mt-1 text-sm leading-5 text-gray-text">
                        {dentist.availability}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionTitle
            description="Entenda os cuidados disponíveis, conheça a equipe e fale com a clínica para combinar o melhor caminho para o seu atendimento."
            eyebrow="Como funciona"
            title="Um caminho simples para começar seu atendimento."
          />

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            {processSteps.map((step, index) => (
              <Card key={step.title}>
                <div className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
                    {step.icon}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-primary-green">
                      Passo {index + 1}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-dark-blue">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-text">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="contato" className="bg-dark-blue py-16 text-white lg:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold text-[#94f0c1]">
              Atendimento Nova Previne
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
              Prefere falar direto com a clínica?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#d7eaf4]">
              Nossa equipe pode orientar você sobre tratamentos, dentistas,
              horários e próximos passos para sua consulta.
            </p>
          </div>
          <ButtonLink
            className="w-full lg:w-auto"
            href="https://wa.me/5531999990000"
            icon={<MessageCircle aria-hidden="true" className="size-5" />}
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

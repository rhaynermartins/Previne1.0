import {
  ArrowRight,
  Award,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UsersRound,
  Zap,
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
  { label: "20 anos", description: "de cuidado, prevenção e confiança" },
  { label: "6+ tratamentos", description: "para prevenção, estética e reabilitação" },
  { label: "Equipe clínica", description: "com especialidades e registros ativos" },
  { label: "Agendamento digital", description: "para iniciar sua jornada com clareza" },
];

const heroSignals = [
  {
    icon: <HeartHandshake aria-hidden="true" className="size-5" />,
    label: "Atendimento humanizado",
  },
  {
    icon: <CalendarCheck aria-hidden="true" className="size-5" />,
    label: "Solicitação online",
  },
  {
    icon: <ShieldCheck aria-hidden="true" className="size-5" />,
    label: "Cuidado preventivo",
  },
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
    title: "Acolhimento clínico",
    description:
      "Uma experiência pensada para deixar o paciente seguro, ouvido e bem acompanhado durante toda a jornada.",
  },
  {
    icon: <Zap aria-hidden="true" className="size-5" />,
    title: "Tecnologia sem fricção",
    description:
      "Agendamento, acompanhamento e comunicação interna organizados em uma plataforma simples de usar.",
  },
];

const processSteps = [
  {
    icon: <Sparkles aria-hidden="true" className="size-5" />,
    title: "Escolha o cuidado",
    description: "Veja os tratamentos ativos e selecione o melhor ponto de partida.",
  },
  {
    icon: <UsersRound aria-hidden="true" className="size-5" />,
    title: "Conheça a equipe",
    description: "Confira dentistas, especialidades, CRO e períodos de atendimento.",
  },
  {
    icon: <CalendarCheck aria-hidden="true" className="size-5" />,
    title: "Solicite o horário",
    description: "Envie sua solicitação com descrição do caso para análise clínica.",
  },
  {
    icon: <BadgeCheck aria-hidden="true" className="size-5" />,
    title: "Acompanhe o status",
    description: "Receba a confirmação e veja tudo no seu painel de paciente.",
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
      <section className="relative isolate overflow-hidden border-b border-[#d9ebf2] bg-deep-blue text-white">
        <Image
          alt="Consultório odontológico moderno da Nova Previne"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-70"
          fill
          priority
          sizes="100vw"
          src="/images/nova-previne-clinic-hero.png"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,47,86,0.96)_0%,rgba(6,47,86,0.9)_38%,rgba(0,83,117,0.64)_62%,rgba(0,158,90,0.28)_100%)]"
        />
        <span
          aria-hidden="true"
          className="smile-line bottom-12 left-[8%] border-white/28"
        />
        <span
          aria-hidden="true"
          className="smile-line right-[-12%] top-16 border-[#94f0c1]/34"
        />

        <Container className="relative z-10 grid min-h-[calc(82svh-80px)] gap-10 py-12 sm:py-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.8fr)] lg:items-center xl:min-h-[690px]">
          <div className="motion-reveal max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/22 bg-white/12 px-4 py-2 text-sm font-bold text-[#d9fff0] shadow-[0_12px_30px_rgba(0,0,0,0.14)] backdrop-blur-xl">
              <Award aria-hidden="true" className="size-4" />
              20 anos de cuidado e confiança
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-balance sm:text-5xl lg:text-6xl">
              Odontologia moderna para cuidar do seu sorriso com calma,
              tecnologia e precisão.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d7eaf4] sm:text-lg">
              A Nova Previne une prevenção, acolhimento e uma experiência digital
              organizada para que sua consulta comece com clareza desde o primeiro
              contato.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                className="w-full sm:w-auto"
                href="/dashboard/paciente/agendamento"
                icon={<CalendarCheck aria-hidden="true" className="size-5" />}
                size="lg"
                variant="success"
              >
                Agendar consulta
              </ButtonLink>
              <ButtonLink
                className="w-full border-white/35 bg-white/94 sm:w-auto"
                href="#tratamentos"
                icon={<ArrowRight aria-hidden="true" className="size-5" />}
                iconPosition="right"
                size="lg"
                variant="secondary"
              >
                Conhecer tratamentos
              </ButtonLink>
            </div>

            <div className="mt-8 hidden gap-3 sm:grid sm:grid-cols-3">
              {heroSignals.map((item) => (
                <div
                  className="flex items-center gap-3 rounded-lg border border-white/16 bg-white/12 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-xl"
                  key={item.label}
                >
                  <span className="text-[#94f0c1]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden min-h-[500px] lg:block">
            <div
              aria-hidden="true"
              className="absolute right-3 top-5 text-[10rem] font-bold leading-none text-white/10 xl:text-[12rem]"
            >
              20
            </div>
            <div className="motion-float absolute right-0 top-20 w-80 rounded-lg border border-white/18 bg-white/14 p-5 text-white shadow-[0_28px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
              <p className="text-sm font-bold text-[#94f0c1]">Nova Previne</p>
              <h2 className="mt-2 text-2xl font-bold leading-tight">
                Uma jornada mais simples para cuidar do sorriso.
              </h2>
              <div className="mt-5 grid gap-3">
                {["Avaliação clara", "Equipe especializada", "Status acompanhado"].map(
                  (item) => (
                    <div className="flex items-center gap-3" key={item}>
                      <CheckCircle2
                        aria-hidden="true"
                        className="size-5 text-[#94f0c1]"
                      />
                      <span className="text-sm font-semibold text-[#edf9ff]">
                        {item}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="absolute bottom-14 left-8 w-72 rounded-lg border border-white/18 bg-white/94 p-5 text-dark-blue shadow-[0_26px_72px_rgba(0,0,0,0.2)]">
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-lg bg-light-green text-primary-green">
                  <Stethoscope aria-hidden="true" className="size-6" />
                </span>
                <div>
                  <p className="text-sm font-bold">Healthtech odontológica</p>
                  <p className="text-sm text-gray-text">
                    Fluxo digital com cuidado humano.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-[#d9ebf2] bg-white">
        <Container className="-mt-5 grid gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => (
            <div
              className="premium-panel motion-reveal min-h-28 rounded-lg p-5"
              key={item.label}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <p className="text-2xl font-bold text-dark-blue">{item.label}</p>
              <p className="mt-2 text-sm font-medium leading-6 text-gray-text">
                {item.description}
              </p>
            </div>
          ))}
        </Container>
      </section>

      <section className="np-ambient bg-surface py-16 lg:py-20">
        <Container>
          <SectionTitle
            align="center"
            description="A clínica une experiência, prevenção e atendimento humanizado para que cada paciente entenda seu tratamento e se sinta seguro."
            eyebrow="Diferenciais"
            title="Uma experiência odontológica clara, acolhedora e tecnológica."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {differentials.map((card) => (
              <Card interactive key={card.title} padding="lg">
                <span className="flex size-11 items-center justify-center rounded-lg bg-light-blue text-primary-blue shadow-[0_10px_24px_rgba(0,143,211,0.12)]">
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
              title="Cuidado preventivo, estética e reabilitação com padrão clínico."
            />
            <ButtonLink
              className="w-full sm:w-fit"
              href="/dashboard/paciente/agendamento"
              icon={<CalendarCheck aria-hidden="true" className="size-4" />}
              variant="secondary"
            >
              Agendar avaliação
            </ButtonLink>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <Card
                className={index === 0 ? "md:col-span-2 xl:col-span-1" : ""}
                interactive
                key={service.id}
                padding="lg"
              >
                <div className="flex items-start gap-4">
                  <span className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-lg bg-light-green text-primary-green shadow-[0_10px_24px_rgba(0,158,90,0.12)]">
                    <Sparkles aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <Badge variant="green">Tratamento ativo</Badge>
                    <h3 className="mt-3 text-xl font-bold text-dark-blue">
                      {service.name}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-gray-text">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between gap-3 rounded-lg border border-[#d9ebf2] bg-surface p-4">
                  {service.durationMinutes && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary-blue">
                      <Clock aria-hidden="true" className="size-4" />
                      <span>{service.durationMinutes} min</span>
                    </div>
                  )}
                  <ChevronRight aria-hidden="true" className="size-5 text-primary-green" />
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="dentistas" className="np-ambient bg-light-green/60 py-16 lg:py-20">
        <Container>
          <SectionTitle
            align="center"
            description="Conheça profissionais da Nova Previne, suas especialidades, registros profissionais e períodos de atendimento."
            eyebrow="Equipe clínica"
            title="Dentistas apresentados com credibilidade e cuidado."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {dentists.map((dentist) => (
              <Card interactive key={dentist.id} padding="lg">
                <div className="flex items-start gap-4">
                  <span className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-[#b9e4f4] bg-[linear-gradient(135deg,#eaf7fc,#ffffff)] text-xl font-bold text-primary-blue shadow-[0_14px_34px_rgba(0,143,211,0.12)]">
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
        <Container className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <SectionTitle
            description="O fluxo preserva o cuidado humano da clínica, mas remove ruído: você entende cada etapa e acompanha o status depois."
            eyebrow="Como funciona"
            title="Da escolha do tratamento à confirmação, tudo fica guiado."
          />

          <div className="grid gap-4 md:grid-cols-2">
            {processSteps.map((step, index) => (
              <Card interactive key={step.title} padding="lg">
                <div className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
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

      <section id="contato" className="premium-panel-dark relative overflow-hidden py-16 text-white lg:py-20">
        <span
          aria-hidden="true"
          className="smile-line bottom-8 right-[8%] border-white/20"
        />
        <Container className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold text-[#94f0c1]">
              Atendimento Nova Previne
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
              Prefere falar direto com a clínica antes de agendar?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#d7eaf4]">
              Nossa equipe pode orientar você sobre tratamentos, dentistas,
              horários e próximos passos para sua consulta.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:flex">
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
            <ButtonLink
              className="w-full border-white/30 bg-white/94 lg:w-auto"
              href="/contato"
              size="lg"
              variant="secondary"
            >
              Enviar mensagem
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import {
  CalendarCheck,
  Clock,
  MessageCircle,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { connection } from "next/server";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dentistas | Nova Previne",
  description:
    "Conheça os dentistas ativos da Clínica Nova Previne, suas especialidades, CRO e horários de atendimento.",
};

export const runtime = "nodejs";

type DentistItem = {
  availabilitySummary: string;
  bio: string;
  cro: string;
  id: string;
  initials: string;
  name: string;
  periods: string[];
  specialty: string;
};

const weekDays = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const fallbackDentists: DentistItem[] = [
  {
    availabilitySummary: "Horários sob consulta",
    bio: "Equipe preparada para atendimento odontológico preventivo, acolhedor e profissional.",
    cro: "CRO cadastrado",
    id: "fallback-equipe",
    initials: "NP",
    name: "Equipe Nova Previne",
    periods: ["Disponibilidade em configuração"],
    specialty: "Odontologia preventiva",
  },
];

const strengths = [
  {
    icon: <UserRoundCheck aria-hidden="true" className="size-5" />,
    title: "Perfis profissionais",
    description:
      "Especialidade, CRO e resumo profissional aparecem de forma clara para o paciente.",
  },
  {
    icon: <Clock aria-hidden="true" className="size-5" />,
    title: "Horários organizados",
    description:
      "A disponibilidade ativa ajuda a orientar o melhor caminho para combinar a consulta.",
  },
  {
    icon: <ShieldCheck aria-hidden="true" className="size-5" />,
    title: "Confiança clínica",
    description:
      "O atendimento é conduzido com orientação profissional, escuta e transparência.",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatPeriod(availability: {
  endTime: string;
  startTime: string;
  weekDay: number;
}) {
  const day = weekDays[availability.weekDay] ?? "Dia definido";

  return `${day}, ${availability.startTime}-${availability.endTime}`;
}

async function getDentists() {
  try {
    const dentists = await prisma.dentistProfile.findMany({
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
      where: {
        active: true,
      },
    });

    if (dentists.length === 0) {
      return fallbackDentists;
    }

    return dentists.map((dentist) => {
      const periods = dentist.availabilities.map(formatPeriod);

      return {
        availabilitySummary:
          periods.length > 0 ? periods.slice(0, 2).join(" · ") : "Horários sob consulta",
        bio:
          dentist.bio ??
          "Atendimento odontológico com foco em cuidado, clareza e acompanhamento próximo.",
        cro: dentist.cro,
        id: dentist.id,
        initials: getInitials(dentist.user.name),
        name: dentist.user.name,
        periods: periods.length > 0 ? periods : ["Horários sob consulta"],
        specialty: dentist.specialty,
      };
    });
  } catch {
    return fallbackDentists;
  }
}

export default async function DentistsPage() {
  await connection();

  const dentists = await getDentists();

  return (
    <main>
      <section className="public-hero border-b border-[#d9ebf2]">
        <Container className="py-14 lg:py-20">
          <div className="max-w-4xl">
            <Badge variant="green">Dentistas Nova Previne</Badge>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-dark-blue text-balance sm:text-5xl">
              Profissionais preparados para cuidar do seu sorriso com segurança.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-text">
              Conheça dentistas ativos da Nova Previne, suas especialidades,
              registros profissionais e períodos de atendimento disponíveis para
              orientação inicial.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href="/#contato"
                icon={<CalendarCheck aria-hidden="true" className="size-5" />}
                size="lg"
              >
                Agendar consulta
              </ButtonLink>
              <ButtonLink href="/tratamentos" size="lg" variant="secondary">
                Ver tratamentos
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-[#d9ebf2] bg-light-green/60 py-12">
        <Container className="grid gap-5 md:grid-cols-3">
          {strengths.map((strength) => (
            <Card interactive key={strength.title} padding="lg">
              <span className="flex size-11 items-center justify-center rounded-lg bg-white text-primary-green">
                {strength.icon}
              </span>
              <h2 className="mt-5 text-lg font-bold text-dark-blue">
                {strength.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-text">
                {strength.description}
              </p>
            </Card>
          ))}
        </Container>
      </section>

      <section className="bg-surface py-16 lg:py-20">
        <Container>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              description="Cada card apresenta informações essenciais para o paciente conhecer a equipe e iniciar o contato com a clínica."
              eyebrow="Equipe clínica"
              title="Dentistas ativos para atendimento."
            />
            <Badge variant="blue">{dentists.length} profissionais ativos</Badge>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {dentists.map((dentist) => (
              <Card interactive key={dentist.id} padding="lg">
                <div className="flex items-start gap-4">
                  <span className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-light-blue text-xl font-bold text-primary-blue">
                    {dentist.initials}
                  </span>
                  <div>
                    <Badge variant="green">{dentist.specialty}</Badge>
                    <h2 className="mt-3 text-xl font-bold text-dark-blue">
                      {dentist.name}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-primary-green">
                      {dentist.cro}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-gray-text">{dentist.bio}</p>

                <div className="mt-5 rounded-lg border border-[#d9ebf2] bg-white p-4">
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
                        {dentist.availabilitySummary}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  {dentist.periods.slice(0, 3).map((period) => (
                    <div
                      className="rounded-lg bg-light-blue px-3 py-2 text-xs font-semibold text-dark-blue"
                      key={period}
                    >
                      {period}
                    </div>
                  ))}
                </div>

                <ButtonLink
                  className="mt-5 w-full"
                  href="/contato"
                  icon={<MessageCircle aria-hidden="true" className="size-4" />}
                  variant="secondary"
                >
                  Falar com a clínica
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
              Escolha acompanhada
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
              Quer ajuda para escolher o profissional?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#d7eaf4]">
              A equipe da Nova Previne pode orientar você pelo WhatsApp e indicar o
              melhor caminho conforme o tratamento desejado.
            </p>
          </div>
          <ButtonLink
            className="w-full lg:w-auto"
            href="/contato"
            icon={<UsersRound aria-hidden="true" className="size-5" />}
            size="lg"
            variant="success"
          >
            Falar com a equipe
          </ButtonLink>
        </Container>
      </section>
    </main>
  );
}

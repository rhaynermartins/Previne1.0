import type { Metadata } from "next";
import {
  CalendarCheck,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";

import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contato | Nova Previne",
  description:
    "Entre em contato com a Clínica Odontológica Nova Previne por formulário, WhatsApp, telefone ou e-mail.",
};

export const runtime = "nodejs";

const contactItems = [
  {
    icon: <Phone aria-hidden="true" className="size-5" />,
    label: "Telefone",
    value: "(31) 3333-0000",
  },
  {
    icon: <MessageCircle aria-hidden="true" className="size-5" />,
    label: "WhatsApp",
    value: "(31) 99999-0000",
  },
  {
    icon: <Mail aria-hidden="true" className="size-5" />,
    label: "E-mail",
    value: "contato@novaprevine.com",
  },
  {
    icon: <MapPin aria-hidden="true" className="size-5" />,
    label: "Endereço",
    value: "Belo Horizonte, MG",
  },
];

const businessHours = [
  "Segunda a sexta, 8h às 18h",
  "Atendimento por WhatsApp em horário comercial",
  "Consultas mediante disponibilidade da equipe",
];

export default function ContactPage() {
  return (
    <main>
      <section className="bg-white">
        <Container className="grid gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
          <div>
            <Badge variant="green">Contato Nova Previne</Badge>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-dark-blue sm:text-5xl">
              Fale com a clínica e receba orientação para seu atendimento.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-text">
              Envie sua mensagem, tire dúvidas sobre tratamentos ou combine uma
              avaliação com a equipe da Nova Previne. O contato fica registrado para
              acompanhamento da clínica.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href="https://wa.me/5531999990000"
                icon={<MessageCircle aria-hidden="true" className="size-5" />}
                rel="noreferrer"
                size="lg"
                target="_blank"
                variant="success"
              >
                Chamar no WhatsApp
              </ButtonLink>
              <ButtonLink href="/tratamentos" size="lg" variant="secondary">
                Ver tratamentos
              </ButtonLink>
            </div>
          </div>

          <Card padding="lg">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
                <ShieldCheck aria-hidden="true" className="size-6" />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-dark-blue">
                  Atendimento claro e acolhedor
                </h2>
                <p className="mt-4 text-base leading-7 text-gray-text">
                  Use o formulário para registrar sua solicitação. A equipe poderá
                  avaliar o assunto, retornar o contato e orientar os próximos passos
                  com mais organização.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {businessHours.map((item) => (
                <div className="flex items-start gap-3 text-sm text-gray-text" key={item}>
                  <Clock
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-primary-green"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </Container>
      </section>

      <section className="border-y border-[#d9ebf2] bg-light-blue/60 py-12">
        <Container className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contactItems.map((item) => (
            <Card interactive key={item.label}>
              <span className="flex size-11 items-center justify-center rounded-lg bg-white text-primary-blue">
                {item.icon}
              </span>
              <p className="mt-5 text-sm font-bold text-primary-green">
                {item.label}
              </p>
              <p className="mt-2 text-base font-bold text-dark-blue">{item.value}</p>
            </Card>
          ))}
        </Container>
      </section>

      <section className="bg-surface py-16 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <SectionTitle
              description="Preencha seus dados com uma mensagem objetiva. Campos obrigatórios ajudam a equipe a retornar com mais precisão."
              eyebrow="Mensagem"
              title="Envie sua solicitação para a Nova Previne."
            />
            <div className="mt-8 rounded-lg border border-[#d9ebf2] bg-white p-5">
              <div className="flex items-start gap-3">
                <CalendarCheck
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-primary-green"
                />
                <p className="text-sm leading-6 text-gray-text">
                  Este formulário não confirma consulta automaticamente. A equipe da
                  clínica retornará para orientar horários, tratamentos e próximos
                  passos.
                </p>
              </div>
            </div>
          </div>

          <ContactForm />
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <Container>
          <SectionTitle
            align="center"
            description="A Nova Previne atende em Belo Horizonte e mantém canais claros para orientar pacientes antes da avaliação."
            eyebrow="Localização"
            title="Atendimento próximo, organizado e profissional."
          />
          <div className="mt-10 overflow-hidden rounded-lg border border-[#d9ebf2] bg-light-blue shadow-[0_14px_38px_rgba(0,59,111,0.08)]">
            <div className="grid min-h-72 place-items-center p-8 text-center">
              <MapPin aria-hidden="true" className="mx-auto size-10 text-primary-blue" />
              <h2 className="mt-4 text-2xl font-bold text-dark-blue">
                Belo Horizonte, MG
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-text">
                Mapa e endereço completo podem ser adicionados quando as informações
                oficiais da clínica estiverem disponíveis para publicação.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

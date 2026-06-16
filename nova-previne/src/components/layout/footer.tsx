import { Clock, HeartPulse, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/container";

const footerLinks = [
  { href: "/sobre", label: "Sobre" },
  { href: "/tratamentos", label: "Tratamentos" },
  { href: "/dentistas", label: "Dentistas" },
  { href: "/contato", label: "Contato" },
];

const contactItems = [
  {
    icon: <Phone aria-hidden="true" className="size-4" />,
    label: "(31) 3333-0000",
  },
  {
    icon: <Mail aria-hidden="true" className="size-4" />,
    label: "contato@novaprevine.com",
  },
  {
    icon: <MapPin aria-hidden="true" className="size-4" />,
    label: "Belo Horizonte, MG",
  },
  {
    icon: <Clock aria-hidden="true" className="size-4" />,
    label: "Segunda a sexta, 8h às 18h",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#d9ebf2] bg-white">
      <Container className="grid gap-10 py-10 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:py-12">
        <div>
          <Link className="inline-flex items-center gap-3 text-dark-blue" href="/">
            <span className="flex size-11 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
              <HeartPulse aria-hidden="true" className="size-6" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-bold">Nova Previne</span>
              <span className="block text-xs font-semibold text-gray-text">
                Clínica Odontológica
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-6 text-gray-text">
            Atendimento odontológico com cuidado, organização e confiança para
            pacientes, dentistas e equipe clínica.
          </p>
        </div>

        <nav aria-label="Links do rodapé" className="grid content-start gap-3">
          <p className="text-sm font-bold text-dark-blue">Institucional</p>
          {footerLinks.map((item) => (
            <Link
              className="text-sm font-semibold text-gray-text transition hover:text-primary-blue"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="grid content-start gap-3">
          <p className="text-sm font-bold text-dark-blue">Atendimento</p>
          {contactItems.map((item) => (
            <div
              className="flex items-start gap-3 text-sm text-gray-text"
              key={item.label}
            >
              <span className="mt-0.5 text-primary-green">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </Container>
      <div className="border-t border-[#edf4f8] py-4">
        <Container className="flex flex-col gap-2 text-xs font-medium text-gray-text sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Nova Previne. Todos os direitos reservados.</span>
          <span>Cuidado odontológico com confiança e acolhimento.</span>
        </Container>
      </div>
    </footer>
  );
}

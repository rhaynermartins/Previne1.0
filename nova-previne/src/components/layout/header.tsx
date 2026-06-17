import { CalendarCheck, HeartPulse, Menu } from "lucide-react";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const navItems = [
  { href: "/sobre", label: "Sobre" },
  { href: "/tratamentos", label: "Tratamentos" },
  { href: "/dentistas", label: "Dentistas" },
  { href: "/cadastro", label: "Cadastro" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d9ebf2] bg-white/92 shadow-[0_10px_30px_rgba(0,59,111,0.06)] backdrop-blur-xl">
      <Container className="flex min-h-20 items-center justify-between gap-4">
        <Link
          className="flex items-center gap-3 text-dark-blue focus-visible:rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-blue"
          href="/"
        >
          <span className="flex size-11 items-center justify-center rounded-lg border border-[#b9e4f4] bg-light-blue text-primary-blue shadow-[0_10px_24px_rgba(0,143,211,0.12)]">
            <HeartPulse aria-hidden="true" className="size-6" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold">Nova Previne</span>
            <span className="block text-xs font-semibold text-gray-text">
              Clínica Odontológica
            </span>
          </span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-7 lg:flex"
        >
          {navItems.map((item) => (
            <Link
              className="rounded-lg px-2 py-2 text-sm font-semibold text-gray-text transition hover:bg-light-blue hover:text-primary-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#008fd3]/15"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="rounded-full border border-[#b7ead3] bg-light-green px-3 py-1 text-xs font-bold text-[#006b3d]">
            20 anos
          </span>
          <ButtonLink href="/login" size="sm" variant="secondary">
            Entrar
          </ButtonLink>
          <ButtonLink
            href="/contato"
            icon={<CalendarCheck aria-hidden="true" className="size-4" />}
            size="sm"
          >
            Agendar
          </ButtonLink>
        </div>

        <details className="relative lg:hidden [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex size-11 cursor-pointer items-center justify-center rounded-lg border border-[#cfe2ec] bg-white text-dark-blue shadow-[0_8px_22px_rgba(0,59,111,0.06)] transition hover:bg-light-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#008fd3]/15">
            <Menu aria-hidden="true" className="size-5" />
            <span className="sr-only">Abrir navegação</span>
          </summary>
          <div className="absolute right-0 top-14 w-[min(88vw,340px)] rounded-lg border border-[#d9ebf2] bg-white p-3 shadow-[0_22px_60px_rgba(0,59,111,0.18)]">
            <div className="mb-3 rounded-lg border border-[#b7ead3] bg-light-green px-3 py-2 text-xs font-bold text-[#006b3d]">
              Nova Previne · 20 anos de cuidado
            </div>
            <nav aria-label="Navegação mobile" className="grid gap-1">
              {navItems.map((item) => (
                <Link
                  className="rounded-lg px-3 py-3 text-sm font-semibold text-gray-text transition hover:bg-light-blue hover:text-primary-blue"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 grid gap-2 border-t border-[#edf4f8] pt-3">
              <ButtonLink
                className="w-full"
                href="/login"
                size="sm"
                variant="secondary"
              >
                Entrar
              </ButtonLink>
              <ButtonLink
                className="w-full"
                href="/contato"
                icon={<CalendarCheck aria-hidden="true" className="size-4" />}
                size="sm"
              >
                Agendar
              </ButtonLink>
            </div>
          </div>
        </details>
      </Container>
    </header>
  );
}

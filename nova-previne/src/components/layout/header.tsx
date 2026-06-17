import { CalendarCheck, Menu } from "lucide-react";
import Image from "next/image";
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
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/82 shadow-[0_14px_40px_rgba(0,59,111,0.08)] backdrop-blur-xl">
      <Container className="flex min-h-20 items-center justify-between gap-3">
        <Link
          className="group flex shrink-0 items-center gap-2.5 text-dark-blue focus-visible:rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-blue sm:gap-3"
          href="/"
        >
          <span className="flex size-10 items-center justify-center rounded-lg border border-[#c8edf7] bg-white shadow-[0_10px_24px_rgba(0,143,211,0.12),0_0_0_3px_rgba(229,247,252,0.7)] transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_30px_rgba(0,143,211,0.16),0_0_0_4px_rgba(0,158,90,0.08)] sm:size-11">
            <Image
              alt=""
              aria-hidden="true"
              className="h-7 w-auto object-contain drop-shadow-[0_2px_5px_rgba(0,143,211,0.24)] sm:h-8"
              height={92}
              priority
              src="/images/nova-previne-logo-header.png"
              width={40}
            />
          </span>
          <span className="block whitespace-nowrap text-base font-extrabold leading-none tracking-[0.01em] text-dark-blue transition group-hover:text-primary-blue sm:text-lg">
            Nova Previne
          </span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden min-w-0 items-center gap-3 lg:flex xl:gap-6"
        >
          {navItems.map((item) => (
            <Link
              className="rounded-lg px-2 py-2 text-sm font-semibold text-gray-text transition hover:bg-light-blue hover:text-primary-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#008fd3]/15 xl:px-3"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <ButtonLink className="shrink-0" href="/login" size="sm" variant="secondary">
            Entrar
          </ButtonLink>
          <ButtonLink
            className="shrink-0"
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
          <div className="absolute right-0 top-14 w-[min(88vw,340px)] rounded-lg border border-[#d9ebf2] bg-white/96 p-3 shadow-[0_22px_60px_rgba(0,59,111,0.18)] backdrop-blur-xl">
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

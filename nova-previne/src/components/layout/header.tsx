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
      <Container className="flex min-h-20 items-center justify-between gap-4">
        <Link
          className="group flex items-center gap-3 text-dark-blue focus-visible:rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-blue"
          href="/"
        >
          <span className="flex size-12 items-center justify-center rounded-xl border border-[#c8edf7] bg-white shadow-[0_12px_30px_rgba(0,143,211,0.13),0_0_0_4px_rgba(229,247,252,0.75)] transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_34px_rgba(0,143,211,0.18),0_0_0_5px_rgba(0,158,90,0.08)]">
            <Image
              alt=""
              aria-hidden="true"
              className="h-9 w-auto object-contain drop-shadow-[0_3px_6px_rgba(0,143,211,0.25)]"
              height={82}
              priority
              src="/images/nova-previne-logo-header.png"
              width={38}
            />
          </span>
          <span className="block text-lg font-extrabold leading-none tracking-[0.01em] text-dark-blue transition group-hover:text-primary-blue">
            Nova Previne
          </span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-7 lg:flex"
        >
          {navItems.map((item) => (
            <Link
              className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-text transition hover:bg-light-blue hover:text-primary-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#008fd3]/15"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
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

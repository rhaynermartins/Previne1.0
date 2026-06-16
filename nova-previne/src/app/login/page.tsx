import type { Metadata } from "next";
import { KeyRound, LockKeyhole, ShieldCheck, UserRoundCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { getCurrentAuthUser } from "@/lib/auth/session";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login | Nova Previne",
  description:
    "Entre com sua conta da Clínica Odontológica Nova Previne para acessar recursos da plataforma.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const accessNotes = [
  {
    description: "A sessão é salva em cookie HTTP-only assinado no servidor.",
    icon: <LockKeyhole aria-hidden="true" className="size-5" />,
    title: "Sessão segura",
  },
  {
    description: "Pacientes, dentistas e administradores usam a mesma entrada.",
    icon: <UserRoundCheck aria-hidden="true" className="size-5" />,
    title: "Acesso por perfil",
  },
  {
    description: "O logout remove a sessão atual sem alterar seus dados cadastrados.",
    icon: <ShieldCheck aria-hidden="true" className="size-5" />,
    title: "Saída simples",
  },
];

export default async function LoginPage() {
  const currentUser = await getCurrentAuthUser();

  return (
    <main>
      <section className="bg-white">
        <Container className="grid gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:py-20">
          <div className="lg:sticky lg:top-28">
            <Badge variant="blue">Acesso Nova Previne</Badge>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-dark-blue sm:text-5xl">
              Entre na sua conta com segurança e clareza.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-text">
              Use seu e-mail e senha para iniciar uma sessão na plataforma. O acesso
              identifica se você entra como paciente, dentista ou administrador.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/cadastro" size="lg" variant="secondary">
                Criar conta
              </ButtonLink>
              <ButtonLink href="/contato" size="lg" variant="neutral">
                Preciso de ajuda
              </ButtonLink>
            </div>

            <div className="mt-8 grid gap-4">
              {accessNotes.map((note) => (
                <Card className="flex items-start gap-4" key={note.title}>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
                    {note.icon}
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-dark-blue">
                      {note.title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-text">
                      {note.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <LoginForm currentUser={currentUser} />
        </Container>
      </section>

      <section className="border-t border-[#d9ebf2] bg-light-blue/60 py-14">
        <Container className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <SectionTitle
            description="Cada conta mantém uma sessão própria para organizar dados, atendimentos e recursos conforme o perfil de acesso."
            eyebrow="Conta protegida"
            title="Uma entrada única para cada perfil da clínica."
          />
          <Card className="flex items-start gap-4" padding="lg">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white text-primary-green">
              <KeyRound aria-hidden="true" className="size-6" />
            </span>
            <p className="text-base leading-7 text-gray-text">
              Depois de entrar, sua sessão permanece ativa no navegador até você sair
              da conta, mantendo o acesso preparado para os recursos da plataforma.
            </p>
          </Card>
        </Container>
      </section>
    </main>
  );
}

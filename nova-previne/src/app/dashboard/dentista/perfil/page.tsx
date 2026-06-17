import {
  BadgeCheck,
  CalendarDays,
  ClipboardList,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCurrentAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

import { DentistProfileForm } from "./dentist-profile-form";

export const metadata: Metadata = {
  title: "Perfil profissional | Nova Previne",
  description:
    "Visualização do perfil profissional do dentista na Clínica Odontológica Nova Previne.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ProfileFieldProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function formatValue(value?: string | null) {
  return value?.trim() ? value : "Não informado";
}

function formatDate(date?: Date | null) {
  if (!date) {
    return "Não informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

function getInitials(name: string) {
  const [firstName, secondName] = name.split(" ").filter(Boolean);

  return `${firstName?.[0] ?? "D"}${secondName?.[0] ?? ""}`.toUpperCase();
}

function ProfileField({ icon, label, value }: ProfileFieldProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[#d9ebf2] bg-surface p-4">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold text-dark-blue">{label}</p>
        <p className="mt-1 break-words text-sm leading-6 text-gray-text">
          {value}
        </p>
      </div>
    </div>
  );
}

async function getDentistProfileData(userId: string) {
  try {
    return prisma.user.findUnique({
      select: {
        createdAt: true,
        email: true,
        name: true,
        phone: true,
        whatsapp: true,
        dentistProfile: {
          select: {
            active: true,
            bio: true,
            cro: true,
            createdAt: true,
            phone: true,
            photoUrl: true,
            specialty: true,
            updatedAt: true,
          },
        },
      },
      where: {
        id: userId,
      },
    });
  } catch {
    return null;
  }
}

export default async function DentistProfilePage() {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?next=/dashboard/dentista/perfil");
  }

  const dentist = await getDentistProfileData(session.user.id);
  const profile = dentist?.dentistProfile ?? null;
  const displayUser = {
    active: profile?.active ?? false,
    bio: profile?.bio ?? null,
    createdAt: dentist?.createdAt ?? null,
    cro: profile?.cro ?? null,
    email: dentist?.email ?? session.user.email,
    name: dentist?.name ?? session.user.name,
    phone: profile?.phone ?? dentist?.phone ?? null,
    photoUrl: profile?.photoUrl ?? null,
    profileCreatedAt: profile?.createdAt ?? null,
    profileUpdatedAt: profile?.updatedAt ?? null,
    specialty: profile?.specialty ?? null,
    whatsapp: dentist?.whatsapp ?? null,
  };

  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Perfil profissional
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Dados profissionais apresentados aos pacientes.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Consulte as informações clínicas vinculadas ao seu cadastro de
              dentista na Nova Previne e mantenha seus dados profissionais
              atualizados.
            </p>
          </div>

          <Badge variant={displayUser.active ? "green" : "amber"}>
            {displayUser.active ? "Perfil ativo" : "Perfil inativo"}
          </Badge>
        </div>
      </Card>

      <DentistProfileForm
        initialValues={{
          bio: displayUser.bio ?? "",
          cro: displayUser.cro ?? "",
          phone: displayUser.phone ?? "",
          photoUrl: displayUser.photoUrl ?? "",
          specialty: displayUser.specialty ?? "",
        }}
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card padding="lg">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex size-24 shrink-0 items-center justify-center rounded-lg border border-[#b9e4f4] bg-light-blue text-3xl font-bold text-primary-blue">
              {getInitials(displayUser.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-primary-green">
                Identificação profissional
              </p>
              <h3 className="mt-2 break-words text-2xl font-bold text-dark-blue">
                {displayUser.name}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="blue">{formatValue(displayUser.specialty)}</Badge>
                <Badge variant="navy">{formatValue(displayUser.cro)}</Badge>
              </div>
              <p className="mt-4 break-all text-sm leading-6 text-gray-text">
                {displayUser.email}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-[#d9ebf2] bg-surface p-4">
            <div className="flex items-start gap-3">
              <FileText
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-primary-green"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-dark-blue">
                  Bio profissional
                </p>
                <p className="mt-2 break-words text-sm leading-6 text-gray-text">
                  {formatValue(displayUser.bio)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <p className="text-sm font-bold text-primary-green">
            Credenciais clínicas
          </p>
          <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
            Registro e especialidade
          </h3>

          <div className="mt-6 grid gap-3">
            <ProfileField
              icon={<Stethoscope aria-hidden="true" className="size-5" />}
              label="Especialidade principal"
              value={formatValue(displayUser.specialty)}
            />
            <ProfileField
              icon={<ClipboardList aria-hidden="true" className="size-5" />}
              label="CRO"
              value={formatValue(displayUser.cro)}
            />
            <ProfileField
              icon={<BadgeCheck aria-hidden="true" className="size-5" />}
              label="Status do perfil"
              value={displayUser.active ? "Ativo para exibição" : "Inativo"}
            />
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1fr]">
        <Card padding="lg">
          <p className="text-sm font-bold text-primary-green">Contato</p>
          <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
            Canais profissionais
          </h3>

          <div className="mt-6 grid gap-3">
            <ProfileField
              icon={<Mail aria-hidden="true" className="size-5" />}
              label="E-mail"
              value={displayUser.email}
            />
            <ProfileField
              icon={<Phone aria-hidden="true" className="size-5" />}
              label="Telefone profissional"
              value={formatValue(displayUser.phone)}
            />
            <ProfileField
              icon={<Phone aria-hidden="true" className="size-5" />}
              label="WhatsApp"
              value={formatValue(displayUser.whatsapp)}
            />
          </div>
        </Card>

        <Card padding="lg">
          <p className="text-sm font-bold text-primary-green">
            Apresentação visual
          </p>
          <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
            Foto ou avatar
          </h3>

          <div className="mt-6 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex size-20 items-center justify-center rounded-lg border border-[#b7ead3] bg-light-green text-2xl font-bold text-primary-green">
              {getInitials(displayUser.name)}
            </div>
            <ProfileField
              icon={<UserRound aria-hidden="true" className="size-5" />}
              label="Imagem cadastrada"
              value={formatValue(displayUser.photoUrl)}
            />
          </div>

          <p className="mt-5 rounded-lg border border-[#b9e4f4] bg-light-blue p-4 text-sm leading-6 text-dark-blue">
            A imagem será apenas exibida quando houver um asset válido no
            projeto. Nesta task, a página mantém um avatar textual para evitar
            fotos quebradas.
          </p>
        </Card>
      </div>

      <Card padding="lg">
        <p className="text-sm font-bold text-primary-green">Conta profissional</p>
        <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
          Registro na plataforma
        </h3>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <ProfileField
            icon={<ShieldCheck aria-hidden="true" className="size-5" />}
            label="Conta criada em"
            value={formatDate(displayUser.createdAt)}
          />
          <ProfileField
            icon={<CalendarDays aria-hidden="true" className="size-5" />}
            label="Perfil criado em"
            value={formatDate(displayUser.profileCreatedAt)}
          />
          <ProfileField
            icon={<ShieldCheck aria-hidden="true" className="size-5" />}
            label="Perfil atualizado em"
            value={formatDate(displayUser.profileUpdatedAt)}
          />
        </div>

        <p className="mt-5 rounded-lg border border-[#b7ead3] bg-light-green p-4 text-sm leading-6 text-[#006b3d]">
          Estes dados são exibidos apenas na área autenticada do dentista. A
          edição nesta etapa está limitada a CRO, especialidade, bio, telefone
          profissional e foto.
        </p>
      </Card>
    </section>
  );
}

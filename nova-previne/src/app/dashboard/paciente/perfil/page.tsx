import type { Metadata } from "next";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  HeartPulse,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { getCurrentAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

import { PatientProfileForm } from "./patient-profile-form";

export const metadata: Metadata = {
  title: "Perfil do paciente | Nova Previne",
  description:
    "Visualização dos dados cadastrais do paciente na Clínica Odontológica Nova Previne.",
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

function formatDateInput(date?: Date | null) {
  if (!date) {
    return "";
  }

  return date.toISOString().slice(0, 10);
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

async function getPatientProfileData(userId: string) {
  try {
    return prisma.user.findUnique({
      select: {
        createdAt: true,
        email: true,
        name: true,
        patientProfile: {
          select: {
            birthDate: true,
            document: true,
            emergencyContact: true,
            notes: true,
            updatedAt: true,
          },
        },
        phone: true,
        whatsapp: true,
      },
      where: {
        id: userId,
      },
    });
  } catch {
    return null;
  }
}

export default async function PatientProfilePage() {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?next=/dashboard/paciente/perfil");
  }

  const patient = await getPatientProfileData(session.user.id);
  const profile = patient?.patientProfile;
  const displayUser = {
    birthDate: profile?.birthDate ?? null,
    createdAt: patient?.createdAt ?? null,
    document: profile?.document ?? null,
    email: patient?.email ?? session.user.email,
    emergencyContact: profile?.emergencyContact ?? null,
    name: patient?.name ?? session.user.name,
    notes: profile?.notes ?? null,
    phone: patient?.phone ?? null,
    profileUpdatedAt: profile?.updatedAt ?? null,
    whatsapp: patient?.whatsapp ?? null,
  };
  const formInitialValues = {
    birthDate: formatDateInput(displayUser.birthDate),
    document: displayUser.document ?? "",
    email: displayUser.email,
    emergencyContact: displayUser.emergencyContact ?? "",
    name: displayUser.name,
    notes: displayUser.notes ?? "",
    phone: displayUser.phone ?? "",
    whatsapp: displayUser.whatsapp ?? "",
  };

  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Perfil do paciente
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Seus dados cadastrados na Nova Previne.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Consulte suas informações pessoais e contatos usados pela clínica
              para organizar o atendimento.
            </p>
          </div>

          <div className="rounded-lg border border-[#b9e4f4] bg-light-blue p-4 text-sm font-semibold text-dark-blue">
            Visualização do perfil
          </div>
        </div>
      </Card>

      <PatientProfileForm initialValues={formInitialValues} />

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card padding="lg">
          <div className="flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-light-green text-primary-green">
              <UserRound aria-hidden="true" className="size-7" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-primary-green">
                Identificação
              </p>
              <h3 className="mt-2 break-words text-xl font-bold text-dark-blue sm:text-2xl">
                {displayUser.name}
              </h3>
              <p className="mt-2 break-all text-sm leading-6 text-gray-text">
                {displayUser.email}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ProfileField
              icon={<CalendarDays aria-hidden="true" className="size-5" />}
              label="Data de nascimento"
              value={formatDate(displayUser.birthDate)}
            />
            <ProfileField
              icon={<FileText aria-hidden="true" className="size-5" />}
              label="Documento"
              value={formatValue(displayUser.document)}
            />
          </div>
        </Card>

        <Card padding="lg">
          <p className="text-sm font-bold text-primary-green">Contato</p>
          <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
            Canais cadastrados
          </h3>

          <div className="mt-6 grid gap-3">
            <ProfileField
              icon={<Mail aria-hidden="true" className="size-5" />}
              label="E-mail"
              value={displayUser.email}
            />
            <ProfileField
              icon={<Phone aria-hidden="true" className="size-5" />}
              label="Telefone"
              value={formatValue(displayUser.phone)}
            />
            <ProfileField
              icon={<Phone aria-hidden="true" className="size-5" />}
              label="WhatsApp"
              value={formatValue(displayUser.whatsapp)}
            />
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1fr]">
        <Card padding="lg">
          <p className="text-sm font-bold text-primary-green">
            Informações de apoio
          </p>
          <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
            Dados para atendimento
          </h3>

          <div className="mt-6 grid gap-3">
            <ProfileField
              icon={<HeartPulse aria-hidden="true" className="size-5" />}
              label="Contato de emergência"
              value={formatValue(displayUser.emergencyContact)}
            />
            <ProfileField
              icon={<ClipboardList aria-hidden="true" className="size-5" />}
              label="Observações"
              value={formatValue(displayUser.notes)}
            />
          </div>
        </Card>

        <Card padding="lg">
          <p className="text-sm font-bold text-primary-green">Conta</p>
          <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
            Registro na plataforma
          </h3>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ProfileField
              icon={<ShieldCheck aria-hidden="true" className="size-5" />}
              label="Conta criada em"
              value={formatDate(displayUser.createdAt)}
            />
            <ProfileField
              icon={<ShieldCheck aria-hidden="true" className="size-5" />}
              label="Perfil atualizado em"
              value={formatDate(displayUser.profileUpdatedAt)}
            />
          </div>

          <p className="mt-5 rounded-lg border border-[#b7ead3] bg-light-green p-4 text-sm leading-6 text-[#006b3d]">
            Estes dados são exibidos apenas para sua área autenticada de paciente.
          </p>
        </Card>
      </div>
    </section>
  );
}

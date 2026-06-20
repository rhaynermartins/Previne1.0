"use client";

import { BadgeCheck, Stethoscope } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { registerDentist, type DentistRegisterState } from "./actions";

const initialDentistRegisterState: DentistRegisterState = {
  errors: {},
  message: "",
  status: "idle",
  values: {
    bio: "",
    cro: "",
    email: "",
    name: "",
    phone: "",
    photoUrl: "",
    specialty: "",
    whatsapp: "",
  },
};

function StatusMessage({ state }: { state: DentistRegisterState }) {
  if (state.status === "idle") {
    return null;
  }

  return (
    <div
      className={
        state.status === "success"
          ? "rounded-lg border border-[#b7ead3] bg-light-green p-4 text-sm font-semibold text-[#006b3d]"
          : "rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-sm font-semibold text-[#991b1b]"
      }
      role={state.status === "success" ? "status" : "alert"}
    >
      {state.message}
    </div>
  );
}

export function DentistRegisterForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    registerDentist,
    initialDentistRegisterState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <Card className="w-full" padding="lg">
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#cfe2ec] bg-light-blue p-4">
        <BadgeCheck
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-primary-blue"
        />
        <div>
          <p className="font-semibold text-dark-blue">
            Cadastro profissional do dentista
          </p>
          <p className="mt-1 text-sm leading-6 text-gray-text">
            Informe seus dados profissionais para preparar seu perfil clínico na
            plataforma da Nova Previne.
          </p>
        </div>
      </div>

      <div className="mb-6" aria-live="polite">
        <StatusMessage state={state} />
      </div>

      <form action={formAction} className="grid gap-5" ref={formRef}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            autoComplete="name"
            defaultValue={state.values.name}
            error={state.errors.name}
            label="Nome profissional"
            maxLength={120}
            name="name"
            placeholder="Dr(a). Nome Sobrenome"
            required
          />
          <Input
            autoComplete="email"
            defaultValue={state.values.email}
            error={state.errors.email}
            label="E-mail profissional"
            maxLength={160}
            name="email"
            placeholder="voce@clinica.com"
            required
            type="email"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            autoComplete="new-password"
            error={state.errors.password}
            helperText="Use pelo menos 8 caracteres, com letras e números."
            label="Senha"
            maxLength={72}
            name="password"
            placeholder="Crie uma senha segura"
            required
            type="password"
          />
          <Input
            autoComplete="new-password"
            error={state.errors.confirmPassword}
            label="Confirmar senha"
            maxLength={72}
            name="confirmPassword"
            placeholder="Repita sua senha"
            required
            type="password"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            defaultValue={state.values.cro}
            error={state.errors.cro}
            helperText="Ex.: CRO-MG 12345."
            label="CRO"
            maxLength={40}
            name="cro"
            placeholder="CRO-MG 00000"
            required
          />
          <Input
            defaultValue={state.values.specialty}
            error={state.errors.specialty}
            label="Especialidade principal"
            maxLength={80}
            name="specialty"
            placeholder="Ortodontia, Implantodontia..."
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            autoComplete="tel"
            defaultValue={state.values.whatsapp}
            error={state.errors.whatsapp}
            label="WhatsApp profissional"
            maxLength={40}
            name="whatsapp"
            placeholder="(31) 99999-0000"
            required
            type="tel"
          />
          <Input
            autoComplete="tel"
            defaultValue={state.values.phone}
            error={state.errors.phone}
            helperText="Opcional, caso seja diferente do WhatsApp."
            label="Telefone profissional"
            maxLength={40}
            name="phone"
            placeholder="(31) 3333-0000"
            type="tel"
          />
        </div>

        <Input
          defaultValue={state.values.photoUrl}
          error={state.errors.photoUrl}
          helperText="Opcional. Pode ser uma URL ou caminho interno iniciado por /."
          label="Foto profissional"
          maxLength={260}
          name="photoUrl"
          placeholder="/images/dentists/joao-almeida.svg"
        />

        <Textarea
          defaultValue={state.values.bio}
          error={state.errors.bio}
          helperText="Opcional. Uma bio completa ajuda pacientes a conhecerem sua atuação."
          label="Bio profissional"
          maxLength={900}
          name="bio"
          placeholder="Conte sua formação, área de atuação, experiência e abordagem no atendimento."
          rows={5}
        />

        <Button
          className="w-full"
          icon={<Stethoscope aria-hidden="true" className="size-4" />}
          isLoading={pending}
          size="lg"
          type="submit"
          variant="primary"
        >
          {pending ? "Criando cadastro" : "Criar cadastro de dentista"}
        </Button>
      </form>
    </Card>
  );
}

"use client";

import { CheckCircle2, UserPlus } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { registerPatient, type PatientRegisterState } from "./actions";

const initialPatientRegisterState: PatientRegisterState = {
  errors: {},
  message: "",
  status: "idle",
  values: {
    birthDate: "",
    document: "",
    email: "",
    emergencyContact: "",
    name: "",
    notes: "",
    phone: "",
    whatsapp: "",
  },
};

function StatusMessage({ state }: { state: PatientRegisterState }) {
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

export function PatientRegisterForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    registerPatient,
    initialPatientRegisterState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <Card className="w-full" padding="lg">
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#cfeee0] bg-light-green p-4">
        <CheckCircle2
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-primary-green"
        />
        <div>
          <p className="font-semibold text-dark-blue">Cadastro seguro do paciente</p>
          <p className="mt-1 text-sm leading-6 text-gray-text">
            Seus dados serão usados para identificar sua conta e facilitar o contato
            da equipe da Nova Previne.
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
            label="Nome completo"
            maxLength={120}
            name="name"
            placeholder="Seu nome completo"
            required
          />
          <Input
            autoComplete="email"
            defaultValue={state.values.email}
            error={state.errors.email}
            label="E-mail"
            maxLength={160}
            name="email"
            placeholder="voce@email.com"
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
            autoComplete="tel"
            defaultValue={state.values.whatsapp}
            error={state.errors.whatsapp}
            label="WhatsApp"
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
            label="Telefone"
            maxLength={40}
            name="phone"
            placeholder="(31) 3333-0000"
            type="tel"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            autoComplete="bday"
            defaultValue={state.values.birthDate}
            error={state.errors.birthDate}
            label="Data de nascimento"
            name="birthDate"
            required
            type="date"
          />
          <Input
            defaultValue={state.values.document}
            error={state.errors.document}
            helperText="Opcional neste primeiro cadastro."
            label="Documento"
            maxLength={32}
            name="document"
            placeholder="CPF ou documento de identificação"
          />
        </div>

        <Input
          autoComplete="tel"
          defaultValue={state.values.emergencyContact}
          error={state.errors.emergencyContact}
          helperText="Opcional, mas útil para atendimentos futuros."
          label="Contato de emergência"
          maxLength={80}
          name="emergencyContact"
          placeholder="Nome e telefone de alguém de confiança"
        />

        <Textarea
          defaultValue={state.values.notes}
          error={state.errors.notes}
          helperText="Opcional. Informe alergias, condições relevantes ou observações iniciais."
          label="Observações de saúde"
          maxLength={700}
          name="notes"
          placeholder="Ex.: alergias, medicações, sensibilidade, preferência de contato..."
          rows={4}
        />

        <Button
          className="w-full"
          icon={<UserPlus aria-hidden="true" className="size-4" />}
          isLoading={pending}
          size="lg"
          type="submit"
          variant="success"
        >
          {pending ? "Criando cadastro" : "Criar cadastro de paciente"}
        </Button>
      </form>
    </Card>
  );
}

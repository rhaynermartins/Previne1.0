"use client";

import { Save } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  updatePatientProfile,
  type PatientProfileEditState,
  type PatientProfileEditValues,
} from "./actions";

function StatusMessage({ state }: { state: PatientProfileEditState }) {
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

export function PatientProfileForm({
  initialValues,
}: {
  initialValues: PatientProfileEditValues;
}) {
  const initialState: PatientProfileEditState = {
    errors: {},
    message: "",
    status: "idle",
    values: initialValues,
  };
  const [state, formAction, pending] = useActionState(
    updatePatientProfile,
    initialState,
  );

  return (
    <Card padding="lg">
      <div className="mb-6">
        <p className="text-sm font-bold text-primary-green">Editar perfil</p>
        <h3 className="mt-2 text-xl font-bold text-dark-blue sm:text-2xl">
          Atualize seus dados cadastrais
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
          Mantenha seus contatos e informações de atendimento atualizados para a
          equipe da Nova Previne.
        </p>
      </div>

      <div className="mb-6" aria-live="polite">
        <StatusMessage state={state} />
      </div>

      <form action={formAction} className="grid gap-5">
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
            type="date"
          />
          <Input
            defaultValue={state.values.document}
            error={state.errors.document}
            helperText="Opcional."
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
          helperText="Opcional. Informe alergias, condições relevantes ou observações para atendimento."
          label="Observações de saúde"
          maxLength={700}
          name="notes"
          placeholder="Ex.: alergias, medicações, sensibilidade, preferência de contato..."
          rows={4}
        />

        <Button
          className="w-full sm:w-fit"
          icon={<Save aria-hidden="true" className="size-4" />}
          isLoading={pending}
          size="lg"
          type="submit"
          variant="success"
        >
          {pending ? "Salvando perfil" : "Salvar alterações"}
        </Button>
      </form>
    </Card>
  );
}

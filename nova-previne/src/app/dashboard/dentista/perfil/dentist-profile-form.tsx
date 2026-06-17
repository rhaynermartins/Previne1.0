"use client";

import { Save, Stethoscope } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  updateDentistProfile,
  type DentistProfileEditState,
  type DentistProfileEditValues,
} from "./actions";

function StatusMessage({ state }: { state: DentistProfileEditState }) {
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

export function DentistProfileForm({
  initialValues,
}: {
  initialValues: DentistProfileEditValues;
}) {
  const initialState: DentistProfileEditState = {
    errors: {},
    message: "",
    status: "idle",
    values: initialValues,
  };
  const [state, formAction, pending] = useActionState(
    updateDentistProfile,
    initialState,
  );

  return (
    <Card padding="lg">
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#cfe2ec] bg-light-blue p-4">
        <Stethoscope
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-primary-blue"
        />
        <div>
          <p className="font-semibold text-dark-blue">
            Editar perfil profissional
          </p>
          <p className="mt-1 text-sm leading-6 text-gray-text">
            Atualize as informações clínicas exibidas no seu painel e usadas para
            apresentar seu perfil aos pacientes.
          </p>
        </div>
      </div>

      <div className="mb-6" aria-live="polite">
        <StatusMessage state={state} />
      </div>

      <form action={formAction} className="grid gap-5">
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
            defaultValue={state.values.phone}
            error={state.errors.phone}
            helperText="Telefone profissional exibido no perfil."
            label="Telefone profissional"
            maxLength={40}
            name="phone"
            placeholder="(31) 3333-0000"
            type="tel"
          />
          <Input
            defaultValue={state.values.photoUrl}
            error={state.errors.photoUrl}
            helperText="Pode ser uma URL ou caminho interno iniciado por /."
            label="Foto profissional"
            maxLength={260}
            name="photoUrl"
            placeholder="/images/dentists/seu-nome.jpg"
          />
        </div>

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
          className="w-full sm:w-fit"
          icon={<Save aria-hidden="true" className="size-4" />}
          isLoading={pending}
          size="lg"
          type="submit"
          variant="success"
        >
          {pending ? "Salvando perfil" : "Salvar perfil profissional"}
        </Button>
      </form>
    </Card>
  );
}

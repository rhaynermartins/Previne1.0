"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useActionState } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  createAppointmentRequest,
  type AppointmentSchedulingState,
  type AppointmentSchedulingValues,
} from "./actions";

type AppointmentRequestFormProps = {
  initialValues: AppointmentSchedulingValues;
};

function StatusMessage({ state }: { state: AppointmentSchedulingState }) {
  if (state.status === "idle") {
    return null;
  }

  if (state.status === "success") {
    return (
      <div
        className="rounded-lg border border-[#b7ead3] bg-light-green p-4 text-sm font-semibold text-[#006b3d]"
        role="status"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0"
          />
          <div>
            <p>{state.message}</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                className="w-full sm:w-auto"
                href="/dashboard/paciente/consultas"
                variant="success"
              >
                Ver minhas consultas
              </ButtonLink>
              <ButtonLink
                className="w-full sm:w-auto"
                href="/dashboard/paciente"
                variant="secondary"
              >
                Voltar ao dashboard
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-sm font-semibold text-[#991b1b]"
      role="alert"
    >
      {state.message}
    </div>
  );
}

export function AppointmentRequestForm({
  initialValues,
}: AppointmentRequestFormProps) {
  const initialState: AppointmentSchedulingState = {
    errors: {},
    message: "",
    status: "idle",
    values: initialValues,
  };
  const [state, formAction, pending] = useActionState(
    createAppointmentRequest,
    initialState,
  );
  const disabled = pending || state.status === "success";

  return (
    <form action={formAction} className="grid gap-5">
      <input name="serviceId" type="hidden" value={state.values.serviceId} />
      <input name="dentistId" type="hidden" value={state.values.dentistId} />
      <input name="date" type="hidden" value={state.values.date} />
      <input name="startTime" type="hidden" value={state.values.startTime} />

      <StatusMessage state={state} />

      <Textarea
        defaultValue={state.values.caseDescription}
        disabled={disabled}
        error={state.errors.caseDescription}
        helperText="Conte sintomas, objetivo do tratamento ou qualquer informação que ajude o dentista a se preparar."
        label="Descrição do caso"
        maxLength={900}
        name="caseDescription"
        placeholder="Ex.: Tenho sentido sensibilidade ao mastigar e gostaria de avaliar uma restauração antiga."
        required
        rows={6}
      />

      {(state.errors.serviceId ||
        state.errors.dentistId ||
        state.errors.date ||
        state.errors.startTime) && (
        <div
          className="rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-sm font-semibold text-[#991b1b]"
          role="alert"
        >
          {state.errors.serviceId ??
            state.errors.dentistId ??
            state.errors.date ??
            state.errors.startTime}
        </div>
      )}

      <Button
        className="w-full sm:w-fit"
        disabled={disabled}
        icon={<Send aria-hidden="true" className="size-4" />}
        isLoading={pending}
        size="lg"
        type="submit"
        variant="success"
      >
        {pending ? "Enviando solicitação" : "Confirmar solicitação"}
      </Button>
    </form>
  );
}

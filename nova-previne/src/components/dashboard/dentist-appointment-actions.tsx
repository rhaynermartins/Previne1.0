"use client";

import { CheckCircle2, ClipboardCheck, MessageCircle, XCircle } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AppointmentStatus } from "@/generated/prisma/enums";
import {
  completeDentistAppointment,
  confirmDentistAppointment,
  refuseDentistAppointment,
  sendDentistAppointmentReminder,
  type DentistAppointmentActionState,
} from "@/app/dashboard/dentista/appointment-actions";

type DentistAppointmentActionsProps = {
  appointmentId: string;
  reminderSent?: boolean;
  status: AppointmentStatus;
};

const initialState: DentistAppointmentActionState = {
  message: "",
  status: "idle",
};

function ActionMessage({ state }: { state: DentistAppointmentActionState }) {
  if (state.status === "idle") {
    return null;
  }

  return (
    <div
      className={
        state.status === "success"
          ? "rounded-lg border border-[#b7ead3] bg-light-green p-3 text-sm font-semibold text-[#006b3d]"
          : "rounded-lg border border-[#fecaca] bg-[#fef2f2] p-3 text-sm font-semibold text-[#991b1b]"
      }
      role={state.status === "success" ? "status" : "alert"}
    >
      {state.message}
    </div>
  );
}

function HiddenAppointmentInput({ appointmentId }: { appointmentId: string }) {
  return <input name="appointmentId" type="hidden" value={appointmentId} />;
}

export function DentistAppointmentActions({
  appointmentId,
  reminderSent = false,
  status,
}: DentistAppointmentActionsProps) {
  const [confirmState, confirmAction, confirmPending] = useActionState(
    confirmDentistAppointment,
    initialState,
  );
  const [refuseState, refuseAction, refusePending] = useActionState(
    refuseDentistAppointment,
    initialState,
  );
  const [completeState, completeAction, completePending] = useActionState(
    completeDentistAppointment,
    initialState,
  );
  const [reminderState, reminderAction, reminderPending] = useActionState(
    sendDentistAppointmentReminder,
    initialState,
  );

  if (status === AppointmentStatus.REQUESTED) {
    return (
      <div className="mt-5 grid gap-4 rounded-lg border border-[#d9ebf2] bg-surface p-4">
        <div>
          <p className="text-sm font-bold text-dark-blue">Ações da solicitação</p>
          <p className="mt-1 text-sm leading-6 text-gray-text">
            Confirme a consulta ou registre o motivo caso não possa atender este
            horário.
          </p>
        </div>

        <div className="grid gap-3" aria-live="polite">
          <ActionMessage state={confirmState} />
          <ActionMessage state={refuseState} />
        </div>

        <form action={confirmAction}>
          <HiddenAppointmentInput appointmentId={appointmentId} />
          <Button
            className="w-full sm:w-auto"
            icon={<CheckCircle2 aria-hidden="true" className="size-4" />}
            isLoading={confirmPending}
            type="submit"
            variant="success"
          >
            {confirmPending ? "Confirmando" : "Aceitar consulta"}
          </Button>
        </form>

        <form action={refuseAction} className="grid gap-3">
          <HiddenAppointmentInput appointmentId={appointmentId} />
          <Textarea
            helperText="Obrigatório para recusar. O paciente verá esse motivo."
            label="Motivo da recusa"
            maxLength={500}
            name="refusalReason"
            placeholder="Ex.: Horário indisponível por conflito na agenda clínica."
            required
            rows={4}
          />
          <Button
            className="w-full sm:w-auto"
            icon={<XCircle aria-hidden="true" className="size-4" />}
            isLoading={refusePending}
            type="submit"
            variant="danger"
          >
            {refusePending ? "Registrando recusa" : "Recusar consulta"}
          </Button>
        </form>
      </div>
    );
  }

  if (status === AppointmentStatus.CONFIRMED) {
    return (
      <div className="mt-5 grid gap-4 rounded-lg border border-[#b7ead3] bg-light-green/60 p-4">
        <div>
          <p className="text-sm font-bold text-dark-blue">Atendimento confirmado</p>
          <p className="mt-1 text-sm leading-6 text-gray-text">
            Envie um lembrete simulado por WhatsApp ou marque como concluída
            quando o atendimento tiver sido realizado.
          </p>
        </div>

        <div className="grid gap-3" aria-live="polite">
          {reminderSent && (
            <div
              className="rounded-lg border border-[#b9e4f4] bg-light-blue p-3 text-sm font-semibold text-dark-blue"
              role="status"
            >
              Lembrete de WhatsApp ja registrado para esta consulta.
            </div>
          )}
          <ActionMessage state={reminderState} />
          <ActionMessage state={completeState} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <form action={reminderAction}>
            <HiddenAppointmentInput appointmentId={appointmentId} />
            <Button
              className="w-full sm:w-auto"
              icon={<MessageCircle aria-hidden="true" className="size-4" />}
              isLoading={reminderPending}
              type="submit"
              variant="success"
            >
              {reminderPending ? "Enviando lembrete" : "Enviar lembrete"}
            </Button>
          </form>

          <form action={completeAction}>
            <HiddenAppointmentInput appointmentId={appointmentId} />
            <Button
              className="w-full sm:w-auto"
              icon={<ClipboardCheck aria-hidden="true" className="size-4" />}
              isLoading={completePending}
              type="submit"
              variant="primary"
            >
              {completePending ? "Concluindo" : "Concluir consulta"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return null;
}

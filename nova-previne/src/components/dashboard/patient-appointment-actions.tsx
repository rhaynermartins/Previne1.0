"use client";

import { XCircle } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { AppointmentStatus } from "@/generated/prisma/enums";
import {
  cancelPatientAppointment,
  type PatientAppointmentActionState,
} from "@/app/dashboard/paciente/consultas/actions";

type PatientAppointmentActionsProps = {
  appointmentId: string;
  status: AppointmentStatus;
};

const initialState: PatientAppointmentActionState = {
  message: "",
  status: "idle",
};

function ActionMessage({ state }: { state: PatientAppointmentActionState }) {
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

export function PatientAppointmentActions({
  appointmentId,
  status,
}: PatientAppointmentActionsProps) {
  const [state, formAction, pending] = useActionState(
    cancelPatientAppointment,
    initialState,
  );
  const canCancel =
    status === AppointmentStatus.REQUESTED ||
    status === AppointmentStatus.CONFIRMED;

  if (!canCancel) {
    return null;
  }

  return (
    <div className="mt-5 grid gap-3 rounded-lg border border-[#d9ebf2] bg-surface p-4">
      <div>
        <p className="text-sm font-bold text-dark-blue">Ação do paciente</p>
        <p className="mt-1 text-sm leading-6 text-gray-text">
          Você pode cancelar uma consulta solicitada ou confirmada. A clínica
          será notificada automaticamente.
        </p>
      </div>

      <div aria-live="polite">
        <ActionMessage state={state} />
      </div>

      <form action={formAction}>
        <input name="appointmentId" type="hidden" value={appointmentId} />
        <Button
          className="w-full sm:w-auto"
          icon={<XCircle aria-hidden="true" className="size-4" />}
          isLoading={pending}
          type="submit"
          variant="danger"
        >
          {pending ? "Cancelando" : "Cancelar consulta"}
        </Button>
      </form>
    </div>
  );
}

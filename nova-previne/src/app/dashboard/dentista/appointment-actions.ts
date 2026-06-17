"use server";

import { refresh, revalidatePath } from "next/cache";

import { UserRole } from "@/generated/prisma/enums";
import { getCurrentAuthSession } from "@/lib/auth/session";
import {
  completeAppointmentByDentist,
  confirmAppointmentByDentist,
  refuseAppointmentByDentist,
} from "@/services/appointmentStatusService";

export type DentistAppointmentActionState = {
  message: string;
  status: "idle" | "success" | "error";
};

function getFormValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function revalidateDentistAppointmentViews() {
  revalidatePath("/dashboard/dentista");
  revalidatePath("/dashboard/dentista/agenda");
  revalidatePath("/dashboard/dentista/historico");
  revalidatePath("/dashboard/dentista/solicitacoes");
  revalidatePath("/dashboard/paciente");
  revalidatePath("/dashboard/paciente/consultas");
  revalidatePath("/dashboard/paciente/historico");
  refresh();
}

async function getDentistSessionOrError(): Promise<
  | {
      error: DentistAppointmentActionState;
      userId?: never;
    }
  | {
      error?: never;
      userId: string;
    }
> {
  const session = await getCurrentAuthSession();

  if (!session || session.user.role !== UserRole.DENTIST) {
    return {
      error: {
        message: "Entre como dentista para gerenciar consultas.",
        status: "error",
      },
    };
  }

  return {
    userId: session.user.id,
  };
}

export async function confirmDentistAppointment(
  _previousState: DentistAppointmentActionState,
  formData: FormData,
): Promise<DentistAppointmentActionState> {
  const auth = await getDentistSessionOrError();

  if (auth.error) {
    return auth.error;
  }

  const appointmentId = getFormValue(formData, "appointmentId");

  if (!appointmentId) {
    return {
      message: "Consulta não identificada para confirmação.",
      status: "error",
    };
  }

  const result = await confirmAppointmentByDentist({
    appointmentId,
    dentistUserId: auth.userId,
  });

  if (result.status === "success") {
    revalidateDentistAppointmentViews();
  }

  return result;
}

export async function refuseDentistAppointment(
  _previousState: DentistAppointmentActionState,
  formData: FormData,
): Promise<DentistAppointmentActionState> {
  const auth = await getDentistSessionOrError();

  if (auth.error) {
    return auth.error;
  }

  const appointmentId = getFormValue(formData, "appointmentId");
  const refusalReason = getFormValue(formData, "refusalReason");

  if (!appointmentId) {
    return {
      message: "Consulta não identificada para recusa.",
      status: "error",
    };
  }

  const result = await refuseAppointmentByDentist({
    appointmentId,
    dentistUserId: auth.userId,
    refusalReason,
  });

  if (result.status === "success") {
    revalidateDentistAppointmentViews();
  }

  return result;
}

export async function completeDentistAppointment(
  _previousState: DentistAppointmentActionState,
  formData: FormData,
): Promise<DentistAppointmentActionState> {
  const auth = await getDentistSessionOrError();

  if (auth.error) {
    return auth.error;
  }

  const appointmentId = getFormValue(formData, "appointmentId");

  if (!appointmentId) {
    return {
      message: "Consulta não identificada para conclusão.",
      status: "error",
    };
  }

  const result = await completeAppointmentByDentist({
    appointmentId,
    dentistUserId: auth.userId,
  });

  if (result.status === "success") {
    revalidateDentistAppointmentViews();
  }

  return result;
}

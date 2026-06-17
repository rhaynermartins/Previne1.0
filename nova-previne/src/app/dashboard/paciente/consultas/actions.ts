"use server";

import { refresh, revalidatePath } from "next/cache";

import { UserRole } from "@/generated/prisma/enums";
import { getCurrentAuthSession } from "@/lib/auth/session";
import { cancelAppointmentByPatient } from "@/services/appointmentStatusService";

export type PatientAppointmentActionState = {
  message: string;
  status: "idle" | "success" | "error";
};

function getFormValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function revalidatePatientAppointmentViews() {
  revalidatePath("/dashboard/paciente");
  revalidatePath("/dashboard/paciente/consultas");
  revalidatePath("/dashboard/paciente/historico");
  revalidatePath("/dashboard/dentista");
  revalidatePath("/dashboard/dentista/agenda");
  revalidatePath("/dashboard/dentista/historico");
  revalidatePath("/dashboard/dentista/solicitacoes");
  refresh();
}

export async function cancelPatientAppointment(
  _previousState: PatientAppointmentActionState,
  formData: FormData,
): Promise<PatientAppointmentActionState> {
  const session = await getCurrentAuthSession();

  if (!session || session.user.role !== UserRole.PATIENT) {
    return {
      message: "Entre como paciente para cancelar uma consulta.",
      status: "error",
    };
  }

  const appointmentId = getFormValue(formData, "appointmentId");

  if (!appointmentId) {
    return {
      message: "Consulta não identificada para cancelamento.",
      status: "error",
    };
  }

  const result = await cancelAppointmentByPatient({
    appointmentId,
    patientUserId: session.user.id,
  });

  if (result.status === "success") {
    revalidatePatientAppointmentViews();
  }

  return result;
}

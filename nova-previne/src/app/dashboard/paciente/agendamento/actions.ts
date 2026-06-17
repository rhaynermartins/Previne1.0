"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  AppointmentStatus,
  NotificationType,
  UserRole,
} from "@/generated/prisma/enums";
import { getCurrentAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  getAvailableAppointmentSlots,
  getTodayScheduleDate,
  parseScheduleDate,
} from "@/services/availabilityService";

export type AppointmentSchedulingValues = {
  caseDescription: string;
  date: string;
  dentistId: string;
  serviceId: string;
  startTime: string;
};

export type AppointmentSchedulingState = {
  appointmentId?: string;
  errors: Partial<Record<keyof AppointmentSchedulingValues, string>>;
  message: string;
  status: "idle" | "success" | "error";
  values: AppointmentSchedulingValues;
};

function getFormValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function validateSchedulingForm(formData: FormData): AppointmentSchedulingState {
  const values: AppointmentSchedulingValues = {
    caseDescription: getFormValue(formData, "caseDescription"),
    date: getFormValue(formData, "date"),
    dentistId: getFormValue(formData, "dentistId"),
    serviceId: getFormValue(formData, "serviceId"),
    startTime: getFormValue(formData, "startTime"),
  };
  const errors: AppointmentSchedulingState["errors"] = {};
  const scheduleDate = parseScheduleDate(values.date);

  if (!values.serviceId) {
    errors.serviceId = "Escolha um tratamento ativo.";
  }

  if (!values.dentistId) {
    errors.dentistId = "Escolha um dentista ativo.";
  }

  if (!scheduleDate) {
    errors.date = "Escolha uma data válida.";
  } else if (scheduleDate < getTodayScheduleDate()) {
    errors.date = "Escolha uma data a partir de hoje.";
  }

  if (!values.startTime) {
    errors.startTime = "Escolha um horário disponível.";
  }

  if (values.caseDescription.length < 10) {
    errors.caseDescription = "Descreva seu caso com pelo menos 10 caracteres.";
  }

  if (values.caseDescription.length > 900) {
    errors.caseDescription = "Use no máximo 900 caracteres.";
  }

  return {
    errors,
    message:
      Object.keys(errors).length > 0
        ? "Revise os dados do agendamento antes de enviar."
        : "",
    status: Object.keys(errors).length > 0 ? "error" : "idle",
    values,
  };
}

export async function createAppointmentRequest(
  _previousState: AppointmentSchedulingState,
  formData: FormData,
): Promise<AppointmentSchedulingState> {
  const session = await getCurrentAuthSession();
  const validationState = validateSchedulingForm(formData);

  if (!session || session.user.role !== UserRole.PATIENT) {
    return {
      ...validationState,
      message: "Entre como paciente para solicitar uma consulta.",
      status: "error",
    };
  }

  if (validationState.status === "error") {
    return validationState;
  }

  const scheduleDate = parseScheduleDate(validationState.values.date);

  if (!scheduleDate) {
    return {
      ...validationState,
      errors: {
        date: "Escolha uma data válida.",
      },
      message: "Não foi possível interpretar a data escolhida.",
      status: "error",
    };
  }

  const [patientProfile, service, dentist] = await Promise.all([
    prisma.patientProfile.findUnique({
      select: {
        id: true,
      },
      where: {
        userId: session.user.id,
      },
    }),
    prisma.service.findFirst({
      select: {
        active: true,
        id: true,
        name: true,
      },
      where: {
        active: true,
        id: validationState.values.serviceId,
      },
    }),
    prisma.dentistProfile.findFirst({
      select: {
        active: true,
        id: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        active: true,
        id: validationState.values.dentistId,
      },
    }),
  ]);

  if (!patientProfile) {
    return {
      ...validationState,
      message: "Complete seu perfil de paciente antes de solicitar consulta.",
      status: "error",
    };
  }

  if (!service) {
    return {
      ...validationState,
      errors: {
        serviceId: "Escolha um tratamento ativo.",
      },
      message: "Este tratamento não está disponível para agendamento.",
      status: "error",
    };
  }

  if (!dentist) {
    return {
      ...validationState,
      errors: {
        dentistId: "Escolha um dentista ativo.",
      },
      message: "Este dentista não está disponível para novos agendamentos.",
      status: "error",
    };
  }

  const availability = await getAvailableAppointmentSlots({
    date: scheduleDate,
    dentistId: dentist.id,
    serviceId: service.id,
  });
  const selectedSlot = availability.slots.find(
    (slot) => slot.startTime === validationState.values.startTime,
  );

  if (!availability.dentistActive || !availability.serviceActive || !selectedSlot) {
    return {
      ...validationState,
      errors: {
        startTime: "Escolha um horário que ainda esteja disponível.",
      },
      message:
        "Esse horário ficou indisponível. Escolha outro horário para continuar.",
      status: "error",
    };
  }

  let appointmentId = "";

  try {
    const appointment = await prisma.$transaction(async (tx) => {
      const createdAppointment = await tx.appointment.create({
        data: {
          caseDescription: validationState.values.caseDescription,
          date: scheduleDate,
          dentistId: dentist.id,
          endTime: selectedSlot.endTime,
          patientId: patientProfile.id,
          serviceId: service.id,
          startTime: selectedSlot.startTime,
          status: AppointmentStatus.REQUESTED,
        },
        select: {
          id: true,
        },
      });

      await tx.notification.create({
        data: {
          message: `${session.user.name} solicitou ${service.name} para ${validationState.values.date} às ${selectedSlot.startTime}.`,
          title: "Nova solicitação de consulta",
          type: NotificationType.APPOINTMENT_REQUESTED,
          userId: dentist.user.id,
        },
      });

      return createdAppointment;
    });

    appointmentId = appointment.id;
  } catch {
    return {
      ...validationState,
      errors: {
        startTime: "Este horário não está mais disponível.",
      },
      message:
        "Não foi possível criar a solicitação. O horário pode ter sido ocupado agora há pouco.",
      status: "error",
    };
  }

  revalidatePath("/dashboard/paciente");
  revalidatePath("/dashboard/paciente/agendamento");
  revalidatePath("/dashboard/paciente/consultas");
  revalidatePath("/dashboard/dentista");
  revalidatePath("/dashboard/dentista/agenda");
  revalidatePath("/dashboard/dentista/solicitacoes");

  redirect(
    `/dashboard/paciente/consultas?agendamento=sucesso&consulta=${appointmentId}`,
  );
}

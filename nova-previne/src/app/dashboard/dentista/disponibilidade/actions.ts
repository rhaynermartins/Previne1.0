"use server";

import { revalidatePath } from "next/cache";

import { UserRole } from "@/generated/prisma/enums";
import { getCurrentAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export type AvailabilityEditValues = {
  active: boolean;
  appointmentDuration: string;
  availabilityId: string;
  endTime: string;
  intervalEnd: string;
  intervalStart: string;
  startTime: string;
  weekDay: string;
};

export type AvailabilityEditState = {
  errors: Partial<Record<keyof AvailabilityEditValues, string>>;
  message: string;
  status: "idle" | "success" | "error";
  values: AvailabilityEditValues;
};

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function getFormValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function parseTime(value: string) {
  if (!timePattern.test(value)) {
    return null;
  }

  const [hours, minutes] = value.split(":").map(Number);

  if (hours === undefined || minutes === undefined) {
    return null;
  }

  return hours * 60 + minutes;
}

function validateAvailabilityForm(formData: FormData): AvailabilityEditState {
  const values: AvailabilityEditValues = {
    active: formData.get("active") === "on",
    appointmentDuration: getFormValue(formData, "appointmentDuration"),
    availabilityId: getFormValue(formData, "availabilityId"),
    endTime: getFormValue(formData, "endTime"),
    intervalEnd: getFormValue(formData, "intervalEnd"),
    intervalStart: getFormValue(formData, "intervalStart"),
    startTime: getFormValue(formData, "startTime"),
    weekDay: getFormValue(formData, "weekDay"),
  };
  const errors: AvailabilityEditState["errors"] = {};
  const weekDay = Number(values.weekDay);
  const appointmentDuration = Number(values.appointmentDuration);
  const startMinutes = parseTime(values.startTime);
  const endMinutes = parseTime(values.endTime);
  const intervalStartMinutes = values.intervalStart
    ? parseTime(values.intervalStart)
    : null;
  const intervalEndMinutes = values.intervalEnd
    ? parseTime(values.intervalEnd)
    : null;

  if (!Number.isInteger(weekDay) || weekDay < 0 || weekDay > 6) {
    errors.weekDay = "Escolha um dia da semana válido.";
  }

  if (startMinutes === null) {
    errors.startTime = "Informe um horário inicial válido.";
  }

  if (endMinutes === null) {
    errors.endTime = "Informe um horário final válido.";
  }

  if (startMinutes !== null && endMinutes !== null && startMinutes >= endMinutes) {
    errors.endTime = "O horário final deve ser depois do horário inicial.";
  }

  if (
    !Number.isInteger(appointmentDuration) ||
    appointmentDuration < 15 ||
    appointmentDuration > 240
  ) {
    errors.appointmentDuration =
      "Informe uma duração entre 15 e 240 minutos.";
  }

  if ((values.intervalStart && !values.intervalEnd) || (!values.intervalStart && values.intervalEnd)) {
    errors.intervalStart = "Informe início e fim do intervalo, ou deixe ambos vazios.";
    errors.intervalEnd = "Informe início e fim do intervalo, ou deixe ambos vazios.";
  }

  if (
    values.intervalStart &&
    values.intervalEnd &&
    (intervalStartMinutes === null || intervalEndMinutes === null)
  ) {
    errors.intervalStart = "Informe um intervalo válido.";
    errors.intervalEnd = "Informe um intervalo válido.";
  }

  if (
    startMinutes !== null &&
    endMinutes !== null &&
    intervalStartMinutes !== null &&
    intervalEndMinutes !== null
  ) {
    if (intervalStartMinutes >= intervalEndMinutes) {
      errors.intervalEnd = "O fim do intervalo deve ser depois do início.";
    }

    if (intervalStartMinutes < startMinutes || intervalEndMinutes > endMinutes) {
      errors.intervalStart = "O intervalo precisa ficar dentro do período.";
      errors.intervalEnd = "O intervalo precisa ficar dentro do período.";
    }
  }

  return {
    errors,
    message:
      Object.keys(errors).length > 0
        ? "Revise os campos destacados para salvar a disponibilidade."
        : "",
    status: Object.keys(errors).length > 0 ? "error" : "idle",
    values,
  };
}

async function getCurrentDentistProfileId() {
  const session = await getCurrentAuthSession();

  if (!session || session.user.role !== UserRole.DENTIST) {
    return {
      error: "Entre como dentista para gerenciar sua disponibilidade.",
      profileId: null,
    };
  }

  const profile = await prisma.dentistProfile.findUnique({
    select: {
      id: true,
    },
    where: {
      userId: session.user.id,
    },
  });

  if (!profile) {
    return {
      error: "Complete seu perfil profissional antes de cadastrar horários.",
      profileId: null,
    };
  }

  return {
    error: null,
    profileId: profile.id,
  };
}

async function hasConflictingAvailability({
  dentistId,
  endTime,
  excludeId,
  startTime,
  weekDay,
}: {
  dentistId: string;
  endTime: string;
  excludeId?: string;
  startTime: string;
  weekDay: number;
}) {
  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);

  if (startMinutes === null || endMinutes === null) {
    return false;
  }

  const periods = await prisma.dentistAvailability.findMany({
    select: {
      endTime: true,
      id: true,
      startTime: true,
    },
    where: {
      dentistId,
      id: excludeId
        ? {
            not: excludeId,
          }
        : undefined,
      weekDay,
    },
  });

  return periods.some((period) => {
    const periodStart = parseTime(period.startTime);
    const periodEnd = parseTime(period.endTime);

    if (periodStart === null || periodEnd === null) {
      return false;
    }

    return startMinutes < periodEnd && endMinutes > periodStart;
  });
}

export async function createDentistAvailability(
  _previousState: AvailabilityEditState,
  formData: FormData,
): Promise<AvailabilityEditState> {
  const validationState = validateAvailabilityForm(formData);
  const { error, profileId } = await getCurrentDentistProfileId();

  if (error || !profileId) {
    return {
      ...validationState,
      message: error ?? "Não foi possível identificar seu perfil profissional.",
      status: "error",
    };
  }

  if (validationState.status === "error") {
    return validationState;
  }

  const weekDay = Number(validationState.values.weekDay);
  const appointmentDuration = Number(validationState.values.appointmentDuration);
  const hasConflict = await hasConflictingAvailability({
    dentistId: profileId,
    endTime: validationState.values.endTime,
    startTime: validationState.values.startTime,
    weekDay,
  });

  if (hasConflict) {
    return {
      ...validationState,
      errors: {
        startTime: "Já existe um período cadastrado que cruza este horário.",
      },
      message: "Ajuste o horário para evitar sobreposição de períodos.",
      status: "error",
    };
  }

  try {
    await prisma.dentistAvailability.create({
      data: {
        active: validationState.values.active,
        appointmentDuration,
        dentistId: profileId,
        endTime: validationState.values.endTime,
        intervalEnd: validationState.values.intervalEnd || null,
        intervalStart: validationState.values.intervalStart || null,
        startTime: validationState.values.startTime,
        weekDay,
      },
    });

    revalidatePath("/dashboard/dentista");
    revalidatePath("/dashboard/dentista/disponibilidade");

    return {
      errors: {},
      message: "Horário disponível cadastrado com sucesso.",
      status: "success",
      values: validationState.values,
    };
  } catch {
    return {
      ...validationState,
      message:
        "Não foi possível cadastrar este horário agora. Tente novamente em instantes.",
      status: "error",
    };
  }
}

export async function updateDentistAvailability(
  _previousState: AvailabilityEditState,
  formData: FormData,
): Promise<AvailabilityEditState> {
  const validationState = validateAvailabilityForm(formData);
  const { error, profileId } = await getCurrentDentistProfileId();

  if (error || !profileId) {
    return {
      ...validationState,
      message: error ?? "Não foi possível identificar seu perfil profissional.",
      status: "error",
    };
  }

  if (!validationState.values.availabilityId) {
    return {
      ...validationState,
      errors: {
        availabilityId: "Horário não identificado.",
      },
      message: "Não foi possível identificar o horário para edição.",
      status: "error",
    };
  }

  if (validationState.status === "error") {
    return validationState;
  }

  const availability = await prisma.dentistAvailability.findFirst({
    select: {
      id: true,
    },
    where: {
      dentistId: profileId,
      id: validationState.values.availabilityId,
    },
  });

  if (!availability) {
    return {
      ...validationState,
      message: "Este horário não pertence ao seu perfil profissional.",
      status: "error",
    };
  }

  const weekDay = Number(validationState.values.weekDay);
  const appointmentDuration = Number(validationState.values.appointmentDuration);
  const hasConflict = await hasConflictingAvailability({
    dentistId: profileId,
    endTime: validationState.values.endTime,
    excludeId: validationState.values.availabilityId,
    startTime: validationState.values.startTime,
    weekDay,
  });

  if (hasConflict) {
    return {
      ...validationState,
      errors: {
        startTime: "Já existe outro período que cruza este horário.",
      },
      message: "Ajuste o horário para evitar sobreposição de períodos.",
      status: "error",
    };
  }

  try {
    await prisma.dentistAvailability.update({
      data: {
        active: validationState.values.active,
        appointmentDuration,
        endTime: validationState.values.endTime,
        intervalEnd: validationState.values.intervalEnd || null,
        intervalStart: validationState.values.intervalStart || null,
        startTime: validationState.values.startTime,
        weekDay,
      },
      where: {
        id: validationState.values.availabilityId,
      },
    });

    revalidatePath("/dashboard/dentista");
    revalidatePath("/dashboard/dentista/disponibilidade");

    return {
      errors: {},
      message: "Horário disponível atualizado com sucesso.",
      status: "success",
      values: validationState.values,
    };
  } catch {
    return {
      ...validationState,
      message:
        "Não foi possível atualizar este horário agora. Tente novamente em instantes.",
      status: "error",
    };
  }
}

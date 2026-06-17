import {
  AppointmentStatus,
  NotificationType,
} from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

type StatusTransitionResult = {
  message: string;
  status: "success" | "error";
};

function formatAppointmentDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

function getAppointmentScheduleText(appointment: {
  date: Date;
  endTime: string;
  startTime: string;
}) {
  return `${formatAppointmentDate(appointment.date)}, das ${
    appointment.startTime
  } às ${appointment.endTime}`;
}

function normalizeRefusalReason(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export async function confirmAppointmentByDentist({
  appointmentId,
  dentistUserId,
}: {
  appointmentId: string;
  dentistUserId: string;
}): Promise<StatusTransitionResult> {
  const appointment = await prisma.appointment.findFirst({
    select: {
      date: true,
      dentist: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      endTime: true,
      id: true,
      patient: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      service: {
        select: {
          name: true,
        },
      },
      startTime: true,
      status: true,
    },
    where: {
      dentist: {
        userId: dentistUserId,
      },
      id: appointmentId,
    },
  });

  if (!appointment) {
    return {
      message: "Consulta não encontrada para o seu perfil profissional.",
      status: "error",
    };
  }

  if (appointment.status !== AppointmentStatus.REQUESTED) {
    return {
      message: "Apenas consultas solicitadas podem ser confirmadas.",
      status: "error",
    };
  }

  await prisma.$transaction([
    prisma.appointment.update({
      data: {
        refusalReason: null,
        status: AppointmentStatus.CONFIRMED,
      },
      where: {
        id: appointment.id,
      },
    }),
    prisma.notification.create({
      data: {
        message: `Sua consulta de ${appointment.service.name} com Dr(a). ${
          appointment.dentist.user.name
        } em ${getAppointmentScheduleText(appointment)} foi confirmada.`,
        title: "Consulta confirmada",
        type: NotificationType.APPOINTMENT_CONFIRMED,
        userId: appointment.patient.user.id,
      },
    }),
  ]);

  return {
    message: "Consulta confirmada com sucesso.",
    status: "success",
  };
}

export async function refuseAppointmentByDentist({
  appointmentId,
  dentistUserId,
  refusalReason,
}: {
  appointmentId: string;
  dentistUserId: string;
  refusalReason: string;
}): Promise<StatusTransitionResult> {
  const normalizedReason = normalizeRefusalReason(refusalReason);

  if (normalizedReason.length < 8) {
    return {
      message: "Informe um motivo de recusa com pelo menos 8 caracteres.",
      status: "error",
    };
  }

  const appointment = await prisma.appointment.findFirst({
    select: {
      date: true,
      dentist: {
        select: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      endTime: true,
      id: true,
      patient: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      service: {
        select: {
          name: true,
        },
      },
      startTime: true,
      status: true,
    },
    where: {
      dentist: {
        userId: dentistUserId,
      },
      id: appointmentId,
    },
  });

  if (!appointment) {
    return {
      message: "Consulta não encontrada para o seu perfil profissional.",
      status: "error",
    };
  }

  if (appointment.status !== AppointmentStatus.REQUESTED) {
    return {
      message: "Apenas consultas solicitadas podem ser recusadas.",
      status: "error",
    };
  }

  await prisma.$transaction([
    prisma.appointment.update({
      data: {
        refusalReason: normalizedReason,
        status: AppointmentStatus.REFUSED,
      },
      where: {
        id: appointment.id,
      },
    }),
    prisma.notification.create({
      data: {
        message: `Sua consulta de ${appointment.service.name} com Dr(a). ${
          appointment.dentist.user.name
        } em ${getAppointmentScheduleText(
          appointment,
        )} foi recusada. Motivo: ${normalizedReason}`,
        title: "Consulta recusada",
        type: NotificationType.APPOINTMENT_REFUSED,
        userId: appointment.patient.user.id,
      },
    }),
  ]);

  return {
    message: "Consulta recusada com motivo registrado.",
    status: "success",
  };
}

export async function completeAppointmentByDentist({
  appointmentId,
  dentistUserId,
}: {
  appointmentId: string;
  dentistUserId: string;
}): Promise<StatusTransitionResult> {
  const appointment = await prisma.appointment.findFirst({
    select: {
      date: true,
      dentist: {
        select: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      endTime: true,
      id: true,
      patient: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      service: {
        select: {
          name: true,
        },
      },
      startTime: true,
      status: true,
    },
    where: {
      dentist: {
        userId: dentistUserId,
      },
      id: appointmentId,
    },
  });

  if (!appointment) {
    return {
      message: "Consulta não encontrada para o seu perfil profissional.",
      status: "error",
    };
  }

  if (appointment.status !== AppointmentStatus.CONFIRMED) {
    return {
      message: "Apenas consultas confirmadas podem ser concluídas.",
      status: "error",
    };
  }

  await prisma.$transaction([
    prisma.appointment.update({
      data: {
        status: AppointmentStatus.COMPLETED,
      },
      where: {
        id: appointment.id,
      },
    }),
    prisma.notification.create({
      data: {
        message: `Sua consulta de ${appointment.service.name} com Dr(a). ${
          appointment.dentist.user.name
        } em ${getAppointmentScheduleText(appointment)} foi concluída.`,
        title: "Consulta concluída",
        type: NotificationType.APPOINTMENT_COMPLETED,
        userId: appointment.patient.user.id,
      },
    }),
  ]);

  return {
    message: "Consulta marcada como concluída.",
    status: "success",
  };
}

export async function cancelAppointmentByPatient({
  appointmentId,
  patientUserId,
}: {
  appointmentId: string;
  patientUserId: string;
}): Promise<StatusTransitionResult> {
  const appointment = await prisma.appointment.findFirst({
    select: {
      date: true,
      dentist: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      endTime: true,
      id: true,
      patient: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      service: {
        select: {
          name: true,
        },
      },
      startTime: true,
      status: true,
    },
    where: {
      id: appointmentId,
      patient: {
        userId: patientUserId,
      },
    },
  });

  if (!appointment) {
    return {
      message: "Consulta não encontrada para o seu perfil de paciente.",
      status: "error",
    };
  }

  if (
    appointment.status !== AppointmentStatus.REQUESTED &&
    appointment.status !== AppointmentStatus.CONFIRMED
  ) {
    return {
      message: "Apenas consultas solicitadas ou confirmadas podem ser canceladas.",
      status: "error",
    };
  }

  await prisma.$transaction([
    prisma.appointment.update({
      data: {
        status: AppointmentStatus.CANCELLED,
      },
      where: {
        id: appointment.id,
      },
    }),
    prisma.notification.create({
      data: {
        message: `${appointment.patient.user.name} cancelou a consulta de ${
          appointment.service.name
        } em ${getAppointmentScheduleText(appointment)}.`,
        title: "Consulta cancelada",
        type: NotificationType.APPOINTMENT_CANCELLED,
        userId: appointment.dentist.user.id,
      },
    }),
  ]);

  return {
    message: "Consulta cancelada com sucesso.",
    status: "success",
  };
}

import {
  AppointmentStatus,
  NotificationType,
  ReminderStatus,
} from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

type ReminderResult = {
  logId?: string;
  message: string;
  reminderMessage?: string;
  status: "success" | "error";
};

type AppointmentForReminder = {
  date: Date;
  dentist: {
    user: {
      id: string;
      name: string;
    };
  };
  endTime: string;
  id: string;
  patient: {
    user: {
      id: string;
      name: string;
      phone: string | null;
      whatsapp: string | null;
    };
  };
  service: {
    name: string;
  };
  startTime: string;
  status: AppointmentStatus;
};

function formatAppointmentDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

function normalizePhone(value?: string | null) {
  return value?.trim().replace(/\s+/g, " ") ?? "";
}

export function buildWhatsAppReminderMessage(
  appointment: AppointmentForReminder,
) {
  return `Ola, ${appointment.patient.user.name}! Este e um lembrete da Clinica Nova Previne. Sua consulta de ${appointment.service.name} com Dr(a). ${appointment.dentist.user.name} esta marcada para ${formatAppointmentDate(appointment.date)} das ${appointment.startTime} as ${appointment.endTime}. Esperamos voce!`;
}

async function getAppointmentForReminder({
  appointmentId,
  dentistUserId,
}: {
  appointmentId: string;
  dentistUserId?: string;
}) {
  return prisma.appointment.findFirst({
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
              phone: true,
              whatsapp: true,
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
      ...(dentistUserId
        ? {
            dentist: {
              userId: dentistUserId,
            },
          }
        : {}),
    },
  });
}

export async function sendWhatsAppReminder({
  appointmentId,
  dentistUserId,
}: {
  appointmentId: string;
  dentistUserId?: string;
}): Promise<ReminderResult> {
  const appointment = await getAppointmentForReminder({
    appointmentId,
    dentistUserId,
  });

  if (!appointment) {
    return {
      message: "Consulta nao encontrada para envio de lembrete.",
      status: "error",
    };
  }

  if (appointment.status !== AppointmentStatus.CONFIRMED) {
    return {
      message: "Apenas consultas confirmadas podem receber lembrete.",
      status: "error",
    };
  }

  const patientPhone = normalizePhone(
    appointment.patient.user.whatsapp ?? appointment.patient.user.phone,
  );

  if (!patientPhone) {
    return {
      message: "Paciente sem WhatsApp ou telefone cadastrado para lembrete.",
      status: "error",
    };
  }

  const reminderMessage = buildWhatsAppReminderMessage(appointment);
  const providerResponse = {
    mode: "simulated",
    provider: "Nova Previne internal simulator",
    readyFor: [
      "WhatsApp Business API",
      "Twilio",
      "Z-API",
      "Evolution API",
      "Meta WhatsApp Cloud API",
    ],
  };

  const [reminderLog] = await prisma.$transaction([
    prisma.whatsAppReminderLog.create({
      data: {
        appointmentId: appointment.id,
        message: reminderMessage,
        patientPhone,
        providerResponse,
        sentAt: new Date(),
        status: ReminderStatus.SIMULATED,
      },
      select: {
        id: true,
      },
    }),
    prisma.notification.create({
      data: {
        message:
          "O lembrete de WhatsApp da sua consulta confirmada foi simulado com sucesso.",
        title: "Lembrete enviado",
        type: NotificationType.REMINDER_SENT,
        userId: appointment.patient.user.id,
      },
    }),
  ]);

  return {
    logId: reminderLog.id,
    message: "Lembrete de WhatsApp simulado e registrado com sucesso.",
    reminderMessage,
    status: "success",
  };
}

export async function getReminderLogsForAppointment(appointmentId: string) {
  return prisma.whatsAppReminderLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,
      id: true,
      message: true,
      patientPhone: true,
      sentAt: true,
      status: true,
    },
    where: {
      appointmentId,
    },
  });
}

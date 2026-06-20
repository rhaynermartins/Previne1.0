import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import {
  AppointmentStatus,
  NotificationType,
  PrismaClient,
  ReminderStatus,
  UserRole,
} from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({
  adapter,
});

const passwordRounds = 10;

function daysFromToday(days: number) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);

  return date;
}

async function main() {
  const [adminPasswordHash, patientPasswordHash, dentistPasswordHash] =
    await Promise.all([
      bcrypt.hash("admin123", passwordRounds),
      bcrypt.hash("paciente123", passwordRounds),
      bcrypt.hash("dentista123", passwordRounds),
    ]);

  await prisma.healthCheck.upsert({
    where: {
      id: "phase-2-seed",
    },
    update: {
      status: "ok",
      metadata: {
        phase: "3",
        source: "seed",
      },
      checkedAt: new Date(),
    },
    create: {
      id: "phase-2-seed",
      status: "ok",
      metadata: {
        phase: "3",
        source: "seed",
      },
    },
  });

  const adminUser = await prisma.user.upsert({
    where: {
      email: "admin@novaprevine.com",
    },
    update: {
      name: "Administrador Nova Previne",
      passwordHash: adminPasswordHash,
      phone: "(31) 3333-0000",
      whatsapp: "(31) 99999-0000",
      role: UserRole.ADMIN,
    },
    create: {
      id: "user-admin-nova-previne",
      name: "Administrador Nova Previne",
      email: "admin@novaprevine.com",
      passwordHash: adminPasswordHash,
      phone: "(31) 3333-0000",
      whatsapp: "(31) 99999-0000",
      role: UserRole.ADMIN,
    },
  });

  const patientUser = await prisma.user.upsert({
    where: {
      email: "paciente@teste.com",
    },
    update: {
      name: "Paciente Teste",
      passwordHash: patientPasswordHash,
      phone: "(31) 3333-1010",
      whatsapp: "(31) 98888-1010",
      role: UserRole.PATIENT,
    },
    create: {
      id: "user-paciente-teste",
      name: "Paciente Teste",
      email: "paciente@teste.com",
      passwordHash: patientPasswordHash,
      phone: "(31) 3333-1010",
      whatsapp: "(31) 98888-1010",
      role: UserRole.PATIENT,
    },
  });

  const patientProfile = await prisma.patientProfile.upsert({
    where: {
      userId: patientUser.id,
    },
    update: {
      birthDate: new Date("1990-05-12T00:00:00.000Z"),
      document: "123.456.789-00",
      emergencyContact: "(31) 97777-1010",
      notes: "Paciente criado para validacao do ambiente de desenvolvimento.",
    },
    create: {
      id: "patient-profile-teste",
      userId: patientUser.id,
      birthDate: new Date("1990-05-12T00:00:00.000Z"),
      document: "123.456.789-00",
      emergencyContact: "(31) 97777-1010",
      notes: "Paciente criado para validacao do ambiente de desenvolvimento.",
    },
  });

  const serviceSeeds = [
    {
      id: "service-ortodontia",
      name: "Ortodontia",
      description:
        "Tratamentos para alinhamento dental, correcao da mordida e acompanhamento com aparelhos modernos.",
      durationMinutes: 60,
    },
    {
      id: "service-clareamento-dental",
      name: "Clareamento dental",
      description:
        "Protocolos seguros para devolver brilho ao sorriso com acompanhamento profissional.",
      durationMinutes: 50,
    },
    {
      id: "service-limpeza-prevencao",
      name: "Limpeza e prevencao",
      description:
        "Profilaxia, avaliacao preventiva e orientacoes para manter a saude bucal em dia.",
      durationMinutes: 45,
    },
    {
      id: "service-implantes",
      name: "Implantes",
      description:
        "Planejamento e reabilitacao com implantes dentarios para recuperar seguranca ao mastigar e sorrir.",
      durationMinutes: 90,
    },
    {
      id: "service-protese-dentaria",
      name: "Protese dentaria",
      description:
        "Reabilitacao oral com proteses personalizadas para funcao, estetica e conforto.",
      durationMinutes: 75,
    },
    {
      id: "service-avaliacao-odontologica",
      name: "Avaliacao odontologica",
      description:
        "Consulta inicial para entender o caso, avaliar necessidades e indicar o melhor tratamento.",
      durationMinutes: 40,
    },
  ];

  const services = await Promise.all(
    serviceSeeds.map((service) =>
      prisma.service.upsert({
        where: {
          name: service.name,
        },
        update: {
          description: service.description,
          durationMinutes: service.durationMinutes,
          active: true,
        },
        create: {
          ...service,
          active: true,
        },
      }),
    ),
  );

  const servicesById = new Map(
    services.map((service) => [service.id, service] as const),
  );

  const dentistSeeds = [
    {
      userId: "user-dentista-joao-almeida",
      profileId: "dentist-profile-joao-almeida",
      name: "Dr. Joao Almeida",
      email: "joao.almeida@novaprevine.com",
      phone: "(31) 3333-2001",
      whatsapp: "(31) 98888-2001",
      cro: "CRO-MG 12345",
      specialty: "Ortodontia",
      bio: "Especialista em ortodontia, alinhadores e planejamento preventivo para adultos e adolescentes.",
      photoUrl: "/images/dentists/joao-almeida.svg",
      availabilities: [
        {
          id: "availability-joao-monday",
          weekDay: 1,
          startTime: "08:00",
          endTime: "17:00",
          intervalStart: "12:00",
          intervalEnd: "13:00",
          appointmentDuration: 60,
        },
        {
          id: "availability-joao-wednesday",
          weekDay: 3,
          startTime: "08:00",
          endTime: "17:00",
          intervalStart: "12:00",
          intervalEnd: "13:00",
          appointmentDuration: 60,
        },
      ],
    },
    {
      userId: "user-dentista-marina-costa",
      profileId: "dentist-profile-marina-costa",
      name: "Dra. Marina Costa",
      email: "marina.costa@novaprevine.com",
      phone: "(31) 3333-2002",
      whatsapp: "(31) 98888-2002",
      cro: "CRO-MG 23456",
      specialty: "Estetica Dental",
      bio: "Dentista focada em clareamento, estetica do sorriso e atendimento humanizado.",
      photoUrl: "/images/dentists/marina-costa.svg",
      availabilities: [
        {
          id: "availability-marina-tuesday",
          weekDay: 2,
          startTime: "09:00",
          endTime: "18:00",
          intervalStart: "13:00",
          intervalEnd: "14:00",
          appointmentDuration: 50,
        },
        {
          id: "availability-marina-thursday",
          weekDay: 4,
          startTime: "09:00",
          endTime: "18:00",
          intervalStart: "13:00",
          intervalEnd: "14:00",
          appointmentDuration: 50,
        },
      ],
    },
    {
      userId: "user-dentista-pedro-henrique",
      profileId: "dentist-profile-pedro-henrique",
      name: "Dr. Pedro Henrique",
      email: "pedro.henrique@novaprevine.com",
      phone: "(31) 3333-2003",
      whatsapp: "(31) 98888-2003",
      cro: "CRO-MG 34567",
      specialty: "Implantodontia",
      bio: "Atua com implantes, proteses e reabilitacao oral integrada.",
      photoUrl: "/images/dentists/pedro-henrique.svg",
      availabilities: [
        {
          id: "availability-pedro-monday",
          weekDay: 1,
          startTime: "10:00",
          endTime: "19:00",
          intervalStart: "14:00",
          intervalEnd: "15:00",
          appointmentDuration: 90,
        },
        {
          id: "availability-pedro-friday",
          weekDay: 5,
          startTime: "08:00",
          endTime: "16:00",
          intervalStart: "12:00",
          intervalEnd: "13:00",
          appointmentDuration: 90,
        },
      ],
    },
  ];

  const dentistProfiles = [];

  for (const dentistSeed of dentistSeeds) {
    const user = await prisma.user.upsert({
      where: {
        email: dentistSeed.email,
      },
      update: {
        name: dentistSeed.name,
        passwordHash: dentistPasswordHash,
        phone: dentistSeed.phone,
        whatsapp: dentistSeed.whatsapp,
        role: UserRole.DENTIST,
      },
      create: {
        id: dentistSeed.userId,
        name: dentistSeed.name,
        email: dentistSeed.email,
        passwordHash: dentistPasswordHash,
        phone: dentistSeed.phone,
        whatsapp: dentistSeed.whatsapp,
        role: UserRole.DENTIST,
      },
    });

    const profile = await prisma.dentistProfile.upsert({
      where: {
        userId: user.id,
      },
      update: {
        cro: dentistSeed.cro,
        specialty: dentistSeed.specialty,
        bio: dentistSeed.bio,
        photoUrl: dentistSeed.photoUrl,
        phone: dentistSeed.phone,
        active: true,
      },
      create: {
        id: dentistSeed.profileId,
        userId: user.id,
        cro: dentistSeed.cro,
        specialty: dentistSeed.specialty,
        bio: dentistSeed.bio,
        photoUrl: dentistSeed.photoUrl,
        phone: dentistSeed.phone,
        active: true,
      },
    });

    for (const availability of dentistSeed.availabilities) {
      await prisma.dentistAvailability.upsert({
        where: {
          id: availability.id,
        },
        update: {
          dentistId: profile.id,
          weekDay: availability.weekDay,
          startTime: availability.startTime,
          endTime: availability.endTime,
          intervalStart: availability.intervalStart,
          intervalEnd: availability.intervalEnd,
          appointmentDuration: availability.appointmentDuration,
          active: true,
        },
        create: {
          ...availability,
          dentistId: profile.id,
          active: true,
        },
      });
    }

    dentistProfiles.push({
      ...dentistSeed,
      user,
      profile,
    });
  }

  const joao = dentistProfiles[0];
  const marina = dentistProfiles[1];
  const pedro = dentistProfiles[2];
  const avaliacao = servicesById.get("service-avaliacao-odontologica");
  const clareamento = servicesById.get("service-clareamento-dental");

  if (!joao || !marina || !pedro || !avaliacao || !clareamento) {
    throw new Error("Seed data is incomplete.");
  }

  await prisma.scheduleBlock.upsert({
    where: {
      id: "schedule-block-pedro-training",
    },
    update: {
      dentistId: pedro.profile.id,
      date: daysFromToday(14),
      startTime: "10:00",
      endTime: "12:00",
      reason: "Treinamento clinico interno",
    },
    create: {
      id: "schedule-block-pedro-training",
      dentistId: pedro.profile.id,
      date: daysFromToday(14),
      startTime: "10:00",
      endTime: "12:00",
      reason: "Treinamento clinico interno",
    },
  });

  await prisma.appointment.upsert({
    where: {
      id: "appointment-requested-paciente-joao",
    },
    update: {
      patientId: patientProfile.id,
      dentistId: joao.profile.id,
      serviceId: avaliacao.id,
      date: daysFromToday(7),
      startTime: "09:00",
      endTime: "09:40",
      status: AppointmentStatus.REQUESTED,
      caseDescription:
        "Paciente relata sensibilidade e deseja uma avaliacao preventiva completa.",
      refusalReason: null,
    },
    create: {
      id: "appointment-requested-paciente-joao",
      patientId: patientProfile.id,
      dentistId: joao.profile.id,
      serviceId: avaliacao.id,
      date: daysFromToday(7),
      startTime: "09:00",
      endTime: "09:40",
      status: AppointmentStatus.REQUESTED,
      caseDescription:
        "Paciente relata sensibilidade e deseja uma avaliacao preventiva completa.",
    },
  });

  const confirmedAppointment = await prisma.appointment.upsert({
    where: {
      id: "appointment-confirmed-paciente-marina",
    },
    update: {
      patientId: patientProfile.id,
      dentistId: marina.profile.id,
      serviceId: clareamento.id,
      date: daysFromToday(10),
      startTime: "14:00",
      endTime: "14:50",
      status: AppointmentStatus.CONFIRMED,
      caseDescription:
        "Paciente deseja avaliar clareamento dental antes de evento familiar.",
      refusalReason: null,
    },
    create: {
      id: "appointment-confirmed-paciente-marina",
      patientId: patientProfile.id,
      dentistId: marina.profile.id,
      serviceId: clareamento.id,
      date: daysFromToday(10),
      startTime: "14:00",
      endTime: "14:50",
      status: AppointmentStatus.CONFIRMED,
      caseDescription:
        "Paciente deseja avaliar clareamento dental antes de evento familiar.",
    },
  });

  await prisma.notification.upsert({
    where: {
      id: "notification-joao-new-request",
    },
    update: {
      userId: joao.user.id,
      title: "Nova solicitacao de consulta",
      message:
        "Paciente Teste solicitou uma avaliacao odontologica com descricao previa do caso.",
      read: false,
      type: NotificationType.APPOINTMENT_REQUESTED,
    },
    create: {
      id: "notification-joao-new-request",
      userId: joao.user.id,
      title: "Nova solicitacao de consulta",
      message:
        "Paciente Teste solicitou uma avaliacao odontologica com descricao previa do caso.",
      type: NotificationType.APPOINTMENT_REQUESTED,
    },
  });

  await prisma.notification.upsert({
    where: {
      id: "notification-patient-request-created",
    },
    update: {
      userId: patientUser.id,
      title: "Consulta solicitada",
      message: "Sua solicitacao foi enviada e aguarda confirmacao do dentista.",
      read: false,
      type: NotificationType.APPOINTMENT_REQUESTED,
    },
    create: {
      id: "notification-patient-request-created",
      userId: patientUser.id,
      title: "Consulta solicitada",
      message: "Sua solicitacao foi enviada e aguarda confirmacao do dentista.",
      type: NotificationType.APPOINTMENT_REQUESTED,
    },
  });

  await prisma.notification.upsert({
    where: {
      id: "notification-patient-confirmed",
    },
    update: {
      userId: patientUser.id,
      title: "Consulta confirmada",
      message: "Sua consulta com Dra. Marina Costa foi confirmada pela clinica.",
      read: false,
      type: NotificationType.APPOINTMENT_CONFIRMED,
    },
    create: {
      id: "notification-patient-confirmed",
      userId: patientUser.id,
      title: "Consulta confirmada",
      message: "Sua consulta com Dra. Marina Costa foi confirmada pela clinica.",
      type: NotificationType.APPOINTMENT_CONFIRMED,
    },
  });

  await prisma.whatsAppReminderLog.upsert({
    where: {
      id: "reminder-log-confirmed-marina",
    },
    update: {
      appointmentId: confirmedAppointment.id,
      patientPhone: patientUser.whatsapp ?? patientUser.phone ?? "",
      message:
        "Ola, Paciente Teste! Este e um lembrete da Clinica Nova Previne. Sua consulta com Dra. Marina Costa esta marcada. Esperamos voce!",
      status: ReminderStatus.SIMULATED,
      sentAt: new Date(),
      providerResponse: {
        provider: "simulated",
        phase: "3",
      },
    },
    create: {
      id: "reminder-log-confirmed-marina",
      appointmentId: confirmedAppointment.id,
      patientPhone: patientUser.whatsapp ?? patientUser.phone ?? "",
      message:
        "Ola, Paciente Teste! Este e um lembrete da Clinica Nova Previne. Sua consulta com Dra. Marina Costa esta marcada. Esperamos voce!",
      status: ReminderStatus.SIMULATED,
      sentAt: new Date(),
      providerResponse: {
        provider: "simulated",
        phase: "3",
      },
    },
  });

  await prisma.contactMessage.upsert({
    where: {
      id: "contact-message-seed",
    },
    update: {
      name: "Interessado em tratamento",
      email: "contato.exemplo@email.com",
      phone: "(31) 96666-3030",
      subject: "Duvida sobre implantes",
      message:
        "Gostaria de saber mais sobre avaliacao para implantes e horarios disponiveis.",
      read: false,
    },
    create: {
      id: "contact-message-seed",
      name: "Interessado em tratamento",
      email: "contato.exemplo@email.com",
      phone: "(31) 96666-3030",
      subject: "Duvida sobre implantes",
      message:
        "Gostaria de saber mais sobre avaliacao para implantes e horarios disponiveis.",
    },
  });

  await prisma.notification.upsert({
    where: {
      id: "notification-admin-contact-message",
    },
    update: {
      userId: adminUser.id,
      title: "Nova mensagem de contato",
      message:
        "Uma mensagem de contato de exemplo foi registrada para o painel administrativo.",
      read: false,
      type: NotificationType.CONTACT_MESSAGE,
    },
    create: {
      id: "notification-admin-contact-message",
      userId: adminUser.id,
      title: "Nova mensagem de contato",
      message:
        "Uma mensagem de contato de exemplo foi registrada para o painel administrativo.",
      type: NotificationType.CONTACT_MESSAGE,
    },
  });

  await prisma.notification.upsert({
    where: {
      id: "notification-patient-reminder-sent",
    },
    update: {
      userId: patientUser.id,
      title: "Lembrete preparado",
      message:
        "O lembrete de WhatsApp da sua consulta confirmada foi simulado com sucesso.",
      read: false,
      type: NotificationType.REMINDER_SENT,
    },
    create: {
      id: "notification-patient-reminder-sent",
      userId: patientUser.id,
      title: "Lembrete preparado",
      message:
        "O lembrete de WhatsApp da sua consulta confirmada foi simulado com sucesso.",
      type: NotificationType.REMINDER_SENT,
    },
  });

  console.log("Seed completed for Nova Previne phase 3.");
  console.log("Admin: admin@novaprevine.com / admin123");
  console.log("Patient: paciente@teste.com / paciente123");
  console.log("Dentists: joao.almeida@novaprevine.com / dentista123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

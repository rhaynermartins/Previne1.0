import type { NotificationType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export type DashboardNotification = {
  createdAt: Date;
  id: string;
  message: string;
  read: boolean;
  title: string;
  type: NotificationType;
};

export async function countUnreadNotifications(userId: string) {
  return prisma.notification.count({
    where: {
      read: false,
      userId,
    },
  });
}

export async function getUserNotifications(userId: string) {
  return prisma.notification.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,
      id: true,
      message: true,
      read: true,
      title: true,
      type: true,
    },
    take: 50,
    where: {
      userId,
    },
  });
}

export async function markNotificationReadForUser({
  notificationId,
  userId,
}: {
  notificationId: string;
  userId: string;
}) {
  const notification = await prisma.notification.findFirst({
    select: {
      id: true,
      read: true,
    },
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    return {
      message: "Notificacao nao encontrada para o seu usuario.",
      status: "error" as const,
    };
  }

  if (notification.read) {
    return {
      message: "Esta notificacao ja estava marcada como lida.",
      status: "success" as const,
    };
  }

  await prisma.notification.update({
    data: {
      read: true,
    },
    where: {
      id: notification.id,
    },
  });

  return {
    message: "Notificacao marcada como lida.",
    status: "success" as const,
  };
}

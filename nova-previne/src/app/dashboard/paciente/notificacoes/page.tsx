import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { NotificationsList } from "@/components/dashboard/notifications-list";
import { getCurrentAuthSession } from "@/lib/auth/session";
import {
  countUnreadNotifications,
  getUserNotifications,
} from "@/services/notificationService";

export const metadata: Metadata = {
  title: "Notificacoes do paciente | Nova Previne",
  description:
    "Central de notificacoes internas do paciente na Clinica Odontologica Nova Previne.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getNotificationData(userId: string) {
  try {
    const [notifications, unreadCount] = await Promise.all([
      getUserNotifications(userId),
      countUnreadNotifications(userId),
    ]);

    return {
      notifications,
      unreadCount,
    };
  } catch {
    return {
      notifications: [],
      unreadCount: 0,
    };
  }
}

export default async function PatientNotificationsPage() {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?next=/dashboard/paciente/notificacoes");
  }

  const { notifications, unreadCount } = await getNotificationData(
    session.user.id,
  );

  return (
    <NotificationsList
      homeHref="/dashboard/paciente"
      notifications={notifications}
      unreadCount={unreadCount}
    />
  );
}

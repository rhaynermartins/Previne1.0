"use server";

import { refresh, revalidatePath } from "next/cache";

import { getCurrentAuthSession } from "@/lib/auth/session";
import { markNotificationReadForUser } from "@/services/notificationService";

export type NotificationActionState = {
  message: string;
  status: "idle" | "success" | "error";
};

function getFormValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function revalidateNotificationViews() {
  revalidatePath("/dashboard/paciente", "layout");
  revalidatePath("/dashboard/dentista", "layout");
  revalidatePath("/dashboard/paciente/notificacoes");
  revalidatePath("/dashboard/dentista/notificacoes");
  refresh();
}

export async function markNotificationAsRead(
  _previousState: NotificationActionState,
  formData: FormData,
): Promise<NotificationActionState> {
  const session = await getCurrentAuthSession();

  if (!session) {
    return {
      message: "Entre na sua conta para gerenciar notificacoes.",
      status: "error",
    };
  }

  const notificationId = getFormValue(formData, "notificationId");

  if (!notificationId) {
    return {
      message: "Notificacao nao identificada.",
      status: "error",
    };
  }

  const result = await markNotificationReadForUser({
    notificationId,
    userId: session.user.id,
  });

  if (result.status === "success") {
    revalidateNotificationViews();
  }

  return result;
}

"use client";

import { CheckCheck } from "lucide-react";
import { useActionState } from "react";

import {
  markNotificationAsRead,
  type NotificationActionState,
} from "@/app/dashboard/notificacoes/actions";
import { Button } from "@/components/ui/button";

const initialState: NotificationActionState = {
  message: "",
  status: "idle",
};

function ActionMessage({ state }: { state: NotificationActionState }) {
  if (state.status === "idle") {
    return null;
  }

  return (
    <p
      className={
        state.status === "success"
          ? "text-sm font-semibold text-[#006b3d]"
          : "text-sm font-semibold text-[#991b1b]"
      }
      role={state.status === "success" ? "status" : "alert"}
    >
      {state.message}
    </p>
  );
}

export function NotificationReadAction({
  notificationId,
}: {
  notificationId: string;
}) {
  const [state, formAction, pending] = useActionState(
    markNotificationAsRead,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-2 sm:justify-items-end">
      <input name="notificationId" type="hidden" value={notificationId} />
      <Button
        className="w-full sm:w-auto"
        icon={<CheckCheck aria-hidden="true" className="size-4" />}
        isLoading={pending}
        type="submit"
        variant="secondary"
      >
        {pending ? "Marcando" : "Marcar como lida"}
      </Button>
      <ActionMessage state={state} />
    </form>
  );
}

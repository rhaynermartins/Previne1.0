import {
  Bell,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Mail,
  MailOpen,
  MessageCircle,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";

import { NotificationReadAction } from "@/components/dashboard/notification-read-action";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  NotificationType,
  type NotificationType as NotificationTypeValue,
} from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { DashboardNotification } from "@/services/notificationService";

type NotificationsListProps = {
  homeHref: string;
  notifications: DashboardNotification[];
  unreadCount: number;
};

const notificationTypeMeta: Record<
  NotificationTypeValue,
  {
    icon: ReactNode;
    label: string;
    tone: "amber" | "blue" | "gray" | "green" | "red";
  }
> = {
  [NotificationType.APPOINTMENT_REQUESTED]: {
    icon: <CalendarClock aria-hidden="true" className="size-5" />,
    label: "Consulta solicitada",
    tone: "amber",
  },
  [NotificationType.APPOINTMENT_CONFIRMED]: {
    icon: <CalendarCheck aria-hidden="true" className="size-5" />,
    label: "Consulta confirmada",
    tone: "green",
  },
  [NotificationType.APPOINTMENT_REFUSED]: {
    icon: <XCircle aria-hidden="true" className="size-5" />,
    label: "Consulta recusada",
    tone: "red",
  },
  [NotificationType.APPOINTMENT_CANCELLED]: {
    icon: <XCircle aria-hidden="true" className="size-5" />,
    label: "Consulta cancelada",
    tone: "red",
  },
  [NotificationType.APPOINTMENT_COMPLETED]: {
    icon: <ClipboardCheck aria-hidden="true" className="size-5" />,
    label: "Consulta concluida",
    tone: "green",
  },
  [NotificationType.REMINDER_SENT]: {
    icon: <MessageCircle aria-hidden="true" className="size-5" />,
    label: "Lembrete enviado",
    tone: "blue",
  },
  [NotificationType.CONTACT_MESSAGE]: {
    icon: <Mail aria-hidden="true" className="size-5" />,
    label: "Mensagem de contato",
    tone: "blue",
  },
  [NotificationType.SYSTEM]: {
    icon: <Bell aria-hidden="true" className="size-5" />,
    label: "Sistema",
    tone: "gray",
  },
};

const iconTones = {
  amber: "border-[#fde68a] bg-[#fffbeb] text-[#92400e]",
  blue: "border-[#b9e4f4] bg-light-blue text-primary-blue",
  gray: "border-[#e5e7eb] bg-gray-light text-gray-text",
  green: "border-[#b7ead3] bg-light-green text-primary-green",
  red: "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]",
};

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

function NotificationCard({
  notification,
}: {
  notification: DashboardNotification;
}) {
  const meta = notificationTypeMeta[notification.type];

  return (
    <Card
      className={cn(
        "grid gap-5",
        !notification.read && "border-primary-blue bg-light-blue/25",
      )}
      padding="lg"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="flex min-w-0 items-start gap-4">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-lg border",
              iconTones[meta.tone],
            )}
          >
            {meta.icon}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={meta.tone}>{meta.label}</Badge>
              <Badge variant={notification.read ? "gray" : "green"}>
                {notification.read ? "Lida" : "Nao lida"}
              </Badge>
            </div>
            <h3 className="mt-3 break-words text-xl font-bold text-dark-blue">
              {notification.title}
            </h3>
            <p className="mt-2 break-words text-sm leading-6 text-gray-text">
              {notification.message}
            </p>
            <p className="mt-3 text-xs font-semibold text-gray-text">
              Recebida em {formatDateTime(notification.createdAt)}
            </p>
          </div>
        </div>

        {notification.read ? (
          <div className="flex items-center gap-2 rounded-lg border border-[#b7ead3] bg-light-green px-3 py-2 text-sm font-semibold text-[#006b3d]">
            <CheckCircle2 aria-hidden="true" className="size-4" />
            Lida
          </div>
        ) : (
          <NotificationReadAction notificationId={notification.id} />
        )}
      </div>
    </Card>
  );
}

export function NotificationsList({
  homeHref,
  notifications,
  unreadCount,
}: NotificationsListProps) {
  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Notificacoes internas
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Acompanhe as atualizacoes da sua conta.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Veja avisos sobre consultas, lembretes e mensagens relevantes da
              Nova Previne em um historico simples e organizado.
            </p>
          </div>

          <div className="rounded-lg border border-[#b9e4f4] bg-light-blue p-4 text-sm font-semibold text-dark-blue lg:text-right">
            {unreadCount} {unreadCount === 1 ? "nao lida" : "nao lidas"}
          </div>
        </div>
      </Card>

      {notifications.length > 0 ? (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      ) : (
        <Card padding="lg">
          <div className="rounded-lg border border-dashed border-[#b9e4f4] bg-light-blue/60 p-6">
            <MailOpen aria-hidden="true" className="size-10 text-primary-blue" />
            <h3 className="mt-4 text-xl font-bold text-dark-blue">
              Nenhuma notificacao encontrada.
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-text">
              Quando houver mudancas em consultas ou avisos internos, eles
              aparecerao nesta central.
            </p>
            <ButtonLink
              className="mt-5 w-full sm:w-auto"
              href={homeHref}
              variant="secondary"
            >
              Voltar ao dashboard
            </ButtonLink>
          </div>
        </Card>
      )}
    </section>
  );
}

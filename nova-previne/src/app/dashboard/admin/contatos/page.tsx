import { CheckCircle2, Mail, MessageSquare, Phone } from "lucide-react";
import type { Metadata } from "next";

import { markContactMessageAsRead } from "@/app/dashboard/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Contatos | Administração Nova Previne",
  description:
    "Mensagens de contato recebidas pela Clínica Odontológica Nova Previne.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

function formatValue(value?: string | null) {
  return value?.trim() ? value : "Não informado";
}

async function getContactMessages() {
  return prisma.contactMessage.findMany({
    orderBy: [
      {
        read: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    select: {
      createdAt: true,
      email: true,
      id: true,
      message: true,
      name: true,
      phone: true,
      read: true,
      subject: true,
    },
  });
}

export default async function AdminContactMessagesPage() {
  const messages = await getContactMessages();
  const unreadCount = messages.filter((message) => !message.read).length;

  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Mensagens de contato
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              Acompanhe contatos enviados pelo site.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              Mensagens não lidas ficam no topo para facilitar o retorno da
              equipe administrativa.
            </p>
          </div>

          <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] p-4 text-sm font-semibold text-[#92400e] lg:text-right">
            {unreadCount} pendentes
          </div>
        </div>
      </Card>

      {messages.length > 0 ? (
        <div className="grid gap-4">
          {messages.map((message) => (
            <Card
              className={!message.read ? "border-primary-blue bg-light-blue/25" : ""}
              key={message.id}
              padding="lg"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
                    <MessageSquare aria-hidden="true" className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={message.read ? "gray" : "amber"}>
                        {message.read ? "Lida" : "Não lida"}
                      </Badge>
                      <p className="text-xs font-semibold text-gray-text">
                        {formatDateTime(message.createdAt)}
                      </p>
                    </div>
                    <h3 className="mt-3 break-words text-xl font-bold text-dark-blue">
                      {message.subject}
                    </h3>
                    <p className="mt-1 break-words text-sm leading-6 text-gray-text">
                      {message.name}
                    </p>
                  </div>
                </div>

                {!message.read && (
                  <form action={markContactMessageAsRead}>
                    <input name="messageId" type="hidden" value={message.id} />
                    <Button
                      className="w-full sm:w-auto"
                      icon={<CheckCircle2 aria-hidden="true" className="size-4" />}
                      type="submit"
                      variant="success"
                    >
                      Marcar como lida
                    </Button>
                  </form>
                )}
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
                  <Mail
                    aria-hidden="true"
                    className="size-5 text-primary-blue"
                  />
                  <p className="mt-3 text-xs font-bold text-dark-blue">E-mail</p>
                  <p className="mt-1 break-all text-sm text-gray-text">
                    {message.email}
                  </p>
                </div>
                <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
                  <Phone
                    aria-hidden="true"
                    className="size-5 text-primary-green"
                  />
                  <p className="mt-3 text-xs font-bold text-dark-blue">Telefone</p>
                  <p className="mt-1 break-words text-sm text-gray-text">
                    {formatValue(message.phone)}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-[#d9ebf2] bg-white p-4">
                <p className="text-xs font-bold text-dark-blue">Mensagem</p>
                <p className="mt-2 break-words text-sm leading-6 text-gray-text">
                  {message.message}
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="lg">
          <div className="rounded-lg border border-dashed border-[#b9e4f4] bg-light-blue/60 p-6">
            <MessageSquare
              aria-hidden="true"
              className="size-10 text-primary-blue"
            />
            <h3 className="mt-4 text-xl font-bold text-dark-blue">
              Nenhuma mensagem encontrada.
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-text">
              Contatos enviados pelo formulário público aparecerão aqui.
            </p>
          </div>
        </Card>
      )}
    </section>
  );
}

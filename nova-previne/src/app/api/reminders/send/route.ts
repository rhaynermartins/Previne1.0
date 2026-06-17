import { NextResponse } from "next/server";

import { UserRole } from "@/generated/prisma/enums";
import { getCurrentAuthSession } from "@/lib/auth/session";
import { sendWhatsAppReminder } from "@/services/whatsappService";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getCurrentAuthSession();

  if (!session || session.user.role !== UserRole.DENTIST) {
    return NextResponse.json(
      {
        message: "Entre como dentista para enviar lembretes.",
      },
      {
        status: 401,
      },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    appointmentId?: unknown;
  } | null;
  const appointmentId =
    typeof body?.appointmentId === "string" ? body.appointmentId.trim() : "";

  if (!appointmentId) {
    return NextResponse.json(
      {
        message: "Consulta nao identificada para envio de lembrete.",
      },
      {
        status: 400,
      },
    );
  }

  const result = await sendWhatsAppReminder({
    appointmentId,
    dentistUserId: session.user.id,
  });

  return NextResponse.json(result, {
    status: result.status === "success" ? 200 : 400,
  });
}

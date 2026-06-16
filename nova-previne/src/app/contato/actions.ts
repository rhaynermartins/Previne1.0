"use server";

import { prisma } from "@/lib/prisma";

export type ContactFormState = {
  message: string;
  status: "idle" | "success" | "error";
};

function getFormValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function createContactMessage(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = getFormValue(formData, "name");
  const email = getFormValue(formData, "email");
  const phone = getFormValue(formData, "phone");
  const subject = getFormValue(formData, "subject");
  const message = getFormValue(formData, "message");

  if (!name || !email || !subject || !message || !isValidEmail(email)) {
    return {
      message: "Revise os campos obrigatórios e informe um e-mail válido.",
      status: "error",
    };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        email,
        message,
        name,
        phone: phone || null,
        subject,
      },
    });

    return {
      message:
        "Sua mensagem foi enviada com sucesso. A Nova Previne entrará em contato em breve.",
      status: "success",
    };
  } catch {
    return {
      message:
        "Não foi possível enviar a mensagem agora. Tente novamente em instantes ou fale pelo WhatsApp.",
      status: "error",
    };
  }
}

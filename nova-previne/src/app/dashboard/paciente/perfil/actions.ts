"use server";

import { revalidatePath } from "next/cache";

import { UserRole } from "@/generated/prisma/enums";
import {
  getCurrentAuthSession,
  setAuthSessionCookie,
} from "@/lib/auth/session";
import {
  isValidEmail,
  normalizeEmail,
  normalizeOptionalText,
} from "@/lib/auth/validation";
import { prisma } from "@/lib/prisma";

export type PatientProfileEditValues = {
  birthDate: string;
  document: string;
  email: string;
  emergencyContact: string;
  name: string;
  notes: string;
  phone: string;
  whatsapp: string;
};

export type PatientProfileEditState = {
  errors: Partial<Record<keyof PatientProfileEditValues, string>>;
  message: string;
  status: "idle" | "success" | "error";
  values: PatientProfileEditValues;
};

function getFormValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function parseBirthDate(value: string) {
  if (!value) {
    return null;
  }

  const birthDate = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  return birthDate;
}

function validatePatientProfileEdit(formData: FormData): PatientProfileEditState {
  const values: PatientProfileEditValues = {
    birthDate: getFormValue(formData, "birthDate"),
    document: getFormValue(formData, "document"),
    email: normalizeEmail(getFormValue(formData, "email")),
    emergencyContact: getFormValue(formData, "emergencyContact"),
    name: getFormValue(formData, "name"),
    notes: getFormValue(formData, "notes"),
    phone: getFormValue(formData, "phone"),
    whatsapp: getFormValue(formData, "whatsapp"),
  };
  const errors: PatientProfileEditState["errors"] = {};

  if (values.name.length < 3) {
    errors.name = "Informe seu nome completo.";
  }

  if (!isValidEmail(values.email)) {
    errors.email = "Informe um e-mail válido.";
  }

  if (!values.whatsapp) {
    errors.whatsapp = "Informe um WhatsApp para contato da clínica.";
  }

  if (values.birthDate) {
    const birthDate = parseBirthDate(values.birthDate);

    if (!birthDate || birthDate > new Date()) {
      errors.birthDate = "Informe uma data de nascimento válida.";
    }
  }

  if (values.notes.length > 700) {
    errors.notes = "Use no máximo 700 caracteres.";
  }

  return {
    errors,
    message:
      Object.keys(errors).length > 0
        ? "Revise os campos destacados para atualizar seu perfil."
        : "",
    status: Object.keys(errors).length > 0 ? "error" : "idle",
    values,
  };
}

export async function updatePatientProfile(
  _previousState: PatientProfileEditState,
  formData: FormData,
): Promise<PatientProfileEditState> {
  const session = await getCurrentAuthSession();
  const validationState = validatePatientProfileEdit(formData);

  if (!session || session.user.role !== UserRole.PATIENT) {
    return {
      ...validationState,
      message: "Entre como paciente para atualizar seu perfil.",
      status: "error",
    };
  }

  if (validationState.status === "error") {
    return validationState;
  }

  const birthDate = parseBirthDate(validationState.values.birthDate);
  const document = normalizeOptionalText(validationState.values.document);

  const existingEmailUser = await prisma.user.findUnique({
    select: {
      id: true,
    },
    where: {
      email: validationState.values.email,
    },
  });

  if (existingEmailUser && existingEmailUser.id !== session.user.id) {
    return {
      ...validationState,
      errors: {
        email: "Já existe uma conta cadastrada com este e-mail.",
      },
      message: "Use outro e-mail para atualizar seu perfil.",
      status: "error",
    };
  }

  if (document) {
    const existingDocument = await prisma.patientProfile.findUnique({
      select: {
        userId: true,
      },
      where: {
        document,
      },
    });

    if (existingDocument && existingDocument.userId !== session.user.id) {
      return {
        ...validationState,
        errors: {
          document: "Já existe um paciente cadastrado com este documento.",
        },
        message: "Revise o documento informado para atualizar seu perfil.",
        status: "error",
      };
    }
  }

  try {
    await prisma.$transaction([
      prisma.user.update({
        data: {
          email: validationState.values.email,
          name: validationState.values.name,
          phone: normalizeOptionalText(validationState.values.phone),
          whatsapp: validationState.values.whatsapp,
        },
        where: {
          id: session.user.id,
        },
      }),
      prisma.patientProfile.upsert({
        create: {
          birthDate,
          document,
          emergencyContact: normalizeOptionalText(
            validationState.values.emergencyContact,
          ),
          notes: normalizeOptionalText(validationState.values.notes),
          userId: session.user.id,
        },
        update: {
          birthDate,
          document,
          emergencyContact: normalizeOptionalText(
            validationState.values.emergencyContact,
          ),
          notes: normalizeOptionalText(validationState.values.notes),
        },
        where: {
          userId: session.user.id,
        },
      }),
    ]);

    await setAuthSessionCookie({
      email: validationState.values.email,
      id: session.user.id,
      name: validationState.values.name,
      role: session.user.role,
    });

    revalidatePath("/dashboard/paciente");
    revalidatePath("/dashboard/paciente/perfil");

    return {
      errors: {},
      message: "Perfil atualizado com sucesso.",
      status: "success",
      values: validationState.values,
    };
  } catch {
    return {
      ...validationState,
      message:
        "Não foi possível atualizar seu perfil agora. Tente novamente em instantes.",
      status: "error",
    };
  }
}

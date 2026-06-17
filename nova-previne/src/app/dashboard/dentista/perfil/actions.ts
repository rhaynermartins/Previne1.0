"use server";

import { revalidatePath } from "next/cache";

import { UserRole } from "@/generated/prisma/enums";
import { getCurrentAuthSession } from "@/lib/auth/session";
import { normalizeOptionalText } from "@/lib/auth/validation";
import { prisma } from "@/lib/prisma";

export type DentistProfileEditValues = {
  bio: string;
  cro: string;
  phone: string;
  photoUrl: string;
  specialty: string;
};

export type DentistProfileEditState = {
  errors: Partial<Record<keyof DentistProfileEditValues, string>>;
  message: string;
  status: "idle" | "success" | "error";
  values: DentistProfileEditValues;
};

function getFormValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function normalizeCro(value: string) {
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

function isValidPhotoUrl(value: string) {
  if (!value) {
    return true;
  }

  if (value.startsWith("/")) {
    return true;
  }

  try {
    new URL(value);

    return true;
  } catch {
    return false;
  }
}

function validateDentistProfileEdit(formData: FormData): DentistProfileEditState {
  const values: DentistProfileEditValues = {
    bio: getFormValue(formData, "bio"),
    cro: normalizeCro(getFormValue(formData, "cro")),
    phone: getFormValue(formData, "phone"),
    photoUrl: getFormValue(formData, "photoUrl"),
    specialty: getFormValue(formData, "specialty"),
  };
  const errors: DentistProfileEditState["errors"] = {};

  if (values.cro.length < 6) {
    errors.cro = "Informe seu CRO com estado e numeração.";
  }

  if (values.specialty.length < 3) {
    errors.specialty = "Informe sua especialidade principal.";
  }

  if (values.bio && values.bio.length < 40) {
    errors.bio = "Escreva uma bio um pouco mais completa ou deixe o campo vazio.";
  }

  if (values.bio.length > 900) {
    errors.bio = "Use no máximo 900 caracteres.";
  }

  if (!isValidPhotoUrl(values.photoUrl)) {
    errors.photoUrl = "Informe uma URL válida ou um caminho iniciado por /.";
  }

  return {
    errors,
    message:
      Object.keys(errors).length > 0
        ? "Revise os campos destacados para atualizar seu perfil profissional."
        : "",
    status: Object.keys(errors).length > 0 ? "error" : "idle",
    values,
  };
}

export async function updateDentistProfile(
  _previousState: DentistProfileEditState,
  formData: FormData,
): Promise<DentistProfileEditState> {
  const session = await getCurrentAuthSession();
  const validationState = validateDentistProfileEdit(formData);

  if (!session || session.user.role !== UserRole.DENTIST) {
    return {
      ...validationState,
      message: "Entre como dentista para atualizar seu perfil profissional.",
      status: "error",
    };
  }

  if (validationState.status === "error") {
    return validationState;
  }

  const existingProfile = await prisma.dentistProfile.findUnique({
    select: {
      id: true,
      userId: true,
    },
    where: {
      cro: validationState.values.cro,
    },
  });

  if (existingProfile && existingProfile.userId !== session.user.id) {
    return {
      ...validationState,
      errors: {
        cro: "Já existe um dentista cadastrado com este CRO.",
      },
      message: "Revise o CRO informado para atualizar seu perfil.",
      status: "error",
    };
  }

  try {
    await prisma.dentistProfile.upsert({
      create: {
        bio: normalizeOptionalText(validationState.values.bio),
        cro: validationState.values.cro,
        phone: normalizeOptionalText(validationState.values.phone),
        photoUrl: normalizeOptionalText(validationState.values.photoUrl),
        specialty: validationState.values.specialty,
        userId: session.user.id,
      },
      update: {
        bio: normalizeOptionalText(validationState.values.bio),
        cro: validationState.values.cro,
        phone: normalizeOptionalText(validationState.values.phone),
        photoUrl: normalizeOptionalText(validationState.values.photoUrl),
        specialty: validationState.values.specialty,
      },
      where: {
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/dentista");
    revalidatePath("/dashboard/dentista/perfil");

    return {
      errors: {},
      message: "Perfil profissional atualizado com sucesso.",
      status: "success",
      values: validationState.values,
    };
  } catch {
    return {
      ...validationState,
      message:
        "Não foi possível atualizar seu perfil profissional agora. Tente novamente em instantes.",
      status: "error",
    };
  }
}

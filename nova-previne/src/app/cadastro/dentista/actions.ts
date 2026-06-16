"use server";

import { UserRole } from "@/generated/prisma/enums";
import { hashPassword } from "@/lib/auth/password";
import {
  isValidEmail,
  normalizeEmail,
  normalizeOptionalText,
  validatePasswordStrength,
} from "@/lib/auth/validation";
import { prisma } from "@/lib/prisma";

type DentistRegisterValues = {
  bio: string;
  cro: string;
  email: string;
  name: string;
  phone: string;
  photoUrl: string;
  specialty: string;
  whatsapp: string;
};

export type DentistRegisterState = {
  errors: Partial<
    Record<keyof DentistRegisterValues | "confirmPassword" | "password", string>
  >;
  message: string;
  status: "idle" | "success" | "error";
  values: DentistRegisterValues;
};

const emptyDentistRegisterValues: DentistRegisterValues = {
  bio: "",
  cro: "",
  email: "",
  name: "",
  phone: "",
  photoUrl: "",
  specialty: "",
  whatsapp: "",
};

function getFormValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function normalizeCro(value: string) {
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

function validateDentistRegister(formData: FormData): DentistRegisterState {
  const password = getFormValue(formData, "password");
  const confirmPassword = getFormValue(formData, "confirmPassword");
  const values: DentistRegisterValues = {
    bio: getFormValue(formData, "bio"),
    cro: normalizeCro(getFormValue(formData, "cro")),
    email: normalizeEmail(getFormValue(formData, "email")),
    name: getFormValue(formData, "name"),
    phone: getFormValue(formData, "phone"),
    photoUrl: getFormValue(formData, "photoUrl"),
    specialty: getFormValue(formData, "specialty"),
    whatsapp: getFormValue(formData, "whatsapp"),
  };
  const errors: DentistRegisterState["errors"] = {};

  if (values.name.length < 3) {
    errors.name = "Informe seu nome profissional completo.";
  }

  if (!isValidEmail(values.email)) {
    errors.email = "Informe um e-mail válido.";
  }

  if (!values.whatsapp) {
    errors.whatsapp = "Informe um WhatsApp profissional para contato.";
  }

  if (values.cro.length < 6) {
    errors.cro = "Informe seu CRO com estado e numeração.";
  }

  if (values.specialty.length < 3) {
    errors.specialty = "Informe sua especialidade principal.";
  }

  if (values.bio && values.bio.length < 40) {
    errors.bio = "Escreva uma bio um pouco mais completa ou deixe o campo vazio.";
  }

  if (values.photoUrl && !values.photoUrl.startsWith("/")) {
    try {
      new URL(values.photoUrl);
    } catch {
      errors.photoUrl = "Informe uma URL válida ou um caminho iniciado por /.";
    }
  }

  const passwordErrors = validatePasswordStrength(password);

  if (passwordErrors.length > 0) {
    errors.password = passwordErrors.join(" ");
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "As senhas informadas não conferem.";
  }

  return {
    errors,
    message:
      Object.keys(errors).length > 0
        ? "Revise os campos destacados para concluir seu cadastro profissional."
        : "",
    status: Object.keys(errors).length > 0 ? "error" : "idle",
    values,
  };
}

export async function registerDentist(
  _previousState: DentistRegisterState,
  formData: FormData,
): Promise<DentistRegisterState> {
  const validationState = validateDentistRegister(formData);

  if (validationState.status === "error") {
    return validationState;
  }

  const password = getFormValue(formData, "password");

  const existingUser = await prisma.user.findUnique({
    where: {
      email: validationState.values.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return {
      ...validationState,
      errors: {
        email: "Já existe uma conta cadastrada com este e-mail.",
      },
      message: "Use outro e-mail para criar um novo cadastro profissional.",
      status: "error",
    };
  }

  const existingCro = await prisma.dentistProfile.findUnique({
    where: {
      cro: validationState.values.cro,
    },
    select: {
      id: true,
    },
  });

  if (existingCro) {
    return {
      ...validationState,
      errors: {
        cro: "Já existe um dentista cadastrado com este CRO.",
      },
      message: "Revise o CRO informado para concluir seu cadastro.",
      status: "error",
    };
  }

  try {
    const passwordHash = await hashPassword(password);
    const professionalPhone =
      normalizeOptionalText(validationState.values.phone) ??
      validationState.values.whatsapp;

    await prisma.user.create({
      data: {
        dentistProfile: {
          create: {
            active: false,
            bio: normalizeOptionalText(validationState.values.bio),
            cro: validationState.values.cro,
            phone: professionalPhone,
            photoUrl: normalizeOptionalText(validationState.values.photoUrl),
            specialty: validationState.values.specialty,
          },
        },
        email: validationState.values.email,
        name: validationState.values.name,
        passwordHash,
        phone: normalizeOptionalText(validationState.values.phone),
        role: UserRole.DENTIST,
        whatsapp: validationState.values.whatsapp,
      },
    });

    return {
      errors: {},
      message:
        "Cadastro profissional criado com sucesso. A clínica poderá revisar seus dados antes da exibição pública.",
      status: "success",
      values: emptyDentistRegisterValues,
    };
  } catch {
    return {
      ...validationState,
      message:
        "Não foi possível criar seu cadastro profissional agora. Tente novamente em instantes.",
      status: "error",
    };
  }
}

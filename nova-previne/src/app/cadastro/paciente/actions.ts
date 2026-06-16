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

type PatientRegisterValues = {
  birthDate: string;
  document: string;
  email: string;
  emergencyContact: string;
  name: string;
  notes: string;
  phone: string;
  whatsapp: string;
};

export type PatientRegisterState = {
  errors: Partial<Record<keyof PatientRegisterValues | "confirmPassword" | "password", string>>;
  message: string;
  status: "idle" | "success" | "error";
  values: PatientRegisterValues;
};

const emptyPatientRegisterValues: PatientRegisterValues = {
  birthDate: "",
  document: "",
  email: "",
  emergencyContact: "",
  name: "",
  notes: "",
  phone: "",
  whatsapp: "",
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

function validatePatientRegister(formData: FormData): PatientRegisterState {
  const password = getFormValue(formData, "password");
  const confirmPassword = getFormValue(formData, "confirmPassword");
  const values: PatientRegisterValues = {
    birthDate: getFormValue(formData, "birthDate"),
    document: getFormValue(formData, "document"),
    email: normalizeEmail(getFormValue(formData, "email")),
    emergencyContact: getFormValue(formData, "emergencyContact"),
    name: getFormValue(formData, "name"),
    notes: getFormValue(formData, "notes"),
    phone: getFormValue(formData, "phone"),
    whatsapp: getFormValue(formData, "whatsapp"),
  };
  const errors: PatientRegisterState["errors"] = {};

  if (values.name.length < 3) {
    errors.name = "Informe seu nome completo.";
  }

  if (!isValidEmail(values.email)) {
    errors.email = "Informe um e-mail válido.";
  }

  if (!values.whatsapp) {
    errors.whatsapp = "Informe um WhatsApp para contato da clínica.";
  }

  if (!values.birthDate) {
    errors.birthDate = "Informe sua data de nascimento.";
  } else {
    const birthDate = parseBirthDate(values.birthDate);

    if (!birthDate || birthDate > new Date()) {
      errors.birthDate = "Informe uma data de nascimento válida.";
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
        ? "Revise os campos destacados para concluir seu cadastro."
        : "",
    status: Object.keys(errors).length > 0 ? "error" : "idle",
    values,
  };
}

export async function registerPatient(
  _previousState: PatientRegisterState,
  formData: FormData,
): Promise<PatientRegisterState> {
  const validationState = validatePatientRegister(formData);

  if (validationState.status === "error") {
    return validationState;
  }

  const password = getFormValue(formData, "password");
  const birthDate = parseBirthDate(validationState.values.birthDate);
  const document = normalizeOptionalText(validationState.values.document);

  if (!birthDate) {
    return {
      ...validationState,
      errors: {
        birthDate: "Informe uma data de nascimento válida.",
      },
      message: "Revise os campos destacados para concluir seu cadastro.",
      status: "error",
    };
  }

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
      message: "Use outro e-mail para criar um novo cadastro de paciente.",
      status: "error",
    };
  }

  if (document) {
    const existingDocument = await prisma.patientProfile.findUnique({
      where: {
        document,
      },
      select: {
        id: true,
      },
    });

    if (existingDocument) {
      return {
        ...validationState,
        errors: {
          document: "Já existe um paciente cadastrado com este documento.",
        },
        message: "Revise o documento informado para concluir seu cadastro.",
        status: "error",
      };
    }
  }

  try {
    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: {
        email: validationState.values.email,
        name: validationState.values.name,
        passwordHash,
        patientProfile: {
          create: {
            birthDate,
            document,
            emergencyContact: normalizeOptionalText(
              validationState.values.emergencyContact,
            ),
            notes: normalizeOptionalText(validationState.values.notes),
          },
        },
        phone: normalizeOptionalText(validationState.values.phone),
        role: UserRole.PATIENT,
        whatsapp: validationState.values.whatsapp,
      },
    });

    return {
      errors: {},
      message:
        "Cadastro de paciente criado com sucesso. Guarde seu e-mail e senha para acessar sua conta.",
      status: "success",
      values: emptyPatientRegisterValues,
    };
  } catch {
    return {
      ...validationState,
      message:
        "Não foi possível criar seu cadastro agora. Tente novamente em instantes.",
      status: "error",
    };
  }
}

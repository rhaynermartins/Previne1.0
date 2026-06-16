"use server";

import { redirect } from "next/navigation";

import {
  clearAuthSessionCookie,
  setAuthSessionCookie,
} from "@/lib/auth/session";
import { verifyUserCredentials } from "@/lib/auth/users";
import { isValidEmail, normalizeEmail } from "@/lib/auth/validation";

type LoginValues = {
  email: string;
};

export type LoginFormState = {
  authenticatedUser?: {
    name: string;
    role: string;
  };
  errors: Partial<Record<keyof LoginValues | "password", string>>;
  message: string;
  status: "idle" | "success" | "error";
  values: LoginValues;
};

function getFormValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

export async function login(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = normalizeEmail(getFormValue(formData, "email"));
  const password = getFormValue(formData, "password");
  const values = {
    email,
  };

  if (!isValidEmail(email) || !password) {
    return {
      errors: {
        ...(!isValidEmail(email) && { email: "Informe um e-mail válido." }),
        ...(!password && { password: "Informe sua senha." }),
      },
      message: "Revise os campos destacados para entrar na sua conta.",
      status: "error",
      values,
    };
  }

  try {
    const user = await verifyUserCredentials(email, password);

    if (!user) {
      return {
        errors: {
          email: "Confira o e-mail informado.",
          password: "Confira sua senha.",
        },
        message: "Não encontramos uma conta com essas credenciais.",
        status: "error",
        values,
      };
    }

    await setAuthSessionCookie(user);

    return {
      authenticatedUser: {
        name: user.name,
        role: user.role,
      },
      errors: {},
      message: "Login realizado com sucesso.",
      status: "success",
      values,
    };
  } catch {
    return {
      errors: {},
      message: "Não foi possível entrar agora. Tente novamente em instantes.",
      status: "error",
      values,
    };
  }
}

export async function logout() {
  await clearAuthSessionCookie();
  redirect("/login");
}

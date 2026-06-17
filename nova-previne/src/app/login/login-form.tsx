"use client";

import { LogIn, LogOut, ShieldCheck } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

import { login, logout, type LoginFormState } from "./actions";

type CurrentUser = {
  email: string;
  name: string;
  role: string;
};

const initialLoginFormState: LoginFormState = {
  errors: {},
  message: "",
  status: "idle",
  values: {
    email: "",
  },
};

const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  DENTIST: "Dentista",
  PATIENT: "Paciente",
};

function StatusMessage({ state }: { state: LoginFormState }) {
  if (state.status === "idle") {
    return null;
  }

  return (
    <Alert
      title={state.status === "success" ? "Acesso confirmado" : "Não foi possível entrar"}
      variant={state.status === "success" ? "success" : "error"}
    >
      <p className="font-semibold">{state.message}</p>
      {state.authenticatedUser && (
        <span className="mt-1 block font-normal">
          Você entrou como {state.authenticatedUser.name}.
        </span>
      )}
    </Alert>
  );
}

function ActiveSessionCard({ user }: { user: CurrentUser }) {
  return (
    <div className="mb-6 rounded-lg border border-[#b7ead3] bg-light-green p-4">
      <div className="flex items-start gap-3">
        <ShieldCheck
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-primary-green"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-dark-blue">Sessão ativa</p>
          <p className="mt-1 text-sm leading-6 text-gray-text">
            {user.name} está conectado como {roleLabels[user.role] ?? user.role}.
          </p>
          <p className="truncate text-sm text-gray-text">{user.email}</p>
        </div>
      </div>
      <form action={logout} className="mt-4">
        <Button
          className="w-full"
          icon={<LogOut aria-hidden="true" className="size-4" />}
          type="submit"
          variant="secondary"
        >
          Sair da conta
        </Button>
      </form>
    </div>
  );
}

export function LoginForm({ currentUser }: { currentUser?: CurrentUser | null }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(login, initialLoginFormState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const activeUser =
    currentUser ??
    (state.authenticatedUser
      ? {
          email: state.values.email,
          name: state.authenticatedUser.name,
          role: state.authenticatedUser.role,
        }
      : null);

  return (
    <Card className="w-full" padding="lg">
      {activeUser && <ActiveSessionCard user={activeUser} />}

      <div className="mb-6" aria-live="polite">
        <StatusMessage state={state} />
      </div>

      <form action={formAction} className="grid gap-5" ref={formRef}>
        <Input
          autoComplete="email"
          defaultValue={state.values.email}
          error={state.errors.email}
          label="E-mail"
          maxLength={160}
          name="email"
          placeholder="voce@email.com"
          required
          type="email"
        />

        <Input
          autoComplete="current-password"
          error={state.errors.password}
          label="Senha"
          maxLength={72}
          name="password"
          placeholder="Informe sua senha"
          required
          type="password"
        />

        <Button
          className="w-full"
          icon={<LogIn aria-hidden="true" className="size-4" />}
          isLoading={pending}
          size="lg"
          type="submit"
          variant="primary"
        >
          {pending ? "Entrando" : "Entrar na conta"}
        </Button>
      </form>
    </Card>
  );
}

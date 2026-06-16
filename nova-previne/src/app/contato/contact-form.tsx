"use client";

import { Send } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { createContactMessage, type ContactFormState } from "./actions";

const initialContactFormState: ContactFormState = {
  message: "",
  status: "idle",
};

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    createContactMessage,
    initialContactFormState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <Card id="formulario" padding="lg">
      {state.status !== "idle" && (
        <div
          className={
            state.status === "success"
              ? "mb-6 rounded-lg border border-[#b7ead3] bg-light-green p-4 text-sm font-semibold text-[#006b3d]"
              : "mb-6 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-sm font-semibold text-[#991b1b]"
          }
          role={state.status === "success" ? "status" : "alert"}
        >
          {state.message}
        </div>
      )}

      <form action={formAction} className="grid gap-5" ref={formRef}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            autoComplete="name"
            label="Nome"
            maxLength={120}
            name="name"
            placeholder="Seu nome completo"
            required
          />
          <Input
            autoComplete="email"
            label="E-mail"
            maxLength={160}
            name="email"
            placeholder="voce@email.com"
            required
            type="email"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            autoComplete="tel"
            helperText="Opcional, mas ajuda no retorno da clínica."
            label="Telefone ou WhatsApp"
            maxLength={40}
            name="phone"
            placeholder="(31) 99999-0000"
            type="tel"
          />
          <Select label="Assunto" name="subject" required defaultValue="">
            <option disabled value="">
              Selecione um assunto
            </option>
            <option value="Agendamento de avaliação">Agendamento de avaliação</option>
            <option value="Dúvida sobre tratamentos">
              Dúvida sobre tratamentos
            </option>
            <option value="Informações sobre dentistas">
              Informações sobre dentistas
            </option>
            <option value="Contato institucional">Contato institucional</option>
          </Select>
        </div>

        <Textarea
          helperText="Descreva brevemente como a equipe pode ajudar."
          label="Mensagem"
          maxLength={1200}
          name="message"
          placeholder="Conte sua dúvida, necessidade ou melhor horário para retorno."
          required
          rows={6}
        />

        <Button
          className="w-full"
          icon={<Send aria-hidden="true" className="size-4" />}
          isLoading={pending}
          size="lg"
          type="submit"
          variant="success"
        >
          {pending ? "Enviando mensagem" : "Enviar mensagem"}
        </Button>
      </form>
    </Card>
  );
}

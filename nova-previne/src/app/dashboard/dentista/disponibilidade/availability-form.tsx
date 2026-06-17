"use client";

import { Clock, Save } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

import {
  createDentistAvailability,
  updateDentistAvailability,
  type AvailabilityEditState,
  type AvailabilityEditValues,
} from "./actions";

const weekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const emptyValues: AvailabilityEditValues = {
  active: true,
  appointmentDuration: "60",
  availabilityId: "",
  endTime: "",
  intervalEnd: "",
  intervalStart: "",
  startTime: "",
  weekDay: "1",
};

type AvailabilityFormProps = {
  initialValues?: AvailabilityEditValues;
  mode: "create" | "edit";
  surface?: "card" | "panel";
};

function StatusMessage({ state }: { state: AvailabilityEditState }) {
  if (state.status === "idle") {
    return null;
  }

  return (
    <div
      className={
        state.status === "success"
          ? "rounded-lg border border-[#b7ead3] bg-light-green p-4 text-sm font-semibold text-[#006b3d]"
          : "rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-sm font-semibold text-[#991b1b]"
      }
      role={state.status === "success" ? "status" : "alert"}
    >
      {state.message}
    </div>
  );
}

export function AvailabilityForm({
  initialValues,
  mode,
  surface = "card",
}: AvailabilityFormProps) {
  const action =
    mode === "create" ? createDentistAvailability : updateDentistAvailability;
  const initialState: AvailabilityEditState = {
    errors: {},
    message: "",
    status: "idle",
    values: initialValues ?? emptyValues,
  };
  const [state, formAction, pending] = useActionState(action, initialState);
  const title =
    mode === "create" ? "Cadastrar novo horário" : "Editar horário disponível";
  const description =
    mode === "create"
      ? "Informe um dia da semana e o período em que você atende pacientes."
      : "Ajuste os dados deste período sem alterar outros horários da agenda.";

  const content = (
    <>
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#cfe2ec] bg-light-blue p-4">
        <Clock
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-primary-blue"
        />
        <div>
          <p className="font-semibold text-dark-blue">{title}</p>
          <p className="mt-1 text-sm leading-6 text-gray-text">{description}</p>
        </div>
      </div>

      <div className="mb-6" aria-live="polite">
        <StatusMessage state={state} />
      </div>

      <form action={formAction} className="grid gap-5">
        <input
          name="availabilityId"
          type="hidden"
          value={state.values.availabilityId}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            defaultValue={state.values.weekDay}
            error={state.errors.weekDay}
            label="Dia da semana"
            name="weekDay"
            required
          >
            {weekDays.map((day, index) => (
              <option key={day} value={index}>
                {day}
              </option>
            ))}
          </Select>

          <Input
            defaultValue={state.values.appointmentDuration}
            error={state.errors.appointmentDuration}
            helperText="Duração padrão da consulta em minutos."
            label="Duração da consulta"
            max={240}
            min={15}
            name="appointmentDuration"
            required
            step={5}
            type="number"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            defaultValue={state.values.startTime}
            error={state.errors.startTime}
            label="Início do atendimento"
            name="startTime"
            required
            type="time"
          />
          <Input
            defaultValue={state.values.endTime}
            error={state.errors.endTime}
            label="Fim do atendimento"
            name="endTime"
            required
            type="time"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            defaultValue={state.values.intervalStart}
            error={state.errors.intervalStart}
            helperText="Opcional. Use com o fim do intervalo."
            label="Início do intervalo"
            name="intervalStart"
            type="time"
          />
          <Input
            defaultValue={state.values.intervalEnd}
            error={state.errors.intervalEnd}
            helperText="Opcional. Use com o início do intervalo."
            label="Fim do intervalo"
            name="intervalEnd"
            type="time"
          />
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-[#d9ebf2] bg-surface p-4 text-sm font-semibold text-dark-blue">
          <input
            className="mt-1 size-4 accent-primary-green"
            defaultChecked={state.values.active}
            name="active"
            type="checkbox"
          />
          <span>
            Horário ativo
            <span className="mt-1 block font-normal leading-6 text-gray-text">
              Horários inativos continuam cadastrados, mas não devem ser usados
              para novas solicitações.
            </span>
          </span>
        </label>

        <Button
          className="w-full sm:w-fit"
          icon={<Save aria-hidden="true" className="size-4" />}
          isLoading={pending}
          size="lg"
          type="submit"
          variant={mode === "create" ? "success" : "primary"}
        >
          {pending
            ? "Salvando horário"
            : mode === "create"
              ? "Cadastrar horário"
              : "Salvar alterações"}
        </Button>
      </form>
    </>
  );

  if (surface === "panel") {
    return (
      <div className="rounded-lg border border-[#d9ebf2] bg-white p-4">
        {content}
      </div>
    );
  }

  return <Card padding="lg">{content}</Card>;
}

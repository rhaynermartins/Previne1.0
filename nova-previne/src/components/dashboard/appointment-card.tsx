import {
  CalendarDays,
  Clock,
  FileText,
  Stethoscope,
  UserRound,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { AppointmentStatus } from "@/generated/prisma/enums";
import { PatientAppointmentActions } from "@/components/dashboard/patient-appointment-actions";

type AppointmentCardProps = {
  appointment: {
    caseDescription: string;
    date: Date;
    dentistName: string;
    dentistSpecialty: string;
    endTime: string;
    id?: string;
    refusalReason?: string | null;
    serviceName: string;
    startTime: string;
    status: AppointmentStatus;
  };
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <Card padding="lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
              <Stethoscope aria-hidden="true" className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-primary-green">Consulta</p>
              <h3 className="mt-1 break-words text-xl font-bold text-dark-blue">
                {appointment.serviceName}
              </h3>
            </div>
          </div>
        </div>

        <div className="self-start">
          <StatusBadge status={appointment.status} />
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
          <div className="flex items-start gap-3">
            <CalendarDays
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary-blue"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-dark-blue">Data</p>
              <p className="mt-1 break-words text-sm leading-6 text-gray-text">
                {formatDate(appointment.date)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4">
          <div className="flex items-start gap-3">
            <Clock
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary-green"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-dark-blue">Horário</p>
              <p className="mt-1 text-sm leading-6 text-gray-text">
                {appointment.startTime} às {appointment.endTime}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#d9ebf2] bg-surface p-4 md:col-span-2">
          <div className="flex items-start gap-3">
            <UserRound
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary-blue"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-dark-blue">Dentista</p>
              <p className="mt-1 break-words text-sm font-semibold leading-6 text-dark-blue">
                Dr(a). {appointment.dentistName}
              </p>
              <p className="break-words text-sm leading-6 text-gray-text">
                {appointment.dentistSpecialty}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-[#d9ebf2] bg-white p-4">
        <div className="flex items-start gap-3">
          <FileText
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-primary-green"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-dark-blue">Descrição enviada</p>
            <p className="mt-1 break-words text-sm leading-6 text-gray-text">
              {appointment.caseDescription}
            </p>
          </div>
        </div>
      </div>

      {appointment.refusalReason?.trim() && (
        <div className="mt-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4">
          <div className="flex items-start gap-3">
            <FileText
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-[#b42318]"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#991b1b]">
                Motivo da recusa
              </p>
              <p className="mt-1 break-words text-sm leading-6 text-gray-text">
                {appointment.refusalReason}
              </p>
            </div>
          </div>
        </div>
      )}

      {appointment.id && (
        <PatientAppointmentActions
          appointmentId={appointment.id}
          status={appointment.status}
        />
      )}
    </Card>
  );
}

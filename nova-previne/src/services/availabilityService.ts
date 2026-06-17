import { AppointmentStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

type TimeRange = {
  endTime: string;
  startTime: string;
};

export type AvailableAppointmentSlot = {
  availabilityId: string;
  endTime: string;
  startTime: string;
};

export type AvailabilityLookupResult = {
  dentistActive: boolean;
  serviceActive: boolean;
  slots: AvailableAppointmentSlot[];
};

export function parseTimeToMinutes(value: string) {
  if (!timePattern.test(value)) {
    return null;
  }

  const [hours, minutes] = value.split(":").map(Number);

  if (hours === undefined || minutes === undefined) {
    return null;
  }

  return hours * 60 + minutes;
}

export function formatMinutesAsTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function parseScheduleDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function formatScheduleDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
}

export function getTodayScheduleDate() {
  const today = new Date();

  today.setUTCHours(0, 0, 0, 0);

  return today;
}

function rangesOverlap(first: TimeRange, second: TimeRange) {
  const firstStart = parseTimeToMinutes(first.startTime);
  const firstEnd = parseTimeToMinutes(first.endTime);
  const secondStart = parseTimeToMinutes(second.startTime);
  const secondEnd = parseTimeToMinutes(second.endTime);

  if (
    firstStart === null ||
    firstEnd === null ||
    secondStart === null ||
    secondEnd === null
  ) {
    return false;
  }

  return firstStart < secondEnd && firstEnd > secondStart;
}

function isInsideInterval({
  endTime,
  intervalEnd,
  intervalStart,
  startTime,
}: {
  endTime: string;
  intervalEnd?: string | null;
  intervalStart?: string | null;
  startTime: string;
}) {
  if (!intervalStart || !intervalEnd) {
    return false;
  }

  return rangesOverlap(
    {
      endTime,
      startTime,
    },
    {
      endTime: intervalEnd,
      startTime: intervalStart,
    },
  );
}

export async function getAvailableAppointmentSlots({
  date,
  dentistId,
  serviceId,
}: {
  date: Date;
  dentistId: string;
  serviceId: string;
}): Promise<AvailabilityLookupResult> {
  const [dentist, service] = await Promise.all([
    prisma.dentistProfile.findUnique({
      select: {
        active: true,
        availabilities: {
          orderBy: {
            startTime: "asc",
          },
          select: {
            appointmentDuration: true,
            endTime: true,
            id: true,
            intervalEnd: true,
            intervalStart: true,
            startTime: true,
          },
          where: {
            active: true,
            weekDay: date.getUTCDay(),
          },
        },
      },
      where: {
        id: dentistId,
      },
    }),
    prisma.service.findUnique({
      select: {
        active: true,
        durationMinutes: true,
      },
      where: {
        id: serviceId,
      },
    }),
  ]);

  if (!dentist?.active || !service?.active) {
    return {
      dentistActive: Boolean(dentist?.active),
      serviceActive: Boolean(service?.active),
      slots: [],
    };
  }

  const [appointments, scheduleBlocks] = await Promise.all([
    prisma.appointment.findMany({
      select: {
        endTime: true,
        startTime: true,
      },
      where: {
        date,
        dentistId,
        status: {
          in: [
            AppointmentStatus.REQUESTED,
            AppointmentStatus.CONFIRMED,
            AppointmentStatus.REFUSED,
            AppointmentStatus.CANCELLED,
            AppointmentStatus.COMPLETED,
          ],
        },
      },
    }),
    prisma.scheduleBlock.findMany({
      select: {
        endTime: true,
        startTime: true,
      },
      where: {
        date,
        dentistId,
      },
    }),
  ]);
  const occupiedRanges = [...appointments, ...scheduleBlocks];
  const slotsByStartTime = new Map<string, AvailableAppointmentSlot>();

  for (const availability of dentist.availabilities) {
    const startMinutes = parseTimeToMinutes(availability.startTime);
    const endMinutes = parseTimeToMinutes(availability.endTime);
    const stepMinutes = Math.max(availability.appointmentDuration, 15);

    if (startMinutes === null || endMinutes === null) {
      continue;
    }

    for (
      let slotStartMinutes = startMinutes;
      slotStartMinutes + service.durationMinutes <= endMinutes;
      slotStartMinutes += stepMinutes
    ) {
      const startTime = formatMinutesAsTime(slotStartMinutes);
      const endTime = formatMinutesAsTime(
        slotStartMinutes + service.durationMinutes,
      );
      const slotRange = {
        endTime,
        startTime,
      };
      const overlapsInterval = isInsideInterval({
        endTime,
        intervalEnd: availability.intervalEnd,
        intervalStart: availability.intervalStart,
        startTime,
      });
      const overlapsOccupiedRange = occupiedRanges.some((range) =>
        rangesOverlap(slotRange, range),
      );

      if (!overlapsInterval && !overlapsOccupiedRange) {
        slotsByStartTime.set(`${startTime}-${endTime}`, {
          availabilityId: availability.id,
          endTime,
          startTime,
        });
      }
    }
  }

  return {
    dentistActive: true,
    serviceActive: true,
    slots: Array.from(slotsByStartTime.values()).sort((first, second) =>
      first.startTime.localeCompare(second.startTime),
    ),
  };
}

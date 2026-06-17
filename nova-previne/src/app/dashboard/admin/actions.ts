"use server";

import { refresh, revalidatePath } from "next/cache";

import { UserRole } from "@/generated/prisma/enums";
import { getCurrentAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

function getFormValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

async function requireAdminSession() {
  const session = await getCurrentAuthSession();

  if (!session || session.user.role !== UserRole.ADMIN) {
    throw new Error("Ação restrita ao administrador.");
  }

  return session;
}

function revalidateAdminViews() {
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/dentistas");
  revalidatePath("/dashboard/admin/servicos");
  revalidatePath("/dashboard/admin/contatos");
  refresh();
}

export async function toggleDentistActive(formData: FormData) {
  await requireAdminSession();

  const dentistId = getFormValue(formData, "dentistId");
  const active = getFormValue(formData, "active") === "true";

  if (!dentistId) {
    return;
  }

  await prisma.dentistProfile.update({
    data: {
      active,
    },
    where: {
      id: dentistId,
    },
  });

  revalidateAdminViews();
}

export async function createService(formData: FormData) {
  await requireAdminSession();

  const name = normalizeText(getFormValue(formData, "name"));
  const description = normalizeText(getFormValue(formData, "description"));
  const durationMinutes = Number(getFormValue(formData, "durationMinutes"));

  if (!name || !description || !Number.isInteger(durationMinutes)) {
    return;
  }

  if (durationMinutes < 10 || durationMinutes > 300) {
    return;
  }

  await prisma.service.create({
    data: {
      description,
      durationMinutes,
      name,
    },
  });

  revalidateAdminViews();
}

export async function updateService(formData: FormData) {
  await requireAdminSession();

  const serviceId = getFormValue(formData, "serviceId");
  const name = normalizeText(getFormValue(formData, "name"));
  const description = normalizeText(getFormValue(formData, "description"));
  const durationMinutes = Number(getFormValue(formData, "durationMinutes"));

  if (!serviceId || !name || !description || !Number.isInteger(durationMinutes)) {
    return;
  }

  if (durationMinutes < 10 || durationMinutes > 300) {
    return;
  }

  await prisma.service.update({
    data: {
      description,
      durationMinutes,
      name,
    },
    where: {
      id: serviceId,
    },
  });

  revalidateAdminViews();
}

export async function toggleServiceActive(formData: FormData) {
  await requireAdminSession();

  const serviceId = getFormValue(formData, "serviceId");
  const active = getFormValue(formData, "active") === "true";

  if (!serviceId) {
    return;
  }

  await prisma.service.update({
    data: {
      active,
    },
    where: {
      id: serviceId,
    },
  });

  revalidateAdminViews();
}

export async function markContactMessageAsRead(formData: FormData) {
  await requireAdminSession();

  const messageId = getFormValue(formData, "messageId");

  if (!messageId) {
    return;
  }

  await prisma.contactMessage.update({
    data: {
      read: true,
    },
    where: {
      id: messageId,
    },
  });

  revalidateAdminViews();
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { UserRole } from "@/generated/prisma/enums";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Container } from "@/components/ui/container";
import { getCurrentAuthSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Dashboard do paciente | Nova Previne",
  description:
    "Área do paciente da Clínica Odontológica Nova Previne para acompanhar dados e consultas.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function PatientDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?next=/dashboard/paciente");
  }

  if (session.user.role !== UserRole.PATIENT) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-surface">
      <Container className="grid gap-4 py-4 sm:gap-5 sm:py-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-8">
        <DashboardSidebar />
        <div className="grid min-w-0 gap-5">
          <DashboardHeader
            user={{
              email: session.user.email,
              name: session.user.name,
            }}
          />
          {children}
        </div>
      </Container>
    </main>
  );
}

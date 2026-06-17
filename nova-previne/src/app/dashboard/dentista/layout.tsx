import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  DashboardSidebar,
  dentistNavItems,
} from "@/components/dashboard/dashboard-sidebar";
import { Container } from "@/components/ui/container";
import { UserRole } from "@/generated/prisma/enums";
import { getCurrentAuthSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Dashboard do dentista | Nova Previne",
  description:
    "Área profissional do dentista da Clínica Odontológica Nova Previne.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DentistDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?next=/dashboard/dentista");
  }

  if (session.user.role !== UserRole.DENTIST) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-surface">
      <Container className="grid gap-4 py-4 sm:gap-5 sm:py-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-8">
        <DashboardSidebar
          areaLabel="Área do dentista"
          homeHref="/dashboard/dentista"
          navLabel="Navegação do dashboard do dentista"
          navItems={dentistNavItems}
        />
        <div className="grid min-w-0 gap-5">
          <DashboardHeader
            roleLabel="Dentista"
            sessionLabel="Sessão profissional ativa em"
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

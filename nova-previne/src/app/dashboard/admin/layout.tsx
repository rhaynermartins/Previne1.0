import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  adminNavItems,
  DashboardSidebar,
} from "@/components/dashboard/dashboard-sidebar";
import { Container } from "@/components/ui/container";
import { UserRole } from "@/generated/prisma/enums";
import { getCurrentAuthSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Dashboard administrativo | Nova Previne",
  description:
    "Área administrativa da Clínica Odontológica Nova Previne para acompanhamento gerencial.",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?next=/dashboard/admin");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  return (
    <main className="dashboard-surface min-h-[calc(100vh-80px)]">
      <Container className="grid gap-4 py-4 sm:gap-5 sm:py-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-8">
        <DashboardSidebar
          areaLabel="Área administrativa"
          homeHref="/dashboard/admin"
          navLabel="Navegação do dashboard administrativo"
          navItems={adminNavItems}
        />
        <div className="grid min-w-0 gap-5">
          <DashboardHeader
            roleLabel="Administrador"
            sessionLabel="Sessão administrativa ativa em"
            showNotifications={false}
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

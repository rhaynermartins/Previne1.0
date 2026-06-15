import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nova Previne",
  description:
    "Sistema web da Clinica Odontologica Nova Previne para atendimento, agendamento e gestao clinica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}

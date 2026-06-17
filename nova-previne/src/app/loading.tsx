import { LoaderCircle } from "lucide-react";

import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-surface">
      <Container className="grid min-h-[calc(100vh-80px)] place-items-center py-12">
        <div className="w-full max-w-md rounded-lg border border-[#d9ebf2] bg-white p-6 text-center shadow-[var(--shadow-card)]">
          <span className="mx-auto flex size-14 items-center justify-center rounded-lg border border-[#b9e4f4] bg-light-blue text-primary-blue">
            <LoaderCircle aria-hidden="true" className="size-7 animate-spin" />
          </span>
          <h1 className="mt-5 text-xl font-bold text-dark-blue">
            Carregando a Nova Previne
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-text">
            Estamos preparando as informações da sua experiência clínica.
          </p>
        </div>
      </Container>
    </main>
  );
}

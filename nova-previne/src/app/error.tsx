"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-surface">
      <Container className="grid min-h-[calc(100vh-80px)] place-items-center py-12">
        <div className="w-full max-w-lg rounded-lg border border-[#fecaca] bg-white p-6 text-center shadow-[var(--shadow-card)]">
          <span className="mx-auto flex size-14 items-center justify-center rounded-lg border border-[#fecaca] bg-[#fef2f2] text-[#b42318]">
            <AlertTriangle aria-hidden="true" className="size-7" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-dark-blue">
            Não foi possível carregar esta área
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-text">
            Tente novamente em instantes. Se o problema continuar, entre em contato
            com a clínica para receber orientação.
          </p>
          <Button
            className="mt-6 w-full sm:w-auto"
            icon={<RotateCcw aria-hidden="true" className="size-4" />}
            onClick={() => unstable_retry()}
            variant="primary"
          >
            Tentar novamente
          </Button>
        </div>
      </Container>
    </main>
  );
}

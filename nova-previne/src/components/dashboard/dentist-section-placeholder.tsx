import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

type DentistSectionPlaceholderProps = {
  description: string;
  icon: LucideIcon;
  taskLabel: string;
  title: string;
};

export function DentistSectionPlaceholder({
  description,
  icon: Icon,
  taskLabel,
  title,
}: DentistSectionPlaceholderProps) {
  return (
    <section className="grid gap-5">
      <Card padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold text-primary-green">
              Dashboard do dentista
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-dark-blue sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-text">
              {description}
            </p>
          </div>

          <span className="flex size-14 items-center justify-center rounded-lg bg-light-blue text-primary-blue">
            <Icon aria-hidden="true" className="size-7" />
          </span>
        </div>
      </Card>

      <Card className="flex items-start gap-4" padding="lg">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-light-green text-primary-green">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div>
          <p className="text-base font-bold text-dark-blue">{taskLabel}</p>
          <p className="mt-1 text-sm leading-6 text-gray-text">
            Esta tela está conectada à navegação do dentista e será preenchida
            conforme a evolução do painel profissional.
          </p>
        </div>
      </Card>
    </section>
  );
}

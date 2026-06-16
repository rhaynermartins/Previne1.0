import { Badge } from "@/components/ui/badge";

const statusConfig = {
  REQUESTED: {
    label: "Solicitada",
    variant: "amber",
  },
  CONFIRMED: {
    label: "Confirmada",
    variant: "green",
  },
  REFUSED: {
    label: "Recusada",
    variant: "red",
  },
  CANCELLED: {
    label: "Cancelada",
    variant: "gray",
  },
  COMPLETED: {
    label: "Concluída",
    variant: "blue",
  },
} as const;

type StatusBadgeProps = {
  status: keyof typeof statusConfig;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

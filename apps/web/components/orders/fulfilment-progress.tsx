import type { OrderStatus } from "@repo/schemas";
import { cn } from "@repo/ui/cn";
import {
  IconCheck,
  IconPackage,
  IconReceipt2,
  IconTruck,
} from "@tabler/icons-react";

const steps = [
  { status: "PLACED", label: "Placed", icon: IconReceipt2 },
  { status: "PACKED", label: "Packed", icon: IconPackage },
  { status: "SHIPPED", label: "Shipped", icon: IconTruck },
] as const;

const statusIndex: Record<OrderStatus, number> = {
  PLACED: 0,
  PACKED: 1,
  SHIPPED: 2,
  CANCELLED: -1,
};

export function FulfilmentProgress({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="border-destructive/20 bg-destructive/5 text-destructive border-y px-4 py-3 text-sm">
        This order was cancelled. Reserved stock has been restored.
      </div>
    );
  }

  const current = statusIndex[status];

  return (
    <ol className="grid grid-cols-3 divide-x divide-border border-y">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        const Icon = step.icon;

        return (
          <li
            key={step.status}
            className={cn(
              "flex items-center gap-2.5 px-3 py-3",
              !done && !active && "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border",
                done
                  ? "border-primary bg-primary text-primary-foreground"
                  : active
                    ? "border-primary text-primary"
                    : "border-border",
              )}
            >
              {done ? (
                <IconCheck className="size-3.5" />
              ) : (
                <Icon className="size-3.5" />
              )}
            </span>
            <span className="text-xs font-medium">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

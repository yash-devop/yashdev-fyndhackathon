import type { OrderStatus } from "@repo/schemas";
import { Badge } from "@repo/ui/badge";
import { cn } from "@repo/ui/cn";

const statusStyles: Record<OrderStatus, string> = {
  PLACED: "border-transparent bg-secondary text-secondary-foreground",
  PACKED: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  SHIPPED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  CANCELLED: "border-destructive/20 bg-destructive/10 text-destructive",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const label = status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <Badge variant="outline" className={cn("gap-1.5", statusStyles[status])}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
    </Badge>
  );
}

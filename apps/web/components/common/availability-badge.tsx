import { Badge } from "@repo/ui/badge";
import { cn } from "@repo/ui/cn";
import { getStockState } from "@/lib/stock";

export function AvailabilityBadge({ stock }: { stock: number }) {
  const state = getStockState(stock);

  const styles = {
    in: "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 ring-emerald-200  dark:ring-emerald-800/60",
    low: "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 ring-amber-200  dark:ring-amber-300/30",
    out: "border-transparent bg-muted text-muted-foreground ring-neutral-200 dark:ring-neutral-600/60",
  } as const;

  const labels = {
    in: "In stock",
    low: "Low stock",
    out: "Out of stock",
  } as const;

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 rounded-sm px-2.5 text-xs font-medium ring",
        styles[state],
      )}
    >
      {labels[state]}
    </Badge>
  );
}

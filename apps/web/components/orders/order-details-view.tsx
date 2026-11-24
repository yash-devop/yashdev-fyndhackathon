"use client";

import {
  IconClipboardList,
  IconPackage,
  IconTruck,
  IconX,
} from "@tabler/icons-react";
import { AxiosError } from "axios";
import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { RecordTable, RecordTableRow } from "@repo/ui/record-table";
import { useState } from "react";
import { NoResultsIllustration } from "@/components/common/no-results-illustration";
import { OrderStatusBadge } from "@/components/common/order-status-badge";
import { PageHeader } from "@/components/common/page-header";
import { StatePanel } from "@/components/common/state-panel";
import { FulfilmentProgress } from "@/components/orders/fulfilment-progress";
import { useOrder } from "@/hooks/use-order";
import { useUpdateOrderStatus } from "@/hooks/use-update-order-status";
import { getApiErrorMessage } from "@/lib/api/error";
import { formatCurrency } from "@/lib/format-currency";
import { formatDateTime } from "@/lib/format-date";

const grid =
  "md:grid-cols-[minmax(0,1.8fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)]";

const columns = [
  { key: "product", header: "Product" },
  { key: "quantity", header: "Quantity" },
  { key: "unit-price", header: "Unit price" },
  { key: "subtotal", header: "Subtotal" },
];

export function OrderDetailsView({ id }: { id: string }) {
  const { data: order, isPending, isError, error, refetch } = useOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const [cancelOpen, setCancelOpen] = useState(false);

  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="h-16 w-full animate-pulse rounded bg-muted" />
        <div className="h-72 w-full animate-pulse rounded bg-muted" />
      </div>
    );
  }

  const notFound =
    error instanceof AxiosError && error.response?.status === 404;

  if (isError || !order) {
    return (
      <StatePanel
        illustration={<NoResultsIllustration />}
        title={notFound ? "Order not found" : "Couldn't load order"}
        description={
          notFound
            ? "This order may have been removed or the link is incorrect."
            : getApiErrorMessage(error, "The order is unavailable right now.")
        }
        action={
          notFound ? undefined : (
            <Button variant="outline" onClick={() => void refetch()}>
              Retry
            </Button>
          )
        }
      />
    );
  }

  const canPack = order.status === "PLACED";
  const canShip = order.status === "PACKED";
  const canCancel = order.status === "PLACED" || order.status === "PACKED";

  return (
    <>
      <PageHeader
        title={order.reference}
        description={`Placed ${formatDateTime(order.createdAt)}`}
        actions={
          <>
            {canPack ? (
              <Button
                disabled={updateStatus.isPending}
                onClick={() =>
                  updateStatus.mutate({ id, input: { status: "PACKED" } })
                }
              >
                <IconPackage />
                Mark packed
              </Button>
            ) : null}
            {canShip ? (
              <Button
                disabled={updateStatus.isPending}
                onClick={() =>
                  updateStatus.mutate({ id, input: { status: "SHIPPED" } })
                }
              >
                <IconTruck />
                Mark shipped
              </Button>
            ) : null}
            {canCancel ? (
              <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
                <DialogTrigger
                  render={
                    <Button
                      variant="destructive"
                      disabled={updateStatus.isPending}
                    />
                  }
                >
                  <IconX />
                  Cancel order
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel this order?</DialogTitle>
                    <DialogDescription>
                      Stock for every item will be restored. This action cannot
                      be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>
                      Keep order
                    </DialogClose>
                    <Button
                      variant="destructive"
                      disabled={updateStatus.isPending}
                      onClick={() => {
                        updateStatus.mutate({
                          id,
                          input: { status: "CANCELLED" },
                        });
                        setCancelOpen(false);
                      }}
                    >
                      Cancel order
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : null}
          </>
        }
      />

      <FulfilmentProgress status={order.status} />

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="min-w-0">
          <h2 className="pb-2 text-sm font-medium">Purchased items</h2>
          <RecordTable grid={grid} columns={columns} className="mt-4">
            {order.items.map((item) => (
              <RecordTableRow key={item.id}>
                <div role="cell" className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground">
                    <IconPackage
                      className="size-5"
                      stroke={1.75}
                      aria-hidden="true"
                    />
                  </span>
                  <p className="text-foreground truncate font-medium text-sm">
                    {item.productName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 md:contents">
                  <div
                    role="cell"
                    className="flex items-baseline justify-between gap-2 text-sm md:block"
                  >
                    <span className="text-muted-foreground md:hidden">
                      Quantity
                    </span>
                    <span className="tabular-nums text-sm">
                      {item.quantity}
                    </span>
                  </div>
                  <div
                    role="cell"
                    className="flex items-baseline justify-between gap-2 text-sm md:block"
                  >
                    <span className="text-muted-foreground md:hidden">
                      Unit price
                    </span>
                    <span className="tabular-nums text-sm">
                      {formatCurrency(item.priceAtPurchase)}
                    </span>
                  </div>
                  <div
                    role="cell"
                    className="col-span-2 flex items-baseline justify-between gap-2 text-sm md:col-span-1 md:block"
                  >
                    <span className="text-muted-foreground md:hidden">
                      Subtotal
                    </span>
                    <span className="tabular-nums text-sm">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                </div>
              </RecordTableRow>
            ))}
            <RecordTableRow className="bg-muted/40 font-medium hover:bg-muted/40">
              <div role="cell" className="hidden md:col-span-3 md:block">
                Total
              </div>
              <div
                role="cell"
                className="flex items-baseline justify-between gap-2 md:block"
              >
                <span className="text-muted-foreground md:hidden">Total</span>
                <span className="tabular-nums">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </RecordTableRow>
          </RecordTable>
        </section>

        <aside className="@container min-w-0 space-y-4">
          <section className="overflow-hidden rounded-[calc(var(--radius-xl)+var(--spacing))] border border-border/60 bg-card shadow-xs">
            <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-muted/20 px-4 py-3">
              <h2 className="text-sm font-medium">Order information</h2>
              <OrderStatusBadge status={order.status} />
            </div>
            <dl className="grid gap-x-6 gap-y-5 px-4 py-5 text-sm @sm:grid-cols-2">
              <div className="min-w-0">
                <dt className="text-muted-foreground text-xs">Reference</dt>
                <dd className="mt-1.5 font-mono text-xs leading-5 font-medium break-all">
                  {order.reference}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-muted-foreground text-xs">Placed</dt>
                <dd className="mt-1.5 text-sm leading-5 tabular-nums">
                  {formatDateTime(order.createdAt)}
                </dd>
              </div>
              <div className="min-w-0 @sm:col-span-2">
                <dt className="text-muted-foreground text-xs">Order ID</dt>
                <dd className="mt-1.5 font-mono text-xs leading-5 break-all">
                  {order.id}
                </dd>
              </div>
            </dl>
            <div className="border-t border-border/60 bg-muted/20 px-4 py-3">
              <dl className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-baseline gap-2">
                  <dt className="text-muted-foreground">Line items</dt>
                  <dd className="font-medium tabular-nums">
                    {order.items.length}
                  </dd>
                </div>
                <div className="flex items-baseline gap-2">
                  <dt className="text-muted-foreground">Units</dt>
                  <dd className="font-medium tabular-nums">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
          <p className="text-muted-foreground flex items-start gap-2 text-xs">
            <IconClipboardList className="mt-px size-3.5 shrink-0" />
            Statuses can move from placed to packed to shipped.
          </p>
        </aside>
      </div>
    </>
  );
}

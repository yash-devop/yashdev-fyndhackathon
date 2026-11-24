"use client";

import {
  IconAlertCircle,
  IconArrowUpRight,
  IconChevronLeft,
  IconChevronRight,
  IconClipboardList,
  IconDotsVertical,
  IconReceipt,
  IconSearch,
} from "@tabler/icons-react";
import { ORDER_STATUSES, type OrderStatus } from "@repo/schemas";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Input } from "@repo/ui/input";
import { RecordTable, RecordTableRow } from "@repo/ui/record-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Skeleton } from "@repo/ui/skeleton";
import Link from "next/link";
import { useState } from "react";
import { OrderStatusBadge } from "@/components/common/order-status-badge";
import { PageHeader } from "@/components/common/page-header";
import { StatePanel } from "@/components/common/state-panel";
import { useOrders } from "@/hooks/use-orders";
import { formatCurrency } from "@/lib/format-currency";
import { formatDateTime } from "@/lib/format-date";

const grid =
  "md:grid-cols-[minmax(0,1.8fr)_minmax(0,0.6fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_2.5rem]";

const columns = [
  { key: "reference", header: "Reference" },
  { key: "items", header: "Items" },
  { key: "total", header: "Total" },
  { key: "status", header: "Status" },
  { key: "actions", header: "Actions", className: "sr-only" },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isPending, isError, refetch } = useOrders({
    page,
    limit: 10,
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(status === "all" ? {} : { status }),
  });

  const pagination = data?.pagination;

  return (
    <>
      <PageHeader
        title="Orders"
        description="Track placed orders and their fulfilment state."
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <IconSearch className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by reference"
            aria-label="Search by reference"
            className="pl-8"
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as OrderStatus | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-36" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {value.charAt(0) + value.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {pagination ? (
          <span className="text-muted-foreground ml-auto text-xs tabular-nums">
            {pagination.total} {pagination.total === 1 ? "order" : "orders"}
          </span>
        ) : null}
      </div>

      {isPending ? (
        <RecordTable grid={grid} columns={columns}>
          {Array.from({ length: 5 }).map((_, index) => (
            <RecordTableRow key={index}>
              <div role="cell" className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 md:contents">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
              <Skeleton className="absolute top-4 right-3 size-6 rounded-md md:static md:justify-self-end" />
            </RecordTableRow>
          ))}
        </RecordTable>
      ) : isError ? (
        <StatePanel
          icon={<IconAlertCircle className="size-6" />}
          title="Couldn't load orders"
          description="Orders are unavailable right now. Try again."
          action={
            <Button variant="outline" onClick={() => void refetch()}>
              Retry
            </Button>
          }
        />
      ) : !data || data.items.length === 0 ? (
        <StatePanel
          icon={<IconClipboardList className="size-6" />}
          title="No orders found"
          description="Place an order or adjust the search and status filters."
          action={
            <Button variant="outline" render={<Link href="/orders/new" />}>
              Create order
            </Button>
          }
        />
      ) : (
        <>
          <RecordTable grid={grid} columns={columns}>
            {data.items.map((order) => (
              <RecordTableRow key={order.id}>
                <div
                  role="cell"
                  className="flex min-w-0 items-center gap-3 pr-9 md:pr-0"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground">
                    <IconReceipt
                      className="size-5"
                      stroke={1.75}
                      aria-hidden="true"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="text-foreground truncate font-mono text-sm font-medium">
                      {order.reference}
                    </p>
                    <p className="text-muted-foreground truncate text-sm">
                      Placed {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 md:contents">
                  <div
                    role="cell"
                    className="flex items-baseline justify-between gap-2 text-sm md:block"
                  >
                    <span className="text-muted-foreground md:hidden">
                      Items
                    </span>
                    <span className="tabular-nums">{order.items.length}</span>
                  </div>
                  <div
                    role="cell"
                    className="flex items-baseline justify-between gap-2 text-sm md:block"
                  >
                    <span className="text-muted-foreground md:hidden">
                      Total
                    </span>
                    <span className="tabular-nums">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                  <div role="cell" className="col-span-2 md:col-span-1">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>

                <div
                  role="cell"
                  className="absolute top-3 right-2 md:static md:justify-self-end"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for ${order.reference}`}
                        />
                      }
                    >
                      <IconDotsVertical className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        render={<Link href={`/orders/${order.id}`} />}
                      >
                        <IconArrowUpRight className="size-4" />
                        View order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </RecordTableRow>
            ))}
          </RecordTable>
          {pagination && pagination.totalPages > 1 ? (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-muted-foreground text-xs tabular-nums">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((value) => value - 1)}
                >
                  <IconChevronLeft />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next
                  <IconChevronRight />
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}

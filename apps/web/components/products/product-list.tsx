"use client";

import {
  IconBan,
  IconDotsVertical,
  IconPackage,
  IconPlus,
} from "@tabler/icons-react";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { RecordTable, RecordTableRow } from "@repo/ui/record-table";
import { Skeleton } from "@repo/ui/skeleton";
import Link from "next/link";
import { AvailabilityBadge } from "@/components/common/availability-badge";
import type { Product } from "@/lib/api/products";
import { formatCurrency } from "@/lib/format-currency";

const grid =
  "md:grid-cols-[minmax(0,1.7fr)_minmax(0,0.7fr)_minmax(0,0.55fr)_minmax(0,1fr)_2.5rem]";

const columns = [
  { key: "product", header: "Product" },
  { key: "price", header: "Price" },
  { key: "stock", header: "Stock" },
  { key: "availability", header: "Availability" },
  { key: "actions", header: "Actions", className: "sr-only" },
];

function ProductRow({ product }: { product: Product }) {
  return (
    <RecordTableRow>
      <div role="cell" className="flex min-w-0 items-center gap-3 pr-9 md:pr-0">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-white text-muted-foreground">
          <IconPackage className="size-5" stroke={1.75} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-foreground truncate font-medium text-sm">
            {product.name}
          </p>
          <p className="text-muted-foreground truncate text-xs">
            {product.description ?? "No description"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:contents">
        <div
          role="cell"
          className="flex items-baseline justify-between gap-2 text-sm md:block"
        >
          <span className="text-muted-foreground md:hidden">Price</span>
          <span className="tabular-nums">{formatCurrency(product.price)}</span>
        </div>
        <div
          role="cell"
          className="flex items-baseline justify-between gap-2 text-sm md:block"
        >
          <span className="text-muted-foreground md:hidden">Stock</span>
          <span className="tabular-nums">
            {product.stock} {product.stock === 1 ? "unit" : "units"}
          </span>
        </div>
        <div role="cell" className="col-span-2 md:col-span-1">
          <AvailabilityBadge stock={product.stock} />
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
                aria-label={`Actions for ${product.name}`}
              />
            }
          >
            <IconDotsVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {product.stock === 0 ? (
              <DropdownMenuItem disabled>
                <IconBan className="size-4" />
                Out of stock
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                render={<Link href={`/orders/new?product=${product.id}`} />}
              >
                <IconPlus className="size-4" />
                Add to order
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </RecordTableRow>
  );
}

export function ProductList({ products }: { products: Product[] }) {
  return (
    <RecordTable grid={grid} columns={columns}>
      {products.map((product) => (
        <ProductRow key={product.id} product={product} />
      ))}
    </RecordTable>
  );
}

export function ProductListSkeleton() {
  return (
    <RecordTable grid={grid} columns={columns}>
      {Array.from({ length: 5 }).map((_, index) => (
        <RecordTableRow key={index}>
          <div role="cell" className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:contents">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
          <Skeleton className="absolute top-4 right-3 size-6 rounded-md md:static md:justify-self-end" />
        </RecordTableRow>
      ))}
    </RecordTable>
  );
}

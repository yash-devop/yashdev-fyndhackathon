"use client";

import {
  IconAlertCircle,
  IconPackage,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { StatePanel } from "@/components/common/state-panel";
import {
  ProductList,
  ProductListSkeleton,
} from "@/components/products/product-list";
import { useProducts } from "@/hooks/use-products";
import { getStockState, type StockState } from "@/lib/stock";

type ProductFilter = "all" | StockState;

export default function ProductsPage() {
  const { data: products, isPending, isError, refetch } = useProducts();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ProductFilter>("all");

  const visibleProducts = useMemo(() => {
    if (!products) return [];

    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        query.length === 0 || product.name.toLowerCase().includes(query);
      const matchesFilter =
        filter === "all" || getStockState(product.stock) === filter;
      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  return (
    <>
      <PageHeader
        title="Products"
        description="Browse the catalogue and add items to an order."
        actions={
          <Button render={<Link href="/orders/new" />}>
            <IconPlus />
            New order
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <IconSearch className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="pl-8"
          />
        </div>
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as ProductFilter)}
        >
          <SelectTrigger className="w-40" aria-label="Filter by availability">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All availability</SelectItem>
            <SelectItem value="in">In stock</SelectItem>
            <SelectItem value="low">Low stock</SelectItem>
            <SelectItem value="out">Out of stock</SelectItem>
          </SelectContent>
        </Select>
        {products ? (
          <span className="text-muted-foreground ml-auto text-xs tabular-nums">
            {visibleProducts.length} of {products.length} products
          </span>
        ) : null}
      </div>

      {isPending ? (
        <ProductListSkeleton />
      ) : isError ? (
        <StatePanel
          icon={<IconAlertCircle className="size-6" />}
          title="Couldn't load products"
          description="The catalogue is unavailable right now. Try again."
          action={
            <Button variant="outline" onClick={() => void refetch()}>
              Retry
            </Button>
          }
        />
      ) : visibleProducts.length === 0 ? (
        <StatePanel
          icon={<IconPackage className="size-6" />}
          title="No products found"
          description="Try a different search term or availability filter."
        />
      ) : (
        <ProductList products={visibleProducts} />
      )}
    </>
  );
}

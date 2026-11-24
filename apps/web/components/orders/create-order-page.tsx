"use client";

import {
  IconAlertCircle,
  IconDotsVertical,
  IconMinus,
  IconPackage,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { PageHeader } from "@/components/common/page-header";
import { StatePanel } from "@/components/common/state-panel";
import { useOrderForm } from "@/hooks/use-order-form";
import { useProducts } from "@/hooks/use-products";
import { formatCurrency } from "@/lib/format-currency";

const grid =
  "md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_2.5rem]";

const columns = [
  { key: "product", header: "Product" },
  { key: "quantity", header: "Quantity" },
  { key: "unit-price", header: "Unit price" },
  { key: "subtotal", header: "Subtotal" },
  { key: "actions", header: "Actions", className: "sr-only" },
];

export function CreateOrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: products, isPending, isError, refetch } = useProducts();
  const {
    form,
    onSubmit,
    isPending: isSubmitting,
  } = useOrderForm(() => router.push("/orders"));
  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [productId, setProductId] = useState(searchParams.get("product") ?? "");
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);

  const productsById = useMemo(
    () => new Map((products ?? []).map((product) => [product.id, product])),
    [products],
  );
  const selectedIds = useMemo(
    () => new Set(fields.map((item) => item.productId)),
    [fields],
  );
  const availableProducts = useMemo(
    () =>
      (products ?? []).filter(
        (product) => product.stock > 0 && !selectedIds.has(product.id),
      ),
    [products, selectedIds],
  );
  const total = useMemo(
    () =>
      fields.reduce((sum, item) => {
        const product = productsById.get(item.productId);
        return sum + Number(product?.price ?? 0) * item.quantity;
      }, 0),
    [fields, productsById],
  );

  const itemsErrorMessage =
    typeof form.formState.errors.items?.message === "string"
      ? form.formState.errors.items.message
      : undefined;

  const handleAddItem = () => {
    const product = productsById.get(productId);

    if (!product) {
      setFeedback("Select a product to add.");
      return;
    }
    if (selectedIds.has(productId)) {
      setFeedback("That product is already in this order.");
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      setFeedback("Quantity must be at least 1.");
      return;
    }
    if (quantity > product.stock) {
      setFeedback(`Only ${product.stock} available for ${product.name}.`);
      return;
    }

    append({ productId, quantity });
    setFeedback(null);
    setProductId("");
    setQuantity(1);
  };

  const handleQuantityChange = (index: number, next: number) => {
    const item = fields[index];
    if (!item) return;

    const product = productsById.get(item.productId);
    const max = product?.stock ?? item.quantity;
    const value = Math.min(Math.max(next, 1), max);

    setFeedback(
      next > max ? `Only ${max} available for ${product?.name}.` : null,
    );
    update(index, { productId: item.productId, quantity: value });
  };

  return (
    <>
      <PageHeader
        title="Create Order"
        description="Build an order from the current catalogue."
        actions={
          <Button variant="outline" render={<Link href="/products" />}>
            Back to products
          </Button>
        }
      />

      {isPending ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      ) : isError ? (
        <StatePanel
          icon={<IconAlertCircle className="size-6" />}
          title="Couldn't load products"
          description="Products are needed to build an order. Try again."
          action={
            <Button variant="outline" onClick={() => void refetch()}>
              Retry
            </Button>
          }
        />
      ) : (
        <form
          onSubmit={onSubmit}
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"
        >
          <section className="min-w-0 space-y-4">
            <div>
              <h2 className="border-b pb-2 text-sm font-medium">Add items</h2>
              <div className="mt-4 flex flex-wrap items-end gap-2">
                <div className="min-w-56 flex-1 space-y-1.5">
                  <label
                    htmlFor="product-selector"
                    className="text-muted-foreground text-xs"
                  >
                    Product
                  </label>
                  <Select
                    value={productId}
                    onValueChange={(value) => {
                      setProductId(value ?? "");
                      setFeedback(null);
                    }}
                  >
                    <SelectTrigger id="product-selector" className="w-full">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} · {product.stock} available
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-24 space-y-1.5">
                  <label
                    htmlFor="item-quantity"
                    className="text-muted-foreground text-xs"
                  >
                    Quantity
                  </label>
                  <Input
                    id="item-quantity"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(Number(event.target.value))
                    }
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddItem}
                  disabled={availableProducts.length === 0}
                >
                  <IconPlus />
                  Add item
                </Button>
              </div>
              {feedback ? (
                <p role="alert" className="text-destructive mt-2 text-xs">
                  {feedback}
                </p>
              ) : null}
            </div>

            {fields.length === 0 ? (
              <StatePanel
                icon={<IconPackage className="size-6" />}
                title="No items selected"
                description="Choose a product and quantity above to start this order."
              />
            ) : (
              <RecordTable grid={grid} columns={columns}>
                {fields.map((item, index) => {
                  const product = productsById.get(item.productId);
                  const exceeded = product
                    ? item.quantity > product.stock
                    : false;

                  return (
                    <RecordTableRow key={item.id}>
                      <div
                        role="cell"
                        className="flex min-w-0 items-center gap-3 pr-9 md:pr-0"
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground">
                          <IconPackage
                            className="size-5"
                            stroke={1.75}
                            aria-hidden="true"
                          />
                        </span>
                        <div className="min-w-0">
                          <p className="text-foreground truncate font-medium">
                            {product?.name ?? "Unknown product"}
                          </p>
                          <p
                            className={
                              exceeded
                                ? "text-destructive truncate text-sm"
                                : "text-muted-foreground truncate text-sm"
                            }
                          >
                            {exceeded
                              ? `Only ${product?.stock} available`
                              : "In this order"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 md:contents">
                        <div
                          role="cell"
                          className="flex items-center justify-between gap-2 md:block"
                        >
                          <span className="text-muted-foreground text-sm md:hidden">
                            Quantity
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              aria-label={`Decrease quantity of ${product?.name}`}
                              onClick={() =>
                                handleQuantityChange(index, item.quantity - 1)
                              }
                            >
                              <IconMinus />
                            </Button>
                            <span className="w-6 text-center text-sm tabular-nums">
                              {item.quantity}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              aria-label={`Increase quantity of ${product?.name}`}
                              onClick={() =>
                                handleQuantityChange(index, item.quantity + 1)
                              }
                            >
                              <IconPlus />
                            </Button>
                          </div>
                        </div>
                        <div
                          role="cell"
                          className="flex items-baseline justify-between gap-2 text-sm md:block"
                        >
                          <span className="text-muted-foreground md:hidden">
                            Unit price
                          </span>
                          <span className="tabular-nums">
                            {product ? formatCurrency(product.price) : "—"}
                          </span>
                        </div>
                        <div
                          role="cell"
                          className="col-span-2 flex items-baseline justify-between gap-2 text-sm md:col-span-1 md:block"
                        >
                          <span className="text-muted-foreground md:hidden">
                            Subtotal
                          </span>
                          <span className="tabular-nums">
                            {product
                              ? formatCurrency(
                                  Number(product.price) * item.quantity,
                                )
                              : "—"}
                          </span>
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
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Actions for ${product?.name}`}
                              />
                            }
                          >
                            <IconDotsVertical className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => {
                                remove(index);
                                setFeedback(null);
                              }}
                            >
                              <IconTrash className="size-4" />
                              Remove item
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </RecordTableRow>
                  );
                })}
              </RecordTable>
            )}
          </section>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="border-t pt-4">
              <h2 className="text-sm font-medium">Order summary</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Items</dt>
                  <dd className="tabular-nums">{fields.length}</dd>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <dt className="font-medium">Total</dt>
                  <dd className="font-semibold tabular-nums">
                    {formatCurrency(total)}
                  </dd>
                </div>
              </dl>
              {itemsErrorMessage ? (
                <p role="alert" className="text-destructive mt-3 text-xs">
                  {itemsErrorMessage}
                </p>
              ) : null}
              <Button
                type="submit"
                className="mt-5 w-full"
                disabled={isSubmitting || fields.length === 0}
              >
                {isSubmitting ? "Placing order…" : "Place order"}
              </Button>
              <p className="text-muted-foreground mt-3 text-xs">
                Stock is deducted when the order is placed.
              </p>
            </div>
          </aside>
        </form>
      )}
    </>
  );
}

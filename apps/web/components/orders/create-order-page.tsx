"use client";

import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconDotsVertical,
  IconInfoCircle,
  IconLoader2,
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
import { NoResultsIllustration } from "@/components/common/no-results-illustration";
import { PageHeader } from "@/components/common/page-header";
import { StatePanel } from "@/components/common/state-panel";
import { useOrderForm } from "@/hooks/use-order-form";
import { useProducts } from "@/hooks/use-products";
import { formatCurrency } from "@/lib/format-currency";

const grid =
  "md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,0.9fr)_2.5rem]";

const columns = [
  { key: "product", header: "Product" },
  { key: "quantity", header: "Quantity" },
  { key: "unit-price", header: "Unit price" },
  { key: "subtotal", header: "Subtotal" },
  { key: "actions", header: "Actions", className: "sr-only" },
];

function CreateOrderPageSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Skeleton className="h-8 w-full max-w-sm rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-56 w-full rounded-2xl" />
    </div>
  );
}

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
  const selectedProduct = productId ? productsById.get(productId) : undefined;
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
  const units = useMemo(
    () => fields.reduce((sum, item) => sum + item.quantity, 0),
    [fields],
  );

  const itemsErrorMessage =
    typeof form.formState.errors.items?.message === "string"
      ? form.formState.errors.items.message
      : undefined;

  const availabilityLabel =
    availableProducts.length === 0
      ? fields.length > 0
        ? "All available products are in this order"
        : "No products in stock"
      : `${availableProducts.length} ${
          availableProducts.length === 1 ? "product" : "products"
        } available`;

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
    document.getElementById("product-selector")?.focus();
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
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/products" />}
          >
            <IconArrowLeft />
            Back to products
          </Button>
        }
      />

      {isPending ? (
        <CreateOrderPageSkeleton />
      ) : isError ? (
        <StatePanel
          illustration={<NoResultsIllustration />}
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
          className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start"
        >
          <section className="min-w-0" aria-label="Order items">
            <div
              className="mb-4 flex flex-wrap items-center gap-3"
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  event.target instanceof HTMLInputElement
                ) {
                  event.preventDefault();
                  handleAddItem();
                }
              }}
            >
              <div className="w-full max-w-sm">
                <Select
                  value={productId}
                  onValueChange={(value) => {
                    setProductId(value ?? "");
                    setFeedback(null);
                  }}
                >
                  <SelectTrigger
                    id="product-selector"
                    aria-label="Product"
                    className="w-full"
                  >
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
              <Input
                id="item-quantity"
                type="number"
                inputMode="numeric"
                min={1}
                max={selectedProduct?.stock}
                value={quantity}
                aria-label="Quantity"
                onChange={(event) => {
                  setQuantity(Number(event.target.value));
                  setFeedback(null);
                }}
                className="w-20 text-center tabular-nums"
              />
              <Button
                type="button"
                onClick={handleAddItem}
                disabled={!productId || availableProducts.length === 0}
              >
                <IconPlus />
                Add item
              </Button>
              <span className="text-muted-foreground ml-auto text-xs tabular-nums">
                {availabilityLabel}
              </span>
            </div>

            {feedback ? (
              <p
                role="alert"
                className="text-destructive mb-4 flex items-center gap-1.5 text-xs"
              >
                <IconAlertCircle className="size-3.5 shrink-0" />
                {feedback}
              </p>
            ) : null}

            {fields.length === 0 ? (
              <div className="rounded-[calc(var(--radius-xl)+var(--spacing))] border border-border/60 bg-card shadow-xs">
                <StatePanel
                  illustration={<NoResultsIllustration />}
                  title="No items selected"
                  description="Choose a product and quantity above to start this order."
                />
              </div>
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
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted text-muted-foreground">
                          <IconPackage
                            className="size-5"
                            stroke={1.75}
                            aria-hidden="true"
                          />
                        </span>
                        <div className="min-w-0">
                          <p className="text-foreground truncate text-sm font-medium">
                            {product?.name ?? "Unknown product"}
                          </p>
                          <p
                            className={
                              exceeded
                                ? "text-destructive truncate text-xs"
                                : "text-muted-foreground truncate text-xs"
                            }
                          >
                            {exceeded
                              ? `Only ${product?.stock} available`
                              : product
                                ? `${product.stock} in stock`
                                : "Not in catalogue"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 md:contents">
                        <div
                          role="cell"
                          className="flex items-center justify-between gap-2 md:block"
                        >
                          <span className="text-muted-foreground text-sm md:hidden">
                            Qty
                          </span>
                          <div className="inline-flex items-center rounded-lg border border-border/60 bg-muted/30 p-0.5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              aria-label={`Decrease quantity of ${product?.name}`}
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                handleQuantityChange(index, item.quantity - 1)
                              }
                            >
                              <IconMinus />
                            </Button>
                            <span className="w-7 text-center text-sm tabular-nums">
                              {item.quantity}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              aria-label={`Increase quantity of ${product?.name}`}
                              disabled={
                                !product || item.quantity >= product.stock
                              }
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
                            Price
                          </span>
                          <span className="tabular-nums">
                            {product ? formatCurrency(product.price) : "—"}
                          </span>
                        </div>
                        <div
                          role="cell"
                          className="col-span-2 flex items-baseline justify-between gap-2 text-sm font-medium md:col-span-1 md:block"
                        >
                          <span className="text-muted-foreground font-normal md:hidden">
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

          <aside className="xl:sticky xl:top-6" aria-label="Order summary">
            <div className="overflow-hidden rounded-[calc(var(--radius-xl)+var(--spacing))] border border-border/60 bg-card shadow-xs">
              <div className="border-b border-border/60 px-4 py-3">
                <h2 className="text-sm font-medium">Order summary</h2>
              </div>

              <dl className="space-y-3 px-4 py-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Line items</dt>
                  <dd className="tabular-nums">{fields.length}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Units</dt>
                  <dd className="tabular-nums">{units}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-border/60 pt-3">
                  <dt className="font-medium">Total</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatCurrency(total)}
                  </dd>
                </div>
              </dl>

              <div className="border-t border-border/60 bg-muted/20 px-4 py-4">
                {itemsErrorMessage ? (
                  <p
                    role="alert"
                    className="text-destructive mb-3 flex items-center gap-1.5 text-xs"
                  >
                    <IconAlertCircle className="size-3.5 shrink-0" />
                    {itemsErrorMessage}
                  </p>
                ) : null}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting || fields.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <IconLoader2 className="animate-spin" />
                      Placing order…
                    </>
                  ) : (
                    <>
                      Place order
                      <IconArrowRight />
                    </>
                  )}
                </Button>
                <p className="text-muted-foreground mt-3 flex items-start gap-1 text-xs">
                  <IconInfoCircle
                    className="mt-px size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  Stock is deducted when the order is placed.
                </p>
              </div>
            </div>
          </aside>
        </form>
      )}
    </>
  );
}

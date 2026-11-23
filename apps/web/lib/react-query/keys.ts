import { GetOrderInput } from "@repo/schemas";

const products = ["products"] as const;
const orders = ["orders"] as const;

export const queryKeys = {
  products: {
    all: products,
    lists: () => [...products, "list"] as const,
  },
  orders: {
    all: orders,
    lists: () => [...orders, "list"] as const,
    list: (params?: Partial<GetOrderInput>) =>
      [...orders, "list", params ?? {}] as const,
    details: () => [...orders, "detail"] as const,
    detail: (id: string) => [...orders, "detail", id] as const,
  },
} as const;

"use client";

import { GetOrderInput } from "@repo/schemas";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib/api/orders";
import { queryKeys } from "@/lib/react-query/keys";

export function useOrders(params?: Partial<GetOrderInput>) {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => getOrders(params),
  });
}

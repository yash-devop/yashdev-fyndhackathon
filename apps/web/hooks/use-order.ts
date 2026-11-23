"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrder } from "@/lib/api/orders";
import { queryKeys } from "@/lib/react-query/keys";

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
  });
}

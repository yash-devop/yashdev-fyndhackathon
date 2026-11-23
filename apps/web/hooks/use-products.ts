"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";
import { queryKeys } from "@/lib/react-query/keys";

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.lists(),
    queryFn: getProducts,
  });
}

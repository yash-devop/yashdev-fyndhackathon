"use client";

import { UpdateOrderStatusInput } from "@repo/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/error";
import { updateOrderStatus } from "@/lib/api/orders";
import { queryKeys } from "@/lib/react-query/keys";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateOrderStatusInput;
    }) => updateOrderStatus(id, input),
    onSuccess: (_data, variables) => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(variables.id),
      });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update order status"));
    },
  });
}

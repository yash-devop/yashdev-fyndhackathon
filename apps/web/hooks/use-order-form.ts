"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreateOrderInput, createOrderSchema } from "@repo/schemas";
import { useForm } from "react-hook-form";
import { useCreateOrder } from "./use-create-order";

export function useOrderForm(onSuccess?: () => void) {
  const createOrder = useCreateOrder();

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { items: [] },
  });

  const onSubmit = form.handleSubmit(async (input) => {
    await createOrder.mutateAsync(input);
    onSuccess?.();
  });

  return {
    form,
    onSubmit,
    isPending: form.formState.isSubmitting || createOrder.isPending,
  };
}

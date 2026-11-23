"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreateOrderInput, createOrderSchema } from "@repo/schemas";
import { useForm } from "react-hook-form";
import { useCreateOrder } from "./use-create-order";

export function useOrderForm() {
  const createOrder = useCreateOrder();

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { items: [] },
  });

  const onSubmit = form.handleSubmit((input) => createOrder.mutateAsync(input));

  return {
    form,
    onSubmit,
    isPending: form.formState.isSubmitting || createOrder.isPending,
  };
}

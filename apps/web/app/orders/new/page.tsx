import { Skeleton } from "@repo/ui/skeleton";
import { Suspense } from "react";
import { CreateOrderPage } from "@/components/orders/create-order-page";

export default function NewOrderPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <CreateOrderPage />
    </Suspense>
  );
}

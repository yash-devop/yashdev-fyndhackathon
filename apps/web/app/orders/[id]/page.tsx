import { OrderDetailsView } from "@/components/orders/order-details-view";

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;

  return <OrderDetailsView id={id} />;
}

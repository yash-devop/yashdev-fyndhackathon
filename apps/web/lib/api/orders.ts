import {
  CreateOrderInput,
  GetOrderInput,
  OrderStatus,
  UpdateOrderStatusInput,
} from "@repo/schemas";
import { api } from "@/lib/axios";
import { ApiResponse } from "./types";

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: string;
  subtotal: string;
};

export type OrderDetailItem = OrderItem & {
  productName: string;
};

export type Order = {
  id: string;
  reference: string;
  status: OrderStatus;
  total: string;
  createdAt: string;
  items: OrderItem[];
};

export type OrderDetail = Omit<Order, "items"> & {
  items: OrderDetailItem[];
};

export type OrdersList = {
  items: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const { data } = await api.post<ApiResponse<Order>>("/orders", input);
  return data.data;
}

export async function getOrders(
  params?: Partial<GetOrderInput>,
): Promise<OrdersList> {
  const { data } = await api.get<ApiResponse<OrdersList>>("/orders", {
    params,
  });
  return data.data;
}

export async function getOrder(id: string): Promise<OrderDetail> {
  const { data } = await api.get<ApiResponse<OrderDetail>>(`/orders/${id}`);
  return data.data;
}

export async function updateOrderStatus(
  id: string,
  input: UpdateOrderStatusInput,
): Promise<OrderDetail> {
  const { data } = await api.patch<ApiResponse<OrderDetail>>(
    `/orders/${id}/status`,
    input,
  );
  return data.data;
}

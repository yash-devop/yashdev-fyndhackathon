import { api } from "@/lib/axios";
import { ApiResponse } from "./types";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  availability: "IN_STOCK" | "OUT_OF_STOCK";
};

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<ApiResponse<Product[]>>("/products");
  return data.data;
}

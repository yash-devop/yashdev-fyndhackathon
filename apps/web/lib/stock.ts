export type StockState = "in" | "low" | "out";

export function getStockState(stock: number): StockState {
  if (stock === 0) return "out";
  if (stock <= 5) return "low";
  return "in";
}

import { AxiosError } from "axios";
import { ApiResponse } from "./types";

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiResponse<unknown> | undefined;
    return data?.message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

export type ApiError = {
  code: string;
  message: string;
  details: unknown;
};

export type ApiResponse<T> = {
  status: number;
  data: T;
  message: string;
  error: ApiError | null;
  success: boolean;
};

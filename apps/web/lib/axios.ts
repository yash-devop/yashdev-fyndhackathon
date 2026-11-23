import axios from "axios";

const API_VERSION = "/api/v1";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_VERSION}`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

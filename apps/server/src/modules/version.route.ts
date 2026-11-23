import { Router } from "express";
import { okResponse } from "../lib/http";

export const versionRouter = Router() as Router;

versionRouter.get("/health", (_req, res) =>
  okResponse(res, { status: "healthy" }, "Service is healthy"),
);

versionRouter.get("/version", (_req, res) =>
  okResponse(res, { name: "yash-fynd", version: "1.0.0" }),
);

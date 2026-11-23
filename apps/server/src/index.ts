import { serverEnv } from "@repo/env/server-env";
import cors from "cors";
import express from "express";
import { corsConfig } from "./lib/cors";
import { errorMiddleware } from "./middlewares/error.middleware";
import { productsRouter } from "./modules/products.route";
import { versionRouter } from "./modules/version.route";

const app = express();

app.use(express.json());
app.use(cors(corsConfig));
app.use("/api", versionRouter);
app.use("/api/products", productsRouter);

app.use(errorMiddleware);
app.listen(serverEnv.PORT, () => {
  console.log(`Server started on Port ${serverEnv.PORT}`);
});

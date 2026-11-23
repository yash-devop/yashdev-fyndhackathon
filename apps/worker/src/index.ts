import { workerEnv } from "@repo/env/worker-env";
import { Worker } from "bullmq";
import { EXAMPLE_QUEUE } from "./lib/queue";
import { redisClient } from "./lib/redis";
import { processExample } from "./processors/example";

const worker = new Worker(EXAMPLE_QUEUE, processExample, {
  connection: redisClient,
  concurrency: workerEnv.WORKER_CONCURRENCY,
});

worker.on("completed", (job) => {
  console.log(`[example] completed ${job.id}`);
});

worker.on("failed", (job, error) => {
  console.error(`[example] failed ${job?.id}:`, error);
});

worker.on("error", (error) => {
  console.error("[worker] error", error);
});

const shutdown = async (signal: string): Promise<void> => {
  console.log(`[worker] ${signal} received, shutting down`);

  await worker.close();
  await redisClient.quit();
};

process.once("SIGINT", () => {
  void shutdown("SIGINT");
});

process.once("SIGTERM", () => {
  void shutdown("SIGTERM");
});

console.log(
  `[worker] listening on "${EXAMPLE_QUEUE}" (concurrency ${workerEnv.WORKER_CONCURRENCY})`,
);

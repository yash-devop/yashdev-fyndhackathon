import { type Job } from "bullmq";

export type ExampleJobType = {
  message: string;
};

export const processExample = async (
  job: Job<ExampleJobType>,
): Promise<{ processed: boolean }> => {
  console.log(`[example] processing job ${job.id}: ${job.data.message}`);

  return { processed: true };
};

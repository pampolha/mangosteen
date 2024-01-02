import { ChildProcess } from "child_process";

const executionTimeWindowMs = 100;

const cpuLimiter = (process: ChildProcess, percentage: number) => {
  const usageTimeFactor = 1 - percentage / 100;
  const limiterId = setInterval(() => {
    process.kill("SIGSTOP");
    setTimeout(() => {
      process.kill("SIGCONT");
    }, executionTimeWindowMs * usageTimeFactor);
  }, executionTimeWindowMs);

  process.on("error", () => clearInterval(limiterId));
  process.on("disconnect", () => clearInterval(limiterId));
};

export default cpuLimiter;

import { fork } from "child_process";
import cpuLimiter from "./helpers/cpuLimiter";

const envToArgs = {
  maxMemoryMegabytes: (memoryMb: number) => `--max-old-space-size=${memoryMb}`,
  maxNumberOfThreads: (numOfThreads: number) =>
    `--v8-pool-size=${numOfThreads}`,
};

const args: string[] = [];

Object.entries(process.env).forEach(([key, value]) => {
  if (Object.keys(envToArgs).includes(key)) {
    // @ts-expect-error index signature already checked
    args.push(envToArgs[key](value));
  }
});

const spawnedProcess = fork("teste.js", {
  execArgv: args,
  stdio: "inherit",
});
if (process.env.maxCpuPercentage)
  cpuLimiter(spawnedProcess, parseFloat(process.env.maxCpuPercentage));

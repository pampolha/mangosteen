#! /usr/bin/env node

import { spawn } from "child_process";
import Logger from "./models/Logger";
import { program } from "commander";

const teste = spawn("node", ["teste.js"]);
const testeLogger = new Logger(teste, { logMetaEvents: true });
testeLogger.enable();

const executionTimeWindowMs = 100;
const cpuUsagePercent = 25;
// eslint-disable-next-line no-magic-numbers
const usageTimeFactor = 1 - cpuUsagePercent / 100;

setInterval(() => {
  teste.kill("SIGSTOP");

  setTimeout(() => {
    teste.kill("SIGCONT");
  }, executionTimeWindowMs * usageTimeFactor);
}, executionTimeWindowMs);

program.parse();

/* 
--v8-pool-size=num
max-old-space-size=SIZE
*/

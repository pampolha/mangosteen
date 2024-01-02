#! /usr/bin/env node
import { program } from "commander";
import launchContainer from "./helpers/launchContainer";

export type ContainerOptions = {
  maxCpuPercentage?: number;
  maxMemoryMegabytes?: number;
  maxNumberOfThreads?: number;
};

launchContainer({
  maxMemoryMegabytes: 1500,
  maxCpuPercentage: 5,
  maxNumberOfThreads: 1,
});

program.parse();

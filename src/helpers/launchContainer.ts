import { fork } from "child_process";
import { ContainerOptions } from "../main";

const launchContainer = (options?: ContainerOptions) => {
  if (options) {
    Object.entries(options).forEach(([key, value]) => {
      process.env[key] = value.toString();
    });
  }
  const container = fork("out/container.js", { stdio: "inherit" });
  return container;
};

export default launchContainer;

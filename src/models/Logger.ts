import { ChildProcessWithoutNullStreams } from "child_process";

interface LoggerOptions {
  logMetaEvents?: boolean;
}

class Logger {
  static logProcessPipe() {
    throw new Error("Method not implemented.");
  }
  private process: ChildProcessWithoutNullStreams;
  private options?: LoggerOptions;

  private logProcessEvent = (
    message: string,
    ...additionalInfos: unknown[]
  ) => {
    const lastIndex = -1;
    return console.log(
      message,
      { pid: this.process.pid, command: this.process.spawnargs.at(lastIndex) },
      ...additionalInfos,
    );
  };
  private logProcessError = (message: string, err: Error) => {
    const lastIndex = -1;
    console.error(
      message,
      { pid: this.process.pid, command: this.process.spawnargs.at(lastIndex) },
      { Error: err },
    );
  };

  private callableOptions = {
    logMetaEvents: () => {
      this.process.on("close", (code, signal) =>
        this.logProcessEvent("Process closed", { code, signal }),
      );
      this.process.on("disconnect", () =>
        this.logProcessEvent("Process disconnected"),
      );
      this.process.on("error", (err) =>
        this.logProcessError("Error occured", err),
      );
      this.process.on("exit", (code, signal) =>
        this.logProcessEvent("Process exited", { code, signal }),
      );
      this.process.on("message", (message, sendHandle) =>
        this.logProcessEvent("Message", { message, sendHandle }),
      );
      this.process.on("spawn", () => this.logProcessEvent("Process spawned"));
    },
  };

  private logProcessPipe = () => {
    this.process.stdout?.on("data", (chunk) =>
      this.logProcessEvent("data", Buffer.from(chunk).toString()),
    );
  };

  constructor(
    process: ChildProcessWithoutNullStreams,
    options?: LoggerOptions,
  ) {
    this.process = process;
    this.options = options;
  }

  enable = () => {
    for (const key in this.options) {
      this.callableOptions[key as keyof typeof this.options]();
    }

    this.logProcessPipe();
  };

  disable = () => this.process.removeAllListeners();
}

export default Logger;

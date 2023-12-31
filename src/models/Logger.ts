import { ChildProcessWithoutNullStreams } from "child_process";

interface LoggerOptions {
  logMetaEvents?: boolean;
}

class Logger {
  static logProcessPipe() {
    throw new Error("Method not implemented.");
  }
  private process: ChildProcessWithoutNullStreams;
  private optionsToCall?: string[] | undefined;

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
      this.process.on("exit", (code, signal) =>
        this.logProcessEvent("Process exited", { code, signal }),
      );
      this.process.on("message", (message, sendHandle) =>
        this.logProcessEvent("Message", { message, sendHandle }),
      );
      this.process.on("spawn", () => this.logProcessEvent("Process spawned"));
    },
  };

  private logProcessPipes = () => {
    this.process.on("error", (err) =>
      this.logProcessError("Error occured", err),
    );
    this.process.stdout?.on("data", (chunk) =>
      this.logProcessEvent("stdout:", {
        message: Buffer.from(chunk).toString(),
      }),
    );
    this.process.stderr?.on("data", (chunk) =>
      this.logProcessEvent("stderr:", {
        message: Buffer.from(chunk).toString(),
      }),
    );
  };

  constructor(
    process: ChildProcessWithoutNullStreams,
    options?: LoggerOptions,
  ) {
    this.process = process;
    this.optionsToCall = Object.entries(<object>options)
      .filter(([, value]) => value)
      .map(([key]) => key);
  }

  enable = () => {
    for (const key of this.optionsToCall || []) {
      this.callableOptions[key as keyof LoggerOptions]();
    }

    this.logProcessPipes();
  };

  disable = () => this.process.removeAllListeners();
}

export default Logger;

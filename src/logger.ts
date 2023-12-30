import { ChildProcessWithoutNullStreams } from "child_process";

const attachVerboseLogs = (
  process: ChildProcessWithoutNullStreams,
  logProcessEvent: (message: string, ...additionalInfos: any[]) => void,
  logProcessError: (message: string, err: Error) => void
) => {
  process.on("close", (code, signal) =>
    logProcessEvent("Process closed", { code, signal })
  );
  process.on("disconnect", () => logProcessEvent("Process disconnected"));
  process.on("error", (err) => logProcessError("Error occured", err));
  process.on("exit", (code, signal) =>
    logProcessEvent("Process exited", { code, signal })
  );
  process.on("message", (message, sendHandle) =>
    logProcessEvent("Message", { message, sendHandle })
  );
  process.on("spawn", () => logProcessEvent("Process spawned"));
};

export const attachLogger = (process: ChildProcessWithoutNullStreams, verbose = false) => {
  const logProcessEvent = (message: string, ...additionalInfos: any[]) =>
    console.log(
      message,
      { pid: process.pid, command: process.spawnargs.at(-1) },
      ...additionalInfos
    );
  const logProcessError = (message: string, err: Error) =>
    console.error(
      message,
      { pid: process.pid, command: process.spawnargs.at(-1) },
      { Error: err }
    );

  if (verbose) attachVerboseLogs(process, logProcessEvent, logProcessError);

  process.stdout?.on("data", (chunk) =>
    logProcessEvent("data", Buffer.from(chunk).toString())
  );
};

import { log } from "../logger/logger";

export const logError = (err: unknown, msg: string = "") => {
  if (err instanceof Error) {
    log.error(`${msg}: ${err.message}`);
  } else {
    log.error(`${msg}: ${err}`);
  }
};

export const ErrorToText = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  } else {
    return String(err);
  }
};

export const NewError = (msg: string) => {
  log.error(msg);
  return new Error(msg);
};

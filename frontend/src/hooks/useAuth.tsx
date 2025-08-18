import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { log } from "../logger/logger";

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (ctx === undefined) {
    const errMsg = "useAuth is undefined";
    log.error(errMsg);
    throw new Error(errMsg);
  }
  return ctx;
};

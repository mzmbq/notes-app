import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { log } from "../logger/logger";
import { NewError } from "../utils/errors";

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (ctx === undefined) {
    throw NewError("useAuth is undefined");
  }
  return ctx;
};

import { log } from "../logger/logger";
import { BACKEND_URL } from "./api";
import {
  AuthReq,
  AuthResp,
  User,
  SignUpResp,
  SignUpReq,
} from "notes-app-types";

export const fetchLogin = async (req: AuthReq): Promise<AuthResp> => {
  const url = `${BACKEND_URL}/auth/login`;
  log.debug("fetchLogin: Sending POST request to:", url);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      throw new Error(
        `Login Failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (err: unknown) {
    throw err;
  }
};

export const fetchSignUp = async (req: SignUpReq): Promise<SignUpResp> => {
  const url = `${BACKEND_URL}/auth/signup`;
  log.debug("fetchSignUp: Sending POST request to:", url);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      req,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Sign up failed failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

import { log } from "../logger/logger";
import { BACKEND_URL } from "./api";
import { AuthInput, AuthResult, User } from "notes-app-types";

// TODO: handle errors properly
export const fetchLogin = async (req: AuthInput): Promise<AuthResult> => {
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

type UserCreateRequest = {
  email: string;
  username: string;
  password: string;
};

export const fetchUserCreate = async (
  req: UserCreateRequest
): Promise<User> => {
  const url = `${BACKEND_URL}/user`;
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
      `Create user failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

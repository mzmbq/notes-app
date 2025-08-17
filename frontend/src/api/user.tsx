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

export const fetchUserCreate = async (
  email: string,
  username: string,
  password: string
): Promise<User> => {
  const url = `${BACKEND_URL}/user`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      username: username,
      password: password,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Create user failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

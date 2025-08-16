import { log } from "../logger/logger";
import { BACKEND_URL } from "./api";

// TODO: Use DTOs from backend
export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  userId: string;
  username: string;
};

// TODO: handle errors properly
export const fetchLogin = async (req: LoginRequest): Promise<LoginResponse> => {
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

// TODO: Use DTOs from backend
export type CrateUserRequest = {
  email: string;
  username: string;
  password: string;
};

export type CreateUserResponse = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

export const fetchUserCreate = async (
  req: CrateUserRequest
): Promise<CreateUserResponse> => {
  const url = `${BACKEND_URL}/user`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    throw new Error(
      `Create user failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

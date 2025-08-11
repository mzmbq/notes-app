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
  const url = `${BACKEND_URL}/auth/login/`;
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

    const json = await response.json();
    return json;
  } catch (err: unknown) {
    throw err;
  }
};

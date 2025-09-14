import secureStore from "../utils/secureStore";

export const apiFetch = async <T>(
  url: string,
  init?: Omit<RequestInit, "body"> & { body?: any }
): Promise<T> => {
  const token = await secureStore.get("userToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers as Record<string, string> | undefined),
  };

  const body = init?.body !== undefined ? JSON.stringify(init.body) : undefined;

  const res = await fetch(url, { ...init, headers, body });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Request failed: ${res.status} ${res.statusText} - ${text}`
    );
  }

  const text = await res.text();
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
};

import { Note } from "notes-app-types";
import { log } from "../logger/logger";
import { BACKEND_URL } from "./api";

export const fetchPaginatedNotes = async (
  token: string,
  pageNum: number
): Promise<Note[]> => {
  const url = `${BACKEND_URL}/notes/page/${pageNum}`;
  log.debug("fetchPaginatedNotes: Sending GET request to:", url);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // TODO: Improve token handling
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `fetchPaginatedNotes: Failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (err: unknown) {
    throw err;
  }
};

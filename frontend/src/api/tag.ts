import { Tag } from "notes-app-types";
import { apiFetch } from "../utils/apiFetch";
import { BACKEND_URL } from "./api";

type fetchTagsReq = {};
export const fetchAllTags = async (): Promise<Tag[]> => {
  return await apiFetch(`${BACKEND_URL}/tags`, {
    method: "GET",
  });
};

export const fetchTagsByNote = async (noteId: string): Promise<Tag[]> => {
  return await apiFetch(`${BACKEND_URL}/tags/note/${noteId}`, {
    method: "GET",
  });
};

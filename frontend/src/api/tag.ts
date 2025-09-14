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

export const fetchCreateTag = async (
  title: string,
  textColor: string,
  backgroundColor: string
): Promise<Tag> => {
  return await apiFetch(`${BACKEND_URL}/tags/`, {
    method: "POST",
    body: {
      title: title,
      textColor: textColor,
      backgroundColor: backgroundColor,
    },
  });
};

export const fetchAddTagToNote = async (
  noteId: string,
  tagId: string
): Promise<void> => {
  return await apiFetch(`${BACKEND_URL}/tags/${tagId}/notes/${noteId}`, {
    method: "POST",
  });
};

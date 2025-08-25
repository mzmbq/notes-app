import { Note } from "notes-app-types";
import { log } from "../logger/logger";
import { BACKEND_URL } from "./api";
import { apiFetch } from "../utils/apiFetch";

type FetchPaginatedNotesReq = {
  token: string;
  pageNum: number;
};

export const fetchPaginatedNotes = async (
  req: FetchPaginatedNotesReq
): Promise<Note[]> => {
  return await apiFetch(`${BACKEND_URL}/notes/page/${req.pageNum}`);
};

type fetchCreateNoteReq = {
  token: string;
  title: string;
  content: string;
};

export const fetchCreateNote = async (
  req: fetchCreateNoteReq
): Promise<Note> => {
  const url = `${BACKEND_URL}/notes`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.token}`,
      },
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      throw new Error(
        `fetchCreateNote: Failed ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  } catch (err: unknown) {
    throw err;
  }
};

type fetchNoteByIdReq = {
  token: string;
  id: string;
};

export const fetchNoteById = async (req: fetchNoteByIdReq): Promise<Note> => {
  const url = `${BACKEND_URL}/notes/${req.id}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.token}`,
      },
    });
    if (!response.ok) {
      throw new Error(
        `fetchNoteById: Failed ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  } catch (err: unknown) {
    throw err;
  }
};

type fetchUpdateNoteReq = {
  id: string;
  title?: string;
  content?: string;
};

export const fetchUpdateNote = async (
  req: fetchUpdateNoteReq
): Promise<Note> => {
  return await apiFetch(`${BACKEND_URL}/notes/${req.id}`, {
    method: "PATCH",
    body: { title: req.title, content: req.content },
  });
};

type fetcDeleteNoteReq = {
  id: string;
  token: string;
};

export const fetchDeleteNote = async (
  req: fetcDeleteNoteReq
): Promise<void> => {
  const url = `${BACKEND_URL}/notes/${req.id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.token}`,
      },
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      throw new Error(
        `fetchDeleteNote: Failed ${response.status} ${response.statusText}`
      );
    }

    // если бэк шлёт 204 No Content — просто выходим
    if (response.status === 204) return;

    // если иногда приходит тело — читаем ОДИН раз
    const text = await response.text();
    if (!text) return;
    // если ожидается JSON — распарсить вручную
    JSON.parse(text); // или верните значение, если нужно
  } catch (err: unknown) {
    throw err;
  }
};

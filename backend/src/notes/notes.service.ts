import { Injectable } from "@nestjs/common";
import { CreateNoteDto } from "./notes.dto";
import { Note } from "src/types/note";
import { notes } from "src/db/note";
import { db } from "src/database/db";

@Injectable()
export class NotesService {
  async createNote(dto: CreateNoteDto): Promise<Note> {
    try {
      const note = await db
        .insert(notes)
        .values({
          title: dto.title,
          content: dto.content,
          // TODO: Get id from auth middleware
          authorId: "3b8ad7df-9f10-4a13-bae7-dfdb414348f9",
        })
        .returning();
      return note[0];
    } catch (err) {
      if (err instanceof Error) {
        throw new Error("[createNote] Failed by creating a note", err);
      }
    }
    throw new Error("[createNote] Failed by creating a note (Unknown error)");
  }
}

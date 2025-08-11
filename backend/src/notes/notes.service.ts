import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { CreateNoteDto, UpdateNoteDto } from "./notes.dto";
import { Note } from "src/types/note";
import { notes } from "src/db/note";
import { db } from "src/database/db";
import { eq, and, sql } from "drizzle-orm";
import { isUUID } from "class-validator";

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);
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
        throw new Error("[createNote] Failed creating a note", err);
      }
    }
    throw new Error("[createNote] Failed creating a note (Unknown error)");
  }

  async getNoteById(id: string): Promise<Note> {
    if (!isUUID(id)) {
      throw new BadRequestException(
        `[getNoteById] Invalid note ID format: "${id}"`,
      );
    }
    const result = await db.select().from(notes).where(eq(notes.id, id));
    const note = result[0];
    if (!note) {
      throw new NotFoundException(
        `[getNoteById] Note with ID "${id}" not found`,
      );
    }
    return note;
  }

  // TODO: Get id from auth middleware
  async getAllFavoriteNotes(): Promise<Note[]> {
    try {
      const foundNotes = await db
        .select()
        .from(notes)
        .where(
          and(
            eq(notes.authorId, "3b8ad7df-9f10-4a13-bae7-dfdb414348f9"),
            eq(notes.isFavorite, true),
          ),
        );
      return foundNotes;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(
          `[getAllFavoriteNotes] Failed getting all favorite notes of user with id : 3b8ad7df-9f10-4a13-bae7-dfdb414348f9, `,
          err,
        );
      }
      throw new Error(
        `[getAllFavoriteNotes] Failed getting all favorite notes of user with id : 3b8ad7df-9f10-4a13-bae7-dfdb414348f9 (Unknown Error)`,
      );
    }
  }

  // TODO: Get id from auth middleware
  async getAllNotes(): Promise<Note[]> {
    try {
      const foundNotes = await db
        .select()
        .from(notes)
        .where(eq(notes.authorId, "3b8ad7df-9f10-4a13-bae7-dfdb414348f9"));
      return foundNotes;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(
          `[getAllNotesOfUser] Failed getting all favorite notes of user with id : 3b8ad7df-9f10-4a13-bae7-dfdb414348f9}, `,
          err,
        );
      }
      throw new Error(
        `[getAllNotesOfUser] Failed getting all favorite notes of user with id : 3b8ad7df-9f10-4a13-bae7-dfdb414348f9 (Unknown Error)`,
      );
    }
  }

  async updateNote(id: string, dto: UpdateNoteDto): Promise<Note> {
    try {
      const [updated] = await db
        .update(notes)
        .set({ ...dto, updatedAt: sql`now()` })
        .where(eq(notes.id, id))
        .returning();
      if (!updated) {
        throw new NotFoundException(
          `[updateNote] Failed updating note. Note with id ${id} not found`,
        );
      }
      return updated;
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof BadRequestException
      ) {
        throw err;
      }
      this.logger.error(
        `[updateNote] Failed updating note ${id}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw new InternalServerErrorException(
        "[updateNote] Failed updating note",
      );
    }
  }

  async deleteNoteById(id: string): Promise<void> {
    try {
      const deleted = await db
        .delete(notes)
        .where(eq(notes.id, id))
        .returning({ id: notes.id });
      if (deleted.length === 0) {
        throw new NotFoundException(`Note with id ${id} not found`);
      }
    } catch (err) {
      if (err instanceof NotFoundException) throw err;

      this.logger.error(
        `Failed deleting note with id ${id}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw new InternalServerErrorException(
        "[deleteNote] Failed deleting note",
      );
    }
  }
}

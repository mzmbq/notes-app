import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { CreateNoteDto, UpdateNoteDto } from "./notes.dto";
import { notes } from "src/db/note";
import { db } from "src/database/db";
import { eq, and } from "drizzle-orm";
import { isUUID } from "class-validator";
import { CurrentUser } from "notes-app-types";
import { Note } from "notes-app-types";

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);
  async createNote(user: CurrentUser, dto: CreateNoteDto): Promise<Note> {
    let title = dto.title;
    if (!title) {
      title = "New note";
    }
    try {
      const note = await db
        .insert(notes)
        .values({
          title: title.trim(),
          content: dto.content.trim(),
          authorId: user.userId,
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
      this.logger.error(`[getNoteById] Note with ID "${id}" not found`);
      throw new NotFoundException(
        `[getNoteById] Note with ID "${id}" not found`,
      );
    }
    return note;
  }

  async getAllFavoriteNotes(user: CurrentUser): Promise<Note[]> {
    try {
      const foundNotes = await db
        .select()
        .from(notes)
        .where(
          and(eq(notes.authorId, user.userId), eq(notes.isFavorite, true)),
        );
      return foundNotes;
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(
          `[getAllFavoriteNotes] Failed getting all favorite notes of user with id : ${user.userId}`,
        );
        throw new Error(
          `[getAllFavoriteNotes] Failed getting all favorite notes of user with id : ${user.userId}, `,
          err,
        );
      }
      throw new Error(
        `[getAllFavoriteNotes] Failed getting all favorite notes of user with id : ${user.userId} (Unknown Error)`,
      );
    }
  }

  async getAllNotes(user: CurrentUser): Promise<Note[]> {
    try {
      const foundNotes = await db
        .select()
        .from(notes)
        .where(eq(notes.authorId, user.userId));
      return foundNotes;
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(
          `[getAllNotesOfUser] Failed getting all favorite notes of user with id : ${user.userId}`,
        );
        throw new Error(
          `[getAllNotesOfUser] Failed getting all favorite notes of user with id : ${user.userId}}, `,
          err,
        );
      }
      throw new Error(
        `[getAllNotesOfUser] Failed getting all favorite notes of user with id : ${user.userId} (Unknown Error)`,
      );
    }
  }

  async updateNote(id: string, dto: UpdateNoteDto): Promise<Note> {
    await this.getNoteById(id);
    try {
      const [updated] = await db
        .update(notes)
        .set({
          title: dto.title?.trim(),
          content: dto.content?.trim(),
          isFavorite: dto.isFavorite,
          updatedAt: new Date(),
        })
        .where(eq(notes.id, id))
        .returning();
      return updated;
    } catch (err) {
      this.logger.error(`[updateNote] Failed updating note ${id}`, err);
      throw new InternalServerErrorException(
        "[updateNote] Failed updating note",
      );
    }
  }

  async deleteNoteById(id: string): Promise<void> {
    await this.getNoteById(id);
    try {
      const deleted = await db
        .delete(notes)
        .where(eq(notes.id, id))
        .returning({ id: notes.id });
    } catch (err) {
      this.logger.error(`Failed deleting note with id ${id}`, err);
      throw new InternalServerErrorException(
        "[deleteNote] Failed deleting note",
      );
    }
  }
}

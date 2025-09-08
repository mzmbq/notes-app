import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  ForbiddenException,
} from "@nestjs/common";
import { CreateNoteDto, UpdateNoteDto } from "./notes.dto";
import { notes } from "src/db/schema/note";
import { db } from "src/database/db";
import { eq, and } from "drizzle-orm";
import { isUUID } from "class-validator";
import { CurrentUser } from "notes-app-types";
import { Note } from "notes-app-types";
import { noteTags, tags } from "src/db/schema/tag";

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);
  async createNote(
    currentUser: CurrentUser,
    dto: CreateNoteDto,
  ): Promise<Note> {
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
          authorId: currentUser.userId,
        })
        .returning();
      return await this.getNoteById(currentUser, note[0].id);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error("[createNote] Failed creating a note", err);
      }
    }
    throw new Error("[createNote] Failed creating a note (Unknown error)");
  }

  async getPaginatedNotes(user: CurrentUser, page: number): Promise<Note[]> {
    // await new Promise((f) => setTimeout(f, 2000));
    try {
      const pageSize = 20;
      const offset = page * pageSize;
      const foundNotes = await db.query.notes.findMany({
        where: eq(notes.authorId, user.userId),
        limit: pageSize,
        offset: offset,
        orderBy: notes.updatedAt,
        with: {
          noteTags: {
            with: { tag: true },
            columns: { noteId: false, tagId: false },
          },
        },
      });

      return foundNotes.map(({ noteTags, ...n }) => ({
        ...n,
        tags: noteTags.map((nt) => nt.tag),
      }));
    } catch (err) {
      this.logger.error(
        `[getNotes] Failed getting notes for user ${user.userId} on page ${page}`,
        err instanceof Error ? err.stack : String(err),
      );

      throw new InternalServerErrorException(
        `[getNotes] Failed getting notes for page ${page}`,
      );
    }
  }

  async getNoteById(currentUser: CurrentUser, id: string): Promise<Note> {
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
    if (currentUser.userId !== note.authorId) {
      throw new ForbiddenException(
        "You can't get / update / delete another user's note",
      );
    }

    const tagsOfNote = await db
      .select({ tag: tags })
      .from(noteTags)
      .innerJoin(tags, eq(noteTags.tagId, tags.id))
      .where(eq(noteTags.noteId, id));

    const noteWithTags: Note = {
      ...note,
      tags: tagsOfNote.map((tag) => tag.tag),
    };
    return noteWithTags;
  }

  async getAllFavoriteNotes(user: CurrentUser): Promise<Note[]> {
    try {
      const foundNotes = await db.query.notes.findMany({
        where: and(eq(notes.authorId, user.userId), eq(notes.isFavorite, true)),
        with: {
          noteTags: {
            with: { tag: true },
            columns: { noteId: false, tagId: false },
          },
        },
      });
      return foundNotes.map(({ noteTags, ...n }) => ({
        ...n,
        tags: noteTags.map((nt) => nt.tag),
      }));
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(
          `[getAllFavoriteNotes] Failed getting all favorite notes of user with id : ${user.userId}`,
          { cause: err },
        );
        throw new Error(
          `[getAllFavoriteNotes] Failed getting all favorite notes of user with id : ${user.userId}, `,
        );
      }
      throw new Error(
        `[getAllFavoriteNotes] Failed getting all favorite notes of user with id : ${user.userId} (Unknown Error)`,
      );
    }
  }

  async getAllNotes(user: CurrentUser): Promise<Note[]> {
    try {
      const foundNotes = await db.query.notes.findMany({
        where: eq(notes.authorId, user.userId),
        with: {
          noteTags: {
            with: { tag: true },
            columns: { noteId: false, tagId: false },
          },
        },
      });
      return foundNotes.map(({ noteTags, ...n }) => ({
        ...n,
        tags: noteTags.map((nt) => nt.tag),
      }));
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(
          `[getAllNotesOfUser] Failed getting all favorite notes of user with id : ${user.userId}`,
          { cause: err },
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

  async updateNote(
    currentUser: CurrentUser,
    id: string,
    dto: UpdateNoteDto,
  ): Promise<Note> {
    await this.getNoteById(currentUser, id);
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
      return await this.getNoteById(currentUser, updated.id);
    } catch (err) {
      // Tempory fix for error handling. Will be handled by exception filter later
      if (err instanceof Error) {
        this.logger.error(`[updateNote] Failed updating note ${id}`, {
          cause: err,
        });
      }
      throw new InternalServerErrorException(
        "[updateNote] Failed updating note",
      );
    }
  }

  async deleteNoteById(currentUser: CurrentUser, id: string): Promise<void> {
    await this.getNoteById(currentUser, id);
    try {
      await db
        .delete(notes)
        .where(eq(notes.id, id))
        .returning({ id: notes.id });
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(`Failed deleting note with id ${id}`, { cause: err });
      }
      throw new InternalServerErrorException(
        "[deleteNoteById] Failed deleting note",
      );
    }
  }
}

import {
  Injectable,
  NotFoundException,
  Logger,
  ForbiddenException,
} from "@nestjs/common";
import { CreateNoteDto, UpdateNoteDto } from "./notes.dto";
import { notes } from "src/db/note";
import { eq, and } from "drizzle-orm";
import { CurrentUser } from "notes-app-types";
import { Note } from "notes-app-types";
import { DatabaseError } from "pg";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async createNote(user: CurrentUser, dto: CreateNoteDto): Promise<Note> {
    // TODO: rename note if title already exists for this user
    try {
      const note = await this.databaseService
        .getDB()
        .insert(notes)
        .values({
          title: dto.title,
          content: dto.content,
          authorId: user.userId,
        })
        .returning();
      return note[0];
    } catch (err) {
      if (err instanceof DatabaseError) {
        // TODO: handle specific DB errors
        this.logger.warn(`[createNote] Unhandled DB error: ${err.constraint}`, {
          cause: err,
        });
      }
      throw err;
    }
  }

  async getPaginatedNotes(user: CurrentUser, page: number): Promise<Note[]> {
    try {
      const pageSize = 20;
      const offset = page * pageSize;

      const foundNotes = await this.databaseService
        .getDB()
        .select()
        .from(notes)
        .where(eq(notes.authorId, user.userId))
        .limit(pageSize)
        .offset(offset)
        .orderBy(notes.updatedAt);

      return foundNotes;
    } catch (err) {
      if (err instanceof DatabaseError) {
        // TODO: handle specific DB errors
        this.logger.warn(
          `[getPaginatedNotes] Unhandled DB error: ${err.constraint}`,
          {
            cause: err,
          },
        );
      }
      throw err;
    }
  }

  async getNoteById(currentUser: CurrentUser, id: string): Promise<Note> {
    try {
      const result = await this.databaseService
        .getDB()
        .select()
        .from(notes)
        .where(eq(notes.id, id));
      const note = result[0];
      if (!note) {
        throw new NotFoundException(`Note with ID "${id}" not found`);
      }
      if (currentUser.userId !== note.authorId) {
        throw new ForbiddenException(
          "You can't get/update/delete another user's note",
        );
      }
      return note;
    } catch (err) {
      if (err instanceof DatabaseError) {
        // TODO: handle specific DB errors
        this.logger.warn(
          `[getNoteById] Unhandled DB error: ${err.constraint}`,
          {
            cause: err,
          },
        );
      }
      throw err;
    }
  }

  async getAllFavoriteNotes(user: CurrentUser): Promise<Note[]> {
    try {
      const foundNotes = await this.databaseService
        .getDB()
        .select()
        .from(notes)
        .where(
          and(eq(notes.authorId, user.userId), eq(notes.isFavorite, true)),
        );
      return foundNotes;
    } catch (err) {
      if (err instanceof DatabaseError) {
        // TODO: handle specific DB errors
        this.logger.warn(
          `[getAllFavoriteNotes] Unhandled DB error: ${err.constraint}`,
          {
            cause: err,
          },
        );
      }
      throw err;
    }
  }

  async getAllNotes(user: CurrentUser): Promise<Note[]> {
    try {
      const foundNotes = await this.databaseService
        .getDB()
        .select()
        .from(notes)
        .where(eq(notes.authorId, user.userId));
      return foundNotes;
    } catch (err) {
      if (err instanceof DatabaseError) {
        // TODO: handle specific DB errors
        this.logger.warn(
          `[getAllNotes] Unhandled DB error: ${err.constraint}`,
          {
            cause: err,
          },
        );
      }
      throw err;
    }
  }

  async updateNote(
    currentUser: CurrentUser,
    id: string,
    dto: UpdateNoteDto,
  ): Promise<Note> {
    // ? Is there a better way to do this?
    await this.getNoteById(currentUser, id);
    try {
      const [updated] = await this.databaseService
        .getDB()
        .update(notes)
        .set({
          title: dto.title,
          content: dto.content,
          isFavorite: dto.isFavorite,
          updatedAt: new Date(),
        })
        .where(eq(notes.id, id))
        .returning();
      return updated;
    } catch (err) {
      if (err instanceof DatabaseError) {
        // TODO: handle specific DB errors
        this.logger.warn(`[updateNote] Unhandled DB error: ${err.constraint}`, {
          cause: err,
        });
      }
      throw err;
    }
  }

  async deleteNoteById(currentUser: CurrentUser, id: string): Promise<void> {
    // ? Is there a better way to do this?
    await this.getNoteById(currentUser, id);
    try {
      await this.databaseService
        .getDB()
        .delete(notes)
        .where(eq(notes.id, id))
        .returning({ id: notes.id });
    } catch (err) {
      if (err instanceof DatabaseError) {
        // TODO: handle specific DB errors
        this.logger.warn(
          `[deleteNoteById] Unhandled DB error: ${err.constraint}`,
          {
            cause: err,
          },
        );
      }
      throw err;
    }
  }
}

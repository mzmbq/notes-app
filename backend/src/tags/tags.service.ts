import { Injectable, Logger, NotFoundException } from "@nestjs/common";
// import { db } from "src/database/db";
import { tags } from "src/db/tag";
import { CurrentUser, Tag } from "notes-app-types";
import { NotesService } from "src/notes/notes.service";
import { eq, and } from "drizzle-orm";
import { CreateTagDto, UpdateTagDto } from "./tags.dto";
import { DatabaseError } from "pg";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);
  constructor(
    private readonly notesService: NotesService,
    private readonly databaseService: DatabaseService,
  ) {}

  async createTag(user: CurrentUser, dto: CreateTagDto): Promise<Tag> {
    try {
      const tag = await this.databaseService
        .getDB()
        .insert(tags)
        .values({
          title: dto.title,
          textColor: dto.textColor,
          backgroundColor: dto.backgroundColor,
          authorId: user.userId,
        })
        .returning();
      return tag[0];
    } catch (err) {
      if (err instanceof DatabaseError) {
        // TODO: handle specific DB errors
        this.logger.warn(`[createTag] Unhandled DB error: ${err.constraint}`, {
          cause: err,
        });
      }
      throw err;
    }
  }

  async getAllTags(user: CurrentUser) {
    try {
      const foundTags = await this.databaseService
        .getDB()
        .select()
        .from(tags)
        .where(eq(tags.authorId, user.userId));
      return foundTags;
    } catch (err) {
      if (err instanceof DatabaseError) {
        // TODO: handle specific DB errors
        this.logger.warn(`[getAllTags] Unhandled DB error: ${err.constraint}`, {
          cause: err,
        });
      }
      throw err;
    }
  }

  async getTagById(user: CurrentUser, id: string): Promise<Tag> {
    try {
      const result = await this.databaseService
        .getDB()
        .select()
        .from(tags)
        .where(and(eq(tags.id, id), eq(tags.authorId, user.userId)));
      const tag = result[0];
      if (!tag) {
        throw new NotFoundException(
          `[getTagById] Tag with ID "${id}" not found`,
        );
      }
      return tag;
    } catch (err) {
      if (err instanceof DatabaseError) {
        // TODO: handle specific DB errors
        this.logger.warn(`[getTagById] Unhandled DB error: ${err.constraint}`, {
          cause: err,
        });
      }
      throw err;
    }
  }

  async getTagByTitle(user: CurrentUser, title: string): Promise<Tag> {
    try {
      const result = await this.databaseService
        .getDB()
        .select()
        .from(tags)
        .where(and(eq(tags.title, title), eq(tags.authorId, user.userId)));
      const tag = result[0];
      if (!tag) {
        throw new NotFoundException(
          `[getTagByTitle] Tag with Title "${title}" not found`,
        );
      }
      return tag;
    } catch (err) {
      if (err instanceof DatabaseError) {
        // TODO: handle specific DB errors
        this.logger.warn(
          `[getTagByTitle] Unhandled DB error: ${err.constraint}`,
          {
            cause: err,
          },
        );
      }
      throw err;
    }
  }

  async updateTag(user: CurrentUser, id: string, dto: UpdateTagDto) {
    // ? Is there a better way to do this?
    await this.getTagById(user, id);
    try {
      const [updated] = await this.databaseService
        .getDB()
        .update(tags)
        .set({ ...dto })
        .where(and(eq(tags.id, id), eq(tags.authorId, user.userId)))
        .returning();
      if (!updated) {
        throw new NotFoundException(
          `[updateTag] Failed updating tag. Tag with id ${id} not found`,
        );
      }
      return updated;
    } catch (err) {
      if (err instanceof DatabaseError) {
        // TODO: handle specific DB errors
        this.logger.warn(`[updateTag] Unhandled DB error: ${err.constraint}`, {
          cause: err,
        });
      }
      throw err;
    }
  }

  async deleteTagById(user: CurrentUser, id: string): Promise<void> {
    // ? Is there a better way to do this?
    await this.getTagById(user, id);
    try {
      const deleted = await this.databaseService
        .getDB()
        .delete(tags)
        .where(eq(tags.id, id))
        .returning({ id: tags.id });
      if (deleted.length === 0) {
        throw new NotFoundException(`Tag with id ${id} not found`);
      }
    } catch (err) {
      if (err instanceof DatabaseError) {
        // TODO: handle specific DB errors
        this.logger.warn(
          `[deleteTagById] Unhandled DB error: ${err.constraint}`,
          {
            cause: err,
          },
        );
      }
      throw err;
    }
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { db } from "src/database/db";
import { tags } from "src/db/tag";
import { CurrentUser, Tag } from "notes-app-types";
import { NotesService } from "src/notes/notes.service";
import { eq, and } from "drizzle-orm";
import { isUUID } from "class-validator";
import { CreateTagDto, UpdateTagDto } from "./tags.dto";

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);
  constructor(private readonly notesService: NotesService) {}

  async createTag(user: CurrentUser, dto: CreateTagDto): Promise<Tag> {
    try {
      const tag = await db
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
      if (err instanceof Error) {
        throw new Error("[createNote] Failed creating a note", err);
      }
      throw new Error("[createNote] Failed creating a note (Unknown error)");
    }
  }

  async getAllTags(user: CurrentUser) {
    try {
      const foundTags = await db
        .select()
        .from(tags)
        .where(eq(tags.authorId, user.userId));
      return foundTags;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(
          `[getAllTags] Failed getting all tags of user with id : ${user.userId}}, `,
          err,
        );
      }
      throw new Error(
        `[getAllTags] Failed getting all tags of user with id : ${user.userId} (Unknown Error)`,
      );
    }
  }

  async getTagById(user: CurrentUser, id: string): Promise<Tag> {
    if (!isUUID(id)) {
      throw new BadRequestException(
        `[getTagById] Invalid tag ID format: "${id}"`,
      );
    }
    const result = await db
      .select()
      .from(tags)
      .where(and(eq(tags.id, id), eq(tags.authorId, user.userId)));
    const tag = result[0];
    if (!tag) {
      throw new NotFoundException(`[getTagById] Tag with ID "${id}" not found`);
    }
    return tag;
  }

  async getTagByTitle(user: CurrentUser, title: string): Promise<Tag> {
    const result = await db
      .select()
      .from(tags)
      .where(and(eq(tags.title, title), eq(tags.authorId, user.userId)));
    const tag = result[0];
    if (!tag) {
      throw new NotFoundException(
        `[getTagById] Tag with Title "${title}" not found`,
      );
    }
    return tag;
  }

  async updateTag(user: CurrentUser, id: string, dto: UpdateTagDto) {
    try {
      const [updated] = await db
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

  async deleteTagById(id: string): Promise<void> {
    try {
      const deleted = await db
        .delete(tags)
        .where(eq(tags.id, id))
        .returning({ id: tags.id });
      if (deleted.length === 0) {
        throw new NotFoundException(`Tag with id ${id} not found`);
      }
    } catch (err) {
      if (err instanceof NotFoundException) throw err;

      this.logger.error(
        `Failed deleting tag with id ${id}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw new InternalServerErrorException(
        "[deleteTagById] Failed deleting tag",
      );
    }
  }
}

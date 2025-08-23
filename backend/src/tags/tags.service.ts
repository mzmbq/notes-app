import { Injectable, Logger } from "@nestjs/common";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { db } from "src/database/db";
import { tags } from "src/db/tag";
import { Tag } from "./entities/tag.entity";
import { CurrentUser } from "notes-app-types";
import { NotesService } from "src/notes/notes.service";
import { eq, and } from "drizzle-orm";

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);
  constructor(private readonly notesService: NotesService) {}

  async createTag(user: CurrentUser, dto: CreateTagDto): Promise<Tag> {
    try {
      const tag = await db
        .insert(tags)
        .values({
          authorId: user.userId,
          name: dto.name,
          textColor: dto.textColor,
          backgroundColor: dto.backgroundColor,
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

  getTagById(id: number) {
    return `This action returns a #${id} tag`;
  }

  updateTag(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  deleteTag(id: number) {
    return `This action removes a #${id} tag`;
  }
}

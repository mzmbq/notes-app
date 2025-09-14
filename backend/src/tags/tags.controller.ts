import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { TagsService } from "./tags.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { CurrentUser as CurrentUserDecorator } from "src/common/decorators/current-user.decorator";
import type { CurrentUser } from "notes-app-types";
import { CreateTagDto, UpdateTagDto } from "./tags.dto";

@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @CurrentUserDecorator() user: CurrentUser,
    @Body() createTagDto: CreateTagDto,
  ) {
    return this.tagsService.createTag(user, createTagDto);
  }

  @Post(":tagId/notes/:noteId")
  @UseGuards(AuthGuard)
  addTagToNote(
    @CurrentUserDecorator() user: CurrentUser,
    @Param("tagId") tagId: string,
    @Param("noteId") noteId: string,
  ) {
    return this.tagsService.addTagToNote(user, tagId, noteId);
  }

  @Delete(":tagId/notes/:noteId")
  @UseGuards(AuthGuard)
  removeTagFromNote(
    @CurrentUserDecorator() user: CurrentUser,
    @Param("tagId") tagId: string,
    @Param("noteId") noteId: string,
  ) {
    return this.tagsService.removeTagFromNote(user, tagId, noteId);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAllTags(@CurrentUserDecorator() user: CurrentUser) {
    return this.tagsService.getAllTags(user);
  }

  @Get("note/:id")
  @UseGuards(AuthGuard)
  getTagsByNote(
    @CurrentUserDecorator() user: CurrentUser,
    @Param("id") id: string,
  ) {
    return this.tagsService.getTagsByNote(user, id);
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  getTagById(
    @CurrentUserDecorator() user: CurrentUser,
    @Param("id") id: string,
  ) {
    return this.tagsService.getTagById(user, id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  updateTag(
    @CurrentUserDecorator() user: CurrentUser,
    @Param("id") id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.updateTag(user, id, updateTagDto);
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  deleteTag(
    @CurrentUserDecorator() user: CurrentUser,
    @Param("id") id: string,
  ) {
    return this.tagsService.deleteTagById(user, id);
  }
}

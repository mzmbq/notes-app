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

  @Get()
  @UseGuards(AuthGuard)
  getAllTags(@CurrentUserDecorator() user: CurrentUser) {
    return this.tagsService.getAllTags(user);
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
    return this.tagsService.deleteTagById(id);
  }
}

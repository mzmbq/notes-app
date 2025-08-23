import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { TagsService } from "./tags.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";

@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(createTagDto);
  }

  @Get()
  getAllTags() {
    return this.tagsService.getAllTags();
  }

  @Get(":id")
  getTagById(@Param("id") id: string) {
    return this.tagsService.getTagById(+id);
  }

  @Patch(":id")
  updateTag(@Param("id") id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.updateTag(+id, updateTagDto);
  }

  @Delete(":id")
  deleteTag(@Param("id") id: string) {
    return this.tagsService.deleteTag(+id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { NotesService } from "./notes.service";
import { CreateNoteDto, UpdateNoteDto } from "./notes.dto";
import type { Note, CurrentUser } from "notes-app-types";
import { CurrentUser as CurrentUserDecorator } from "src/common/decorators/current-user.decorator";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Controller({ path: "notes" })
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createNote(
    @CurrentUserDecorator() user: CurrentUser,
    @Body() dto: CreateNoteDto,
  ): Promise<Note> {
    return this.notesService.createNote(user, dto);
  }
  @UseGuards(AuthGuard)
  @Get("/all")
  async getAllNotes(
    @CurrentUserDecorator() user: CurrentUser,
  ): Promise<Note[]> {
    return this.notesService.getAllNotes(user);
  }

  @UseGuards(AuthGuard)
  @Get("/favorites")
  async getAllFavoriteNotes(
    @CurrentUserDecorator() user: CurrentUser,
  ): Promise<Note[]> {
    return this.notesService.getAllFavoriteNotes(user);
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  async getNoteById(@Param("id") id: string): Promise<Note> {
    return this.notesService.getNoteById(id);
  }

  @UseGuards(AuthGuard)
  @Patch(":id")
  async updateNote(
    @Param("id") id: string,
    @Body() dto: UpdateNoteDto,
  ): Promise<Note> {
    return this.notesService.updateNote(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  async deleteNoteById(@Param("id") id: string): Promise<void> {
    return this.notesService.deleteNoteById(id);
  }
}

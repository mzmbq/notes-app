import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { NotesService } from "./notes.service";
import { CreateNoteDto, UpdateNoteDto } from "./notes.dto";
import { Note } from "src/types/note";

@Controller({ path: "notes" })
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  async createNote(@Body() dto: CreateNoteDto): Promise<Note> {
    return this.notesService.createNote(dto);
  }

  @Get("/all")
  async getAllNotes(): Promise<Note[]> {
    return this.notesService.getAllNotes();
  }

  @Get("/favorites")
  async getAllFavoriteNotes(): Promise<Note[]> {
    return this.notesService.getAllFavoriteNotes();
  }

  @Get(":id")
  async getNoteById(@Param("id") id: string): Promise<Note> {
    return this.notesService.getNoteById(id);
  }

  @Patch(":id")
  async updateNote(
    @Param("id") id: string,
    @Body() dto: UpdateNoteDto,
  ): Promise<Note> {
    return this.notesService.updateNote(id, dto);
  }

  @Delete(":id")
  async deleteNoteById(@Param("id") id: string): Promise<boolean> {
    return this.notesService.deleteNoteById(id);
  }
}

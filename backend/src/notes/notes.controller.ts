import { Body, Controller, Post } from "@nestjs/common";
import { NotesService } from "./notes.service";
import { CreateNoteDto } from "./notes.dto";
import { Note } from "src/types/note";

@Controller({ path: "note" })
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  async createNote(@Body() dto: CreateNoteDto): Promise<Note> {
    return this.notesService.createNote(dto);
  }
}

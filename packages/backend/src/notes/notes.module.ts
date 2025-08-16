import { db } from "src/database/db";
import { NotesService } from "./notes.service";
import { NotesController } from "./notes.controller";
import { Module } from "@nestjs/common";

@Module({
  providers: [NotesService, { provide: "DB", useValue: db }],
  exports: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}

import { NotesService } from "./notes.service";
import { NotesController } from "./notes.controller";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";

@Module({
  providers: [NotesService],
  exports: [NotesService],
  controllers: [NotesController],
  imports: [DatabaseModule],
})
export class NotesModule {}

import { Module } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { TagsController } from "./tags.controller";
import { NotesModule } from "src/notes/notes.module";
import { DatabaseModule } from "src/database/database.module";

@Module({
  imports: [NotesModule, DatabaseModule],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}

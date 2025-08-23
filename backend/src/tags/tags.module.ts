import { db } from "src/database/db";
import { Module } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { TagsController } from "./tags.controller";
import { NotesModule } from "src/notes/notes.module";

@Module({
  imports: [NotesModule],
  controllers: [TagsController],
  providers: [TagsService, { provide: "DB", useValue: db }],
  exports: [TagsService],
})
export class TagsModule {}

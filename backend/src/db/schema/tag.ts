import { varchar, uuid, primaryKey, pgTable } from "drizzle-orm/pg-core";
import { users } from "./user";
import { notes } from "./note";

export const tags = pgTable("tag", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title").notNull(),
  textColor: varchar("text_color").notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  backgroundColor: varchar("background_color").notNull(),
});

export const noteTags = pgTable(
  "note_tag",
  {
    noteId: uuid("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.noteId, t.tagId] }),
  }),
);

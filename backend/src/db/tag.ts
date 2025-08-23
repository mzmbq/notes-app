import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { users } from "./user";

export const tags = pgTable("tag", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title").notNull(),
  textColor: varchar("text_color").notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id),
  backgroundColor: varchar("background_color").notNull(),
});

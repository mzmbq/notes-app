import {
  timestamp,
  uuid,
  varchar,
  boolean,
  pgTable,
} from "drizzle-orm/pg-core";
import { users } from "./user";

export const notes = pgTable("note", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title").notNull(),
  content: varchar("content").notNull(),
  isFavorite: boolean("is_favorite").notNull().default(false),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

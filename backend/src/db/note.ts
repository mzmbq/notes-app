import { relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./user";
import { tags } from "./tag";

export const notes = pgTable("note", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title").notNull(),
  content: varchar("content").notNull(),
  isFavorite: boolean("is_favorite").notNull().default(false),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  notes: many(notes),
  tags: many(tags),
}));

export const tagRelations = relations(tags, ({ one, many }) => ({
  notes: many(notes),
  user: one(users, {
    fields: [tags.authorId],
    references: [users.id],
  }),
}));

export const noteRelations = relations(notes, ({ one, many }) => ({
  user: one(users, {
    fields: [notes.authorId],
    references: [users.id],
  }),
  tags: many(tags),
}));

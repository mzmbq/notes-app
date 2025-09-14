import { relations } from "drizzle-orm";
import { notes } from "./note";
import { noteTags, tags } from "./tag";
import { users } from "./user";

export const userRelations = relations(users, ({ many }) => ({
  notes: many(notes),
  tags: many(tags),
}));
export const noteRelations = relations(notes, ({ one, many }) => ({
  user: one(users, { fields: [notes.authorId], references: [users.id] }),
  noteTags: many(noteTags),
}));
export const tagRelations = relations(tags, ({ one, many }) => ({
  user: one(users, { fields: [tags.authorId], references: [users.id] }),
  noteTags: many(noteTags),
}));
export const noteTagRelations = relations(noteTags, ({ one }) => ({
  note: one(notes, { fields: [noteTags.noteId], references: [notes.id] }),
  tag: one(tags, { fields: [noteTags.tagId], references: [tags.id] }),
}));

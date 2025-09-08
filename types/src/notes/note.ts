import type { Tag } from "./tag.js";

export type Note = {
  id: string;
  authorId?: string;
  title: string;
  content: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
};

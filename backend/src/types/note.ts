export type Note = {
  id: string;
  authorId?: string;
  title: string;
  content: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
};

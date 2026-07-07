import { Category } from '../categories/category.model';

export interface Note {
  id: number;
  title: string;
  content: string | null;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content?: string;
  categoryIds?: number[];
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  categoryIds?: number[];
}

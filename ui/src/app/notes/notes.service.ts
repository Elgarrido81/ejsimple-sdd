import { Injectable } from '@angular/core';

export interface Note {
  id: number;
  title: string;
  content: string | null;
  categories: { id: number; name: string; color: string | null; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedNotes {
  data: Note[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly apiUrl = '/api/v1/notes';

  async getAll(categoryId?: number, page: number = 1, limit: number = 10): Promise<PaginatedNotes> {
    const params = new URLSearchParams();
    if (categoryId) params.set('categoryId', String(categoryId));
    params.set('page', String(page));
    params.set('limit', String(limit));
    const res = await fetch(`${this.apiUrl}?${params}`);
    return res.json();
  }

  async getById(id: number): Promise<Note> {
    const res = await fetch(`${this.apiUrl}/${id}`);
    return res.json();
  }

  async create(dto: CreateNoteDto): Promise<Note> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Error al crear nota');
    return res.json();
  }

  async update(id: number, dto: UpdateNoteDto): Promise<Note> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Error al actualizar nota');
    return res.json();
  }

  async delete(id: number): Promise<void> {
    const res = await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar nota');
  }
}

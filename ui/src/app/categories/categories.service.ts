import { Injectable } from '@angular/core';

export interface Category {
  id: number;
  name: string;
  color: string | null;
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
  color?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  color?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly apiUrl = '/api/v1/categories';

  async getAll(): Promise<Category[]> {
    const res = await fetch(this.apiUrl);
    return res.json();
  }

  async getById(id: number): Promise<Category> {
    const res = await fetch(`${this.apiUrl}/${id}`);
    return res.json();
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Error al crear categoría');
    return res.json();
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Error al actualizar categoría');
    return res.json();
  }

  async delete(id: number): Promise<void> {
    const res = await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar categoría');
  }
}

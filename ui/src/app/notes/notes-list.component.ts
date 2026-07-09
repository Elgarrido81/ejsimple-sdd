import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotesService, Note, PaginatedNotes } from './notes.service';
import { CategoriesService, Category } from '../categories/categories.service';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Mis Notas</h1>
        <a routerLink="/notes/new" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva Nota
        </a>
      </div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>

      <div class="filter-bar" *ngIf="categories.length > 0">
        <label>Filtrar por categoría</label>
        <select [(ngModel)]="filterCategoryId" (change)="goToPage(1)">
          <option [ngValue]="undefined">Todas las notas</option>
          <option *ngFor="let cat of categories" [ngValue]="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="notes-grid" *ngIf="notes.length > 0">
        <div *ngFor="let note of notes" class="note-card card">
          <div class="note-body">
            <h3 class="note-title">{{ note.title }}</h3>
            <p class="note-content">{{ note.content || 'Sin contenido' }}</p>
            <div class="note-meta">
              <span class="note-date">{{ note.createdAt | date:'mediumDate' }}</span>
              <div class="note-categories" *ngIf="note.categories && note.categories.length > 0">
                <span class="badge" *ngFor="let cat of note.categories" [style.background]="cat.color || '#6c757d'">
                  {{ cat.name }}
                </span>
              </div>
            </div>
          </div>
          <div class="note-actions">
            <a [routerLink]="['/notes', note.id, 'edit']" class="btn btn-secondary btn-sm">Editar</a>
            <button (click)="deleteNote(note.id)" class="btn btn-danger btn-sm">Eliminar</button>
          </div>
        </div>
      </div>

      <div class="pagination" *ngIf="totalPages > 1">
        <button class="btn btn-secondary btn-sm" [disabled]="page <= 1" (click)="goToPage(page - 1)">
          Anterior
        </button>
        <span class="page-info">Página {{ page }} de {{ totalPages }} ({{ total }} notas)</span>
        <button class="btn btn-secondary btn-sm" [disabled]="page >= totalPages" (click)="goToPage(page + 1)">
          Siguiente
        </button>
      </div>

      <div class="empty-state" *ngIf="notes.length === 0">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-border); margin-bottom: 16px;">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <p>No hay notas aún.</p>
        <a routerLink="/notes/new" class="btn btn-primary">Crea tu primera nota</a>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      padding: 16px 20px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
    }
    .filter-bar label { margin-bottom: 0; white-space: nowrap; }
    .filter-bar select { width: auto; min-width: 200px; }
    .notes-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .note-card {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      padding: 20px 24px;
    }
    .note-body { flex: 1; min-width: 0; }
    .note-title {
      font-size: 1.05rem;
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--color-text);
    }
    .note-content {
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 10px;
      line-height: 1.5;
    }
    .note-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .note-date { font-size: 0.8rem; color: var(--color-text-secondary); }
    .note-categories { display: flex; gap: 4px; flex-wrap: wrap; }
    .note-actions {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
    }
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-top: 28px;
      padding: 16px 0;
    }
    .page-info {
      font-size: 0.9rem;
      color: var(--color-text-secondary);
    }
  `]
})
export class NotesListComponent implements OnInit {
  notes: Note[] = [];
  categories: Category[] = [];
  filterCategoryId: number | undefined = undefined;
  page = 1;
  total = 0;
  totalPages = 0;
  readonly limit = 10;
  error = '';

  constructor(
    private notesService: NotesService,
    private categoriesService: CategoriesService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.categories = await this.categoriesService.getAll();
    } catch {
      this.error = 'Error al cargar categorías';
    }
    await this.loadNotes();
    this.cdr.detectChanges();
  }

  async loadNotes(): Promise<void> {
    try {
      const result = await this.notesService.getAll(this.filterCategoryId, this.page, this.limit);
      this.notes = result.data;
      this.total = result.total;
      this.totalPages = result.totalPages;
    } catch {
      this.error = 'Error al cargar notas';
    }
  }

  async goToPage(page: number): Promise<void> {
    this.page = page;
    this.error = '';
    await this.loadNotes();
    this.cdr.detectChanges();
  }

  async deleteNote(id: number): Promise<void> {
    this.error = '';
    try {
      await this.notesService.delete(id);
      this.notes = this.notes.filter(n => n.id !== id);
      this.total--;
      if (this.notes.length === 0 && this.page > 1) {
        await this.goToPage(this.page - 1);
      }
    } catch {
      this.error = 'Error al eliminar la nota';
    }
    this.cdr.detectChanges();
  }
}

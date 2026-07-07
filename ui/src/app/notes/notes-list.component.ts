import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotesService } from './notes.service';
import { CategoriesService } from '../categories/categories.service';
import { Note } from './note.model';
import { Category } from '../categories/category.model';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="notes-container">
      <h1>Mis Notas</h1>

      <div class="toolbar">
        <a routerLink="/notes/new" class="btn-create">+ Nueva Nota</a>
        <a routerLink="/categories" class="btn-categories">Gestionar Categorías</a>
      </div>

      <div class="filter-bar" *ngIf="categories.length > 0">
        <label>Filtrar por categoría:</label>
        <select [(ngModel)]="filterCategoryId" (change)="applyFilter()">
          <option [ngValue]="undefined">Todas</option>
          <option *ngFor="let cat of categories" [ngValue]="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="notes-grid">
        <div *ngFor="let note of notes" class="note-card">
          <h3>{{ note.title }}</h3>
          <p>{{ note.content || 'Sin contenido' }}</p>
          <div class="categories-row" *ngIf="note.categories && note.categories.length > 0">
            <span
              class="category-badge"
              *ngFor="let cat of note.categories"
              [style.background]="cat.color || '#6c757d'"
            >{{ cat.name }}</span>
          </div>
          <small>Creado: {{ note.createdAt | date:'short' }}</small>
          <div class="card-actions">
            <a [routerLink]="['/notes', note.id, 'edit']">Editar</a>
            <button (click)="deleteNote(note.id)">Eliminar</button>
          </div>
        </div>
      </div>

      <p *ngIf="notes.length === 0" class="empty">No hay notas aún. ¡Crea una!</p>
    </div>
  `,
  styles: [`
    .notes-container { padding: 20px; max-width: 800px; margin: 0 auto; }
    .toolbar { display: flex; gap: 12px; margin-bottom: 16px; }
    .btn-create { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
    .btn-categories { display: inline-block; padding: 10px 20px; background: #6c757d; color: white; text-decoration: none; border-radius: 4px; }
    .filter-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
    .filter-bar select { padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px; }
    .notes-grid { display: grid; gap: 16px; }
    .note-card { border: 1px solid #ddd; padding: 16px; border-radius: 8px; }
    .note-card h3 { margin: 0 0 8px; }
    .note-card p { color: #555; }
    .categories-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
    .category-badge { padding: 2px 10px; border-radius: 12px; color: white; font-size: 0.8em; }
    .card-actions { margin-top: 12px; display: flex; gap: 12px; }
    .card-actions a { color: #007bff; cursor: pointer; }
    .card-actions button { color: #dc3545; border: none; background: none; cursor: pointer; }
    .empty { color: #999; text-align: center; margin-top: 40px; }
  `]
})
export class NotesListComponent implements OnInit {
  notes: Note[] = [];
  categories: Category[] = [];
  filterCategoryId: number | undefined = undefined;

  constructor(
    private notesService: NotesService,
    private categoriesService: CategoriesService,
  ) {}

  ngOnInit(): void {
    this.categoriesService.getAll().subscribe(c => this.categories = c);
    this.loadNotes();
  }

  private loadNotes(): void {
    this.notesService.getAll(this.filterCategoryId).subscribe(n => this.notes = n);
  }

  applyFilter(): void {
    this.loadNotes();
  }

  deleteNote(id: number): void {
    this.notesService.delete(id).subscribe(() => {
      this.notes = this.notes.filter(n => n.id !== id);
    });
  }
}

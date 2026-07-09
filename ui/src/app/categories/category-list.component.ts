import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriesService, Category } from './categories.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Categorías</h1>
        <a routerLink="/categories/new" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva Categoría
        </a>
      </div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>

      <div class="categories-list" *ngIf="categories.length > 0">
        <div *ngFor="let cat of categories" class="category-card card">
          <div class="category-info">
            <span class="badge" [style.background]="cat.color || '#6c757d'">
              {{ cat.name }}
            </span>
            <span class="category-color">{{ cat.color || 'Sin color' }}</span>
          </div>
          <div class="category-actions">
            <a [routerLink]="['/categories', cat.id, 'edit']" class="btn btn-secondary btn-sm">Editar</a>
            <button (click)="deleteCategory(cat.id)" class="btn btn-danger btn-sm">Eliminar</button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="categories.length === 0">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-border); margin-bottom: 16px;">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
        <p>No hay categorías aún.</p>
        <a routerLink="/categories/new" class="btn btn-primary">Crea tu primera categoría</a>
      </div>
    </div>
  `,
  styles: [`
    .categories-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .category-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
    }
    .category-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .category-color {
      font-size: 0.85rem;
      color: var(--color-text-secondary);
      font-family: monospace;
    }
    .category-actions {
      display: flex;
      gap: 6px;
    }
  `]
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  error = '';

  constructor(
    private categoriesService: CategoriesService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.categories = await this.categoriesService.getAll();
    } catch {
      this.error = 'Error al cargar categorías';
    }
    this.cdr.detectChanges();
  }

  async deleteCategory(id: number): Promise<void> {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    this.error = '';
    try {
      await this.categoriesService.delete(id);
      this.categories = this.categories.filter(c => c.id !== id);
    } catch {
      this.error = 'Error al eliminar la categoría';
    }
    this.cdr.detectChanges();
  }
}

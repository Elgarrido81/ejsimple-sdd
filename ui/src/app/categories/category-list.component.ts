import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriesService } from './categories.service';
import { Category } from './category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <h1>Categorías</h1>
      <a routerLink="/categories/new" class="btn-create">+ Nueva Categoría</a>

      <table class="table" *ngIf="categories.length > 0">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Color</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let cat of categories">
            <td>{{ cat.name }}</td>
            <td>
              <span class="color-badge" [style.background]="cat.color || '#ccc'">
                {{ cat.color || 'Ninguno' }}
              </span>
            </td>
            <td class="actions">
              <a [routerLink]="['/categories', cat.id, 'edit']">Editar</a>
              <button (click)="deleteCategory(cat.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p *ngIf="categories.length === 0" class="empty">No hay categorías aún.</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 800px; margin: 0 auto; }
    .btn-create { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; margin-bottom: 20px; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }
    .color-badge { display: inline-block; padding: 2px 10px; border-radius: 12px; color: white; font-size: 0.85em; }
    .actions { display: flex; gap: 12px; }
    .actions a { color: #007bff; cursor: pointer; }
    .actions button { color: #dc3545; border: none; background: none; cursor: pointer; }
    .empty { color: #999; text-align: center; margin-top: 40px; }
  `]
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.categoriesService.getAll().subscribe(c => this.categories = c);
  }

  deleteCategory(id: number): void {
    this.categoriesService.delete(id).subscribe(() => {
      this.categories = this.categories.filter(c => c.id !== id);
    });
  }
}

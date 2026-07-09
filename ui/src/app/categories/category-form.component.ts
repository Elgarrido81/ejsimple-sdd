import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriesService } from './categories.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>{{ isEdit ? 'Editar Categoría' : 'Nueva Categoría' }}</h1>
        <a routerLink="/categories" class="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Volver
        </a>
      </div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>

      <div class="form-card">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input id="name" [(ngModel)]="name" placeholder="Ej: Trabajo, Personal, Salud..." required />
        </div>

        <div class="form-group">
          <label for="color">Color</label>
          <div class="color-picker-row">
            <input id="color" [(ngModel)]="color" placeholder="#4f46e5" />
            <span class="color-swatch" [style.background]="color || '#ccc'"></span>
          </div>
          <p class="form-hint">Código hexadecimal (opcional). Ej: #ff6b6b</p>
        </div>

        <div class="form-actions">
          <button (click)="save()" [disabled]="!name.trim()" class="btn btn-primary">
            {{ isEdit ? 'Actualizar Categoría' : 'Crear Categoría' }}
          </button>
          <a routerLink="/categories" class="btn btn-secondary">Cancelar</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .color-picker-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .color-picker-row input { flex: 1; }
    .color-swatch {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-sm);
      border: 2px solid var(--color-border);
      flex-shrink: 0;
    }
    .form-hint {
      font-size: 0.8rem;
      color: var(--color-text-secondary);
      margin-top: 4px;
    }
    .form-actions { margin-top: 24px; }
  `]
})
export class CategoryFormComponent implements OnInit {
  name = '';
  color = '';
  isEdit = false;
  private categoryId?: number;
  error = '';

  constructor(
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.categoryId = Number(id);
      try {
        const cat = await this.categoriesService.getById(this.categoryId);
        this.name = cat.name;
        this.color = cat.color || '';
      } catch {
        this.error = 'Error al cargar la categoría';
        this.router.navigate(['/categories']);
      }
    }
    this.cdr.detectChanges();
  }

  async save(): Promise<void> {
    if (!this.name.trim()) return;

    const dto: any = { name: this.name.trim() };
    if (this.color.trim()) dto.color = this.color.trim();

    try {
      if (this.isEdit && this.categoryId) {
        await this.categoriesService.update(this.categoryId, dto);
      } else {
        await this.categoriesService.create(dto);
      }
      this.router.navigate(['/categories']);
    } catch {
      this.error = 'Error al guardar la categoría';
    }
  }
}

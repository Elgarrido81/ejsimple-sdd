import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriesService } from './categories.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="form-container">
      <h1>{{ isEdit ? 'Editar Categoría' : 'Nueva Categoría' }}</h1>

      <div class="form-group">
        <label for="name">Nombre</label>
        <input id="name" [(ngModel)]="name" placeholder="Nombre de la categoría" required />
      </div>

      <div class="form-group">
        <label for="color">Color (hex)</label>
        <div class="color-row">
          <input id="color" [(ngModel)]="color" placeholder="#007bff" />
          <span class="color-preview" [style.background]="color || '#ccc'"></span>
        </div>
      </div>

      <div class="form-actions">
        <button (click)="save()" [disabled]="!name.trim()">Guardar</button>
        <a routerLink="/categories">Cancelar</a>
      </div>
    </div>
  `,
  styles: [`
    .form-container { padding: 20px; max-width: 600px; margin: 0 auto; }
    .form-group { margin-bottom: 16px; }
    label { display: block; margin-bottom: 4px; font-weight: bold; }
    input, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .color-row { display: flex; align-items: center; gap: 10px; }
    .color-row input { flex: 1; }
    .color-preview { width: 36px; height: 36px; border-radius: 4px; border: 1px solid #ddd; }
    .form-actions { display: flex; gap: 12px; margin-top: 20px; }
    button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { opacity: 0.5; }
    a { padding: 10px 20px; color: #555; text-decoration: none; }
  `]
})
export class CategoryFormComponent implements OnInit {
  name = '';
  color = '';
  isEdit = false;
  private categoryId?: number;

  constructor(
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.categoryId = Number(id);
      this.categoriesService.getById(this.categoryId).subscribe(cat => {
        this.name = cat.name;
        this.color = cat.color || '';
      });
    }
  }

  save(): void {
    if (!this.name.trim()) return;

    const dto = { name: this.name.trim(), color: this.color.trim() || undefined };

    const request = this.isEdit && this.categoryId
      ? this.categoriesService.update(this.categoryId, dto)
      : this.categoriesService.create(dto);

    request.subscribe(() => this.router.navigate(['/categories']));
  }
}

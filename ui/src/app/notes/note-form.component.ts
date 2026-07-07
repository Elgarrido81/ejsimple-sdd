import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotesService } from './notes.service';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/category.model';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="form-container">
      <h1>{{ isEdit ? 'Editar Nota' : 'Nueva Nota' }}</h1>

      <div class="form-group">
        <label for="title">Título</label>
        <input id="title" [(ngModel)]="title" placeholder="Título de la nota" required />
      </div>

      <div class="form-group">
        <label for="content">Contenido</label>
        <textarea id="content" [(ngModel)]="content" placeholder="Contenido (opcional)" rows="6"></textarea>
      </div>

      <div class="form-group" *ngIf="categories.length > 0">
        <label>Categorías</label>
        <div class="checkbox-group">
          <label *ngFor="let cat of categories" class="checkbox-label">
            <input type="checkbox" [checked]="selectedCategoryIds.has(cat.id)" (change)="toggleCategory(cat.id)" />
            <span class="cat-badge" [style.background]="cat.color || '#6c757d'">{{ cat.name }}</span>
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button (click)="save()" [disabled]="!title.trim()">Guardar</button>
        <a routerLink="/notes">Cancelar</a>
      </div>
    </div>
  `,
  styles: [`
    .form-container { padding: 20px; max-width: 600px; margin: 0 auto; }
    .form-group { margin-bottom: 16px; }
    label { display: block; margin-bottom: 4px; font-weight: bold; }
    input, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .checkbox-group { display: flex; flex-wrap: wrap; gap: 10px; }
    .checkbox-label { display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer; }
    .cat-badge { padding: 2px 10px; border-radius: 12px; color: white; font-size: 0.85em; }
    .form-actions { display: flex; gap: 12px; }
    button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { opacity: 0.5; }
    a { padding: 10px 20px; color: #555; text-decoration: none; }
  `]
})
export class NoteFormComponent implements OnInit {
  title = '';
  content = '';
  isEdit = false;
  private noteId?: number;
  categories: Category[] = [];
  selectedCategoryIds = new Set<number>();

  constructor(
    private notesService: NotesService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.categoriesService.getAll().subscribe(cats => {
      this.categories = cats;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.noteId = Number(id);
      this.notesService.getById(this.noteId).subscribe(note => {
        this.title = note.title;
        this.content = note.content || '';
        this.selectedCategoryIds = new Set((note.categories || []).map(c => c.id));
      });
    }
  }

  toggleCategory(id: number): void {
    if (this.selectedCategoryIds.has(id)) {
      this.selectedCategoryIds.delete(id);
    } else {
      this.selectedCategoryIds.add(id);
    }
  }

  save(): void {
    if (!this.title.trim()) return;

    const dto: any = { title: this.title.trim(), content: this.content.trim() || undefined };
    if (this.selectedCategoryIds.size > 0) {
      dto.categoryIds = Array.from(this.selectedCategoryIds);
    }

    const request = this.isEdit && this.noteId
      ? this.notesService.update(this.noteId, dto)
      : this.notesService.create(dto);

    request.subscribe(() => this.router.navigate(['/notes']));
  }
}

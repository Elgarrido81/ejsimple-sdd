import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotesService, Note } from './notes.service';
import { CategoriesService, Category } from '../categories/categories.service';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>{{ isEdit ? 'Editar Nota' : 'Nueva Nota' }}</h1>
        <a routerLink="/notes" class="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Volver
        </a>
      </div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>

      <div class="form-card">
        <div class="form-group">
          <label for="title">Título</label>
          <input id="title" [(ngModel)]="title" placeholder="¿De qué se trata esta nota?" required />
        </div>

        <div class="form-group">
          <label for="content">Contenido</label>
          <textarea id="content" [(ngModel)]="content" placeholder="Escribe aquí..." rows="8"></textarea>
        </div>

        <div class="form-group" *ngIf="categories.length > 0">
          <label>Categorías</label>
          <div class="checkbox-group">
            <label *ngFor="let cat of categories" class="checkbox-label">
              <input type="checkbox" [checked]="selectedCategoryIds.has(cat.id)" (change)="toggleCategory(cat.id)" />
              <span class="badge" [style.background]="cat.color || '#6c757d'">{{ cat.name }}</span>
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button (click)="save()" [disabled]="!title.trim() || saving" class="btn btn-primary">
            {{ saving ? 'Guardando...' : (isEdit ? 'Actualizar Nota' : 'Crear Nota') }}
          </button>
          <a routerLink="/notes" class="btn btn-secondary">Cancelar</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px;
    }
    .checkbox-label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      text-transform: none;
      letter-spacing: normal;
      color: var(--color-text);
    }
    .checkbox-label input[type="checkbox"] {
      width: auto;
      accent-color: var(--color-primary);
    }
  `]
})
export class NoteFormComponent implements OnInit {
  title = '';
  content = '';
  isEdit = false;
  private noteId?: number;
  categories: Category[] = [];
  selectedCategoryIds = new Set<number>();
  error = '';
  saving = false;

  constructor(
    private notesService: NotesService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.categories = await this.categoriesService.getAll();
    } catch {
      this.error = 'Error al cargar categorías';
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.noteId = Number(id);
      try {
        const note = await this.notesService.getById(this.noteId);
        this.title = note.title;
        this.content = note.content || '';
        this.selectedCategoryIds = new Set((note.categories || []).map(c => c.id));
      } catch {
        this.error = 'Error al cargar la nota';
        this.router.navigate(['/notes']);
      }
    }
    this.cdr.detectChanges();
  }

  toggleCategory(id: number): void {
    if (this.selectedCategoryIds.has(id)) {
      this.selectedCategoryIds.delete(id);
    } else {
      this.selectedCategoryIds.add(id);
    }
  }

  async save(): Promise<void> {
    if (!this.title.trim()) return;

    this.error = '';
    this.saving = true;

    try {
      const dto: any = { title: this.title.trim(), content: this.content.trim() || undefined };
      if (this.selectedCategoryIds.size > 0) {
        dto.categoryIds = Array.from(this.selectedCategoryIds);
      }

      if (this.isEdit && this.noteId) {
        await this.notesService.update(this.noteId, dto);
      } else {
        await this.notesService.create(dto);
      }
      this.router.navigate(['/notes']);
    } catch {
      this.error = 'Error al guardar la nota. Verifica que el backend esté corriendo.';
      this.saving = false;
    }
  }
}

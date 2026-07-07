import { Routes } from '@angular/router';
import { NotesListComponent } from './notes/notes-list.component';
import { NoteFormComponent } from './notes/note-form.component';
import { CategoryListComponent } from './categories/category-list.component';
import { CategoryFormComponent } from './categories/category-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'notes', pathMatch: 'full' },
  { path: 'notes', component: NotesListComponent },
  { path: 'notes/new', component: NoteFormComponent },
  { path: 'notes/:id/edit', component: NoteFormComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/new', component: CategoryFormComponent },
  { path: 'categories/:id/edit', component: CategoryFormComponent },
];

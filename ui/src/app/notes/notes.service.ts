import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note, CreateNoteDto, UpdateNoteDto } from './note.model';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly apiUrl = '/api/v1/notes';

  constructor(private http: HttpClient) {}

  getAll(categoryId?: number): Observable<Note[]> {
    const params = categoryId ? { categoryId: String(categoryId) } : undefined;
    return this.http.get<Note[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateNoteDto): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateNoteDto): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

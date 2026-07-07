## 1. Backend — Proyecto NestJS

- [x] 1.1 Inicializar proyecto NestJS con CLI (`nest new stack-mindep-api`)
- [x] 1.2 Configurar PostgreSQL con TypeORM en `app.module.ts`
- [x] 1.3 Crear Note entity con campos: id, title, content, createdAt, updatedAt
- [x] 1.4 Crear DTOs: CreateNoteDto, UpdateNoteDto con validación (class-validator)
- [x] 1.5 Implementar NotesService con métodos CRUD
- [x] 1.6 Implementar NotesController con endpoints y versión v1
- [x] 1.7 Configurar NotesModule con TypeORM forFeature
- [x] 1.8 Configurar Swagger en main.ts con `@nestjs/swagger`
- [x] 1.9 Configurar versionado URI en main.ts con defaultVersion '1'

## 2. Frontend — Proyecto Angular

- [x] 2.1 Inicializar proyecto Angular con CLI (`ng new stack-mindep-ui`)
- [x] 2.2 Crear Note model (interfaz TypeScript)
- [x] 2.3 Crear NoteService con HttpClient (getAll, getById, create, update, delete)
- [x] 2.4 Crear NotesListComponent con tabla/cards de notas
- [x] 2.5 Crear NoteFormComponent para crear y editar notas
- [x] 2.6 Configurar rutas: /notes, /notes/new, /notes/:id/edit
- [x] 2.7 Integrar Swagger spec (proxy + servicio tipado manualmente)

## 3. Integración y validación

- [x] 3.1 Probar flujo completo: crear → listar → editar → eliminar
- [x] 3.2 Verificar Swagger UI en /api/docs
- [x] 3.3 Verificar versionado /api/v1/notes

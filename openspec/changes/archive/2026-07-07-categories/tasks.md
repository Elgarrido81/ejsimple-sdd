## 1. Backend — Categorías

- [x] 1.1 Crear Category entity con campos: id, name, color, createdAt
- [x] 1.2 Crear relación muchos-a-muchos entre Note y Category
- [x] 1.3 Crear DTOs: CreateCategoryDto, UpdateCategoryDto
- [x] 1.4 Implementar CategoriesService con métodos CRUD
- [x] 1.5 Implementar CategoriesController con endpoints y versión v1
- [x] 1.6 Configurar CategoriesModule con TypeORM forFeature
- [x] 1.7 Actualizar NotesService para incluir categorías en create/find
- [x] 1.8 Actualizar NotesController para aceptar categoryIds en POST/PUT y ?categoryId en GET

## 2. Frontend — Categorías

- [x] 2.1 Crear Category model y CategoriesService (HttpClient)
- [x] 2.2 Crear CategoryListComponent con tabla de categorías
- [x] 2.3 Crear CategoryFormComponent para crear y editar categorías
- [x] 2.4 Actualizar NoteFormComponent con selector de categorías
- [x] 2.5 Actualizar NotesListComponent con filtro por categoría
- [x] 2.6 Configurar rutas: /categories, /categories/new, /categories/:id/edit

## 3. Integración y validación

- [x] 3.1 Probar CRUD de categorías
- [x] 3.2 Probar asignación de categorías a notas
- [x] 3.3 Probar filtro de notas por categoría
- [x] 3.4 Verificar Swagger incluye endpoints de categorías

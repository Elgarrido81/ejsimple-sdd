## Why

Las notas necesitan organización. Actualmente todas las notas están en una sola lista plana. Con categorías, los usuarios pueden agrupar notas por temas (trabajo, personal, ideas, etc.) y filtrar por categoría.

## What Changes

- Nueva API CRUD para categorías: `/api/v1/categories`
- Modelo Category con campos: id, name, color (opcional)
- Relación muchos-a-muchos entre notas y categorías
- Las notas existentes pueden tener cero o más categorías
- Frontend: gestor de categorías y selector al crear/editar notas
- Filtro de notas por categoría en el listado
- **No es breaking** — se agregan endpoints y campos, no se modifican existentes

## Capabilities

### New Capabilities
- `categories`: Gestión de categorías — CRUD completo (crear, listar, editar, eliminar)

### Modified Capabilities
- `notes`: Las notas ahora pueden tener categorías asignadas. Se agrega campo `categories` al modelo Note y filtro por categoría en GET /api/v1/notes

## Impact

- **API**: Nuevo módulo Categories (entity, controller, service) + tabla categories + tabla join notes_categories
- **Frontend**: Nuevo CategoryService + CategoryListComponent + selector de categorías en NoteFormComponent + filtro en NotesListComponent
- **BD**: Migración con nueva tabla `category` y tabla pivote `note_categories`

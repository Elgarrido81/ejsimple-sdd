## Context

Las notas ya tienen CRUD funcional. Ahora se agregan categorías para organizarlas. Es un cambio no-breaking que añade una nueva entidad y una relación muchos-a-muchos con notas.

## Goals / Non-Goals

**Goals:**
- CRUD completo de categorías en API
- Relación muchos-a-muchos entre notas y categorías
- Frontend: gestionar categorías y asignarlas a notas
- Filtro de notas por categoría

**Non-Goals:**
- Jerarquía de categorías (subcategorías)
- Búsqueda por categoría (se hará en cambio 3: Búsqueda)
- Autenticación sobre categorías (se hará en cambio 4: Auth)

## Decisions

| Decisión | Opción elegida | Alternativa | Razón |
|----------|---------------|-------------|-------|
| Relación | Muchos-a-muchos (join table) | Uno-a-muchos (categoría padre) | Una nota puede tener varios temas y una categoría puede tener muchas notas |
| Color | Columna opcional `color` en Category | Tabla separada de colores | Suficiente para este alcance, sin sobredimensionar |
| Filtrar notas | Query param `?categoryId=X` en GET /api/v1/notes | Endpoint separado | Reutiliza el endpoint existente sin crear rutas nuevas |

## Risks / Trade-offs

- [Join table] La migración requiere crear tabla pivote `note_categories` y migrar datos existentes. Mitigación: `synchronize: true` de TypeORM lo maneja automáticamente.
- [Query param existente] Modificar GET /api/v1/notes para aceptar `?categoryId` mantiene compatibilidad hacia atrás — clientes sin el parámetro reciben el mismo resultado que antes.

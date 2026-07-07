## Why

Establecer la base del proyecto Personal Notes — un CRUD completo de notas personales que sirva como plataforma de aprendizaje de SDD/OpenSpec, Angular, NestJS, y PostgreSQL. Este primer cambio sienta la arquitectura y el patrón que seguirán todos los cambios posteriores.

## What Changes

- API REST en NestJS con endpoints CRUD para notas
- Modelo Note con campos: id, title, content, createdAt, updatedAt
- Base de datos PostgreSQL con TypeORM
- Documentación Swagger generada automáticamente en `/api/docs`
- Frontend Angular con listado de notas y formulario de crear/editar
- Versionado URI: `/api/v1/notes`

## Capabilities

### New Capabilities
- `notes`: Gestión de notas personales — CRUD completo (crear, listar, editar, eliminar)

### Modified Capabilities
<!-- No hay capacidades existentes aún — es el primer cambio -->

## Impact

- Creación del repo `stack-mindep-api`: proyecto NestJS con TypeORM, PostgreSQL, Swagger
- Creación del repo `stack-mindep-ui`: proyecto Angular con módulo de notas
- Meta-repo `stack-mindep`: orquesta el cambio via OpenSpec
- No hay impacto en sistemas existentes (proyecto desde cero)

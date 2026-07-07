## Context

Primer cambio del proyecto Personal Notes. Se implementa un CRUD completo de notas con backend en NestJS + PostgreSQL y frontend en Angular. Es la base arquitectónica sobre la que se agregarán categorías, búsqueda y autenticación en cambios posteriores.

## Goals / Non-Goals

**Goals:**
- API REST para CRUD de notas con versionado URI (`/api/v1/notes`)
- Persistencia en PostgreSQL usando TypeORM
- Documentación Swagger generada automáticamente
- Frontend Angular con lista de notas y formulario crear/editar
- Contrato API generado por `@nestjs/swagger` y consumido por frontend

**Non-Goals:**
- Categorías (próximo cambio)
- Búsqueda (próximo cambio)
- Autenticación (próximo cambio)
- Pruebas E2E (se añadirán cuando haya más capacidades)

## Decisions

| Decisión | Opción elegida | Alternativa | Razón |
|----------|---------------|-------------|-------|
| Framework backend | NestJS | Express | Misma filosofía que Angular (decoradores, DI, módulos). Cada módulo mapea 1:1 a un cambio SDD |
| ORM | TypeORM | Prisma / MikroORM | First-class support en NestJS, decoradores alineados con el estilo del framework, madurez en PostgreSQL |
| Documentación API | `@nestjs/swagger` | Manual (OpenAPI escrito a mano) | Generación automática desde decoradores, nunca se desincroniza. Sirve Swagger UI en `/api/docs` |
| Versionado | URI (`/api/v1/notes`) | Header / Media Type | Más explícito, estándar de la industria, compatible con Swagger |
| Estructura de repos | Repos separados (api + ui) | Monorepo | Refleja la realidad laboral, deploys independientes, contrato API explícito |
| Meta-repo SDD | `stack-mindep` con OpenSpec | OpenSpec en cada repo | Una fuente de verdad para las especificaciones, los repos de código son solo implementación |

## Risks / Trade-offs

- [Repos separados] Mayor fricción inicial al tener que crear y configurar dos proyectos separados. Mitigación: el meta-repo orquesta todo via OpenSpec.
- [TypeORM vs Prisma] TypeORM tiene menor rendimiento en consultas complejas que Prisma, pero para un CRUD simple la diferencia es irrelevante.
- [Sin auth desde el inicio] Los endpoints estarán expuestos hasta el cambio 4. Mitigación: es un proyecto de aprendizaje, no hay datos reales.
- [Angular sin SSR] La app será SPA pura. Para este proyecto no se necesita renderizado del lado servidor.

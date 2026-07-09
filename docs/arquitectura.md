# Arquitectura — ejsimple-sdd

## Arquitectura General

```mermaid
graph TB
    subgraph "🌐 Cliente"
        BROWSER[Navegador Web]
    end

    subgraph "🐳 Docker Compose"
        subgraph "Frontend :4200"
            NG[ng serve<br/>Angular Dev Server]
            PROXY[Proxy /api/*]
        end

        subgraph "Backend :3000"
            API[NestJS API]
            SW[Swagger UI]
            SEED[SeedService<br/>auto-seed datos]
        end

        subgraph "Base de Datos :5432"
            PG[(PostgreSQL<br/>ejsimple_sdd)]
        end

        BROWSER -->|http://localhost:4200| NG
        NG -->|/api/*| PROXY
        PROXY -->|http://api:3000| API
        BROWSER -.->|http://localhost:3000/api| SW
        API -->|TypeORM| PG
        SEED -->|onModuleInit| API
    end
```

---

## Arquitectura Backend (NestJS)

```mermaid
graph LR
    subgraph "📦 NotesModule"
        NC[NotesController<br/>src/notes/notes.controller.ts]
        NS[NotesService<br/>src/notes/notes.service.ts]
        NE[Note Entity<br/>src/notes/notes.entity.ts]
        NCDTO[CreateNoteDto]
        NUDTO[UpdateNoteDto]
    end

    subgraph "📦 CategoriesModule"
        CC[CategoriesController<br/>src/categories/categories.controller.ts]
        CS[CategoriesService<br/>src/categories/categories.service.ts]
        CE[Category Entity<br/>src/categories/category.entity.ts]
        CCDTO[CreateCategoryDto]
        CUDTO[UpdateCategoryDto]
    end

    subgraph "📦 SeedModule"
        SS[SeedService<br/>src/seed/seed.service.ts]
    end

    subgraph "📦 AppModule"
        AM[AppModule<br/>src/app.module.ts]
        TORM[TypeORM Config]
    end

    subgraph "🗄️ PostgreSQL"
        NOTA[note]
        CAT[category]
        JN[note_categories_category]
    end

    NC --> NS --> NE
    NS --> NOTA
    NS --> CAT
    
    CC --> CS --> CE
    CS --> CAT

    SS --> NE
    SS --> CE

    AM --> TORM --> PG[(PostgreSQL)]
    TORM -. "sync" .-> NOTA
    TORM -. "sync" .-> CAT
    TORM -. "sync" .-> JN

    NE -- "@JoinTable" --> JN
    CE -- "inverse" --> JN
```

### Capas del Backend

```mermaid
graph TB
    subgraph "Controller Layer"
        CTRL[Decoradores: @Get, @Post, @Put, @Delete<br/>Valida: @Query, @Param, @Body<br/>Documenta: @ApiTags, @ApiOperation]
    end

    subgraph "Service Layer"
        SRV[Lógica de negocio<br/>Inyecta Repository<br/>Maneja: NotFoundException]
    end

    subgraph "Entity Layer"
        ENT[Define esquema TypeORM<br/>@Entity, @Column, @ManyToMany<br/>@CreateDateColumn, @UpdateDateColumn]
    end

    subgraph "DTO Layer"
        DTO[Valida datos de entrada<br/>class-validator: @IsString, @IsOptional<br/>Swagger: @ApiProperty]
    end

    subgraph "Data Access (TypeORM)"
        ORM[Repository Pattern<br/>find, findOne, save, remove<br/>findAndCount, createQueryBuilder]
    end

    CTRL --> SRV --> DTO
    SRV --> ORM --> ENT --> PG[(PostgreSQL)]
```

### Flujo de una Petición (ej: GET /api/v1/notes)

```mermaid
sequenceDiagram
    participant Client as Navegador
    participant Proxy as Proxy Angular
    participant Controller as NotesController
    participant Service as NotesService
    participant ORM as TypeORM
    participant DB as PostgreSQL

    Client->>Proxy: GET /api/v1/notes?page=1&limit=10
    Proxy->>Controller: /api/v1/notes?page=1&limit=10
    Controller->>Controller: ParseIntPipe (page, limit)
    Controller->>Service: findAll(categoryId?, page, limit)
    Service->>ORM: findAndCount({ skip, take, relations })
    ORM->>DB: SELECT ... LIMIT 10 OFFSET 0
    DB-->>ORM: [Note[], total]
    ORM-->>Service: { data: Note[], total }
    Service-->>Controller: { data, total, page, limit, totalPages }
    Controller-->>Client: JSON 200 OK
```

### Flujo de Creación (ej: POST /api/v1/notes)

```mermaid
sequenceDiagram
    participant Client as Navegador
    participant Proxy as Proxy Angular
    participant Controller as NotesController
    participant Service as NotesService
    participant ORM as TypeORM
    participant DB as PostgreSQL

    Client->>Proxy: POST /api/v1/notes
    Proxy->>Controller: { title, content, categoryIds }
    Controller->>Controller: ValidationPipe (CreateNoteDto)
    Controller->>Service: create(dto)
    Service->>ORM: create(dto)
    Service->>ORM: findBy({ id: In(categoryIds) })
    ORM-->>Service: Category[]
    Service->>Service: note.categories = categories
    Service->>ORM: save(note)
    ORM->>DB: INSERT INTO note ...
    ORM->>DB: INSERT INTO note_categories_category ...
    DB-->>ORM: Note
    ORM-->>Service: Note
    Service-->>Controller: Note (con categories)
    Controller-->>Client: 201 Created
```

---

## Arquitectura Frontend (Angular)

```mermaid
graph TB
    subgraph "🏠 App Shell"
        APP[App Component<br/>app.html: navbar + router-outlet]
        ROUTES[app.routes.ts<br/>8 rutas]
    end

    subgraph "📝 Notes Module"
        NL[NotesListComponent<br/>/notes]
        NF[NoteFormComponent<br/>/notes/new, /notes/:id/edit]
        NSVC[NotesService<br/>fetch /api/v1/notes]
    end

    subgraph "🏷️ Categories Module"
        CL[CategoryListComponent<br/>/categories]
        CF[CategoryFormComponent<br/>/categories/new, /categories/:id/edit]
        CSVC[CategoriesService<br/>fetch /api/v1/categories]
    end

    subgraph "🎨 Estilos Globales"
        CSS[styles.css<br/>Design System]
        APP_CSS[app.css<br/>Layout navbar]
    end

    APP --> ROUTES
    ROUTES --> NL
    ROUTES --> NF
    ROUTES --> CL
    ROUTES --> CF
    NL --> NSVC
    NF --> NSVC
    NL --> CSVC
    NF --> CSVC
    CL --> CSVC
    CF --> CSVC
    APP --> CSS
    APP --> APP_CSS
```

### Componentes y Rutas

```mermaid
graph LR
    subgraph "Rutas"
        R1["/"] --> REDIR[Redirect → /notes]
        R2["/notes"] --> NL
        R3["/notes/new"] --> NF
        R4["/notes/:id/edit"] --> NF
        R5["/categories"] --> CL
        R6["/categories/new"] --> CF
        R7["/categories/:id/edit"] --> CF
    end

    subgraph "Componentes"
        NL[NotesListComponent<br/>List + paginación + filtro]
        NF[NoteFormComponent<br/>Formulario crear/editar]
        CL[CategoryListComponent<br/>Lista + colores]
        CF[CategoryFormComponent<br/>Formulario + color picker]
    end
```

### Flujo de Carga de Datos

```mermaid
sequenceDiagram
    participant User as Usuario
    participant Component as NotesListComponent
    participant Service as NotesService
    participant API as Backend API
    participant DB as PostgreSQL

    User->>Component: Navega a /notes
    Component->>Component: ngOnInit() async
    Component->>Service: getAll(categoryId, page, limit)
    Service->>API: GET /api/v1/notes?page=1&limit=10
    API->>API: findAll()
    API->>DB: SELECT...
    DB-->>API: { data, total }
    API-->>Service: JSON
    Service-->>Component: PaginatedNotes
    Component->>Component: notes = data
    Component->>Component: cdr.detectChanges()
    Component-->>User: Renderiza 10 tarjetas
```

---

## Base de Datos

### Diagrama Entidad-Relación

```mermaid
erDiagram
    NOTE {
        int id PK
        varchar title "NOT NULL"
        text content "NULLABLE"
        timestamp createdAt "DEFAULT now()"
        timestamp updatedAt "DEFAULT now()"
    }

    CATEGORY {
        int id PK
        varchar name "UNIQUE, NOT NULL"
        varchar color "NULLABLE, #hex"
        timestamp createdAt "DEFAULT now()"
    }

    NOTE_CATEGORIES_CATEGORY {
        int noteId PK, FK
        int categoryId PK, FK
    }

    NOTE ||--o{ NOTE_CATEGORIES_CATEGORY : tiene
    CATEGORY ||--o{ NOTE_CATEGORIES_CATEGORY : pertenece
```

### Diccionario de Datos

#### Tabla: `note`

| Columna     | Tipo                  | Restricciones        | Descripción                             |
|-------------|-----------------------|----------------------|-----------------------------------------|
| `id`        | `SERIAL`              | `PRIMARY KEY`        | Identificador único auto-incremental    |
| `title`     | `VARCHAR(255)`        | `NOT NULL`           | Título de la nota                       |
| `content`   | `TEXT`                | `NULLABLE`           | Contenido opcional de la nota           |
| `createdAt` | `TIMESTAMP`           | `NOT NULL DEFAULT NOW()` | Fecha de creación                  |
| `updatedAt` | `TIMESTAMP`           | `NOT NULL DEFAULT NOW()` | Fecha de última actualización       |

```sql
CREATE TABLE note (
  id        SERIAL       PRIMARY KEY,
  title     VARCHAR(255) NOT NULL,
  content   TEXT,
  "createdAt" TIMESTAMP  NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP  NOT NULL DEFAULT NOW()
);
```

#### Tabla: `category`

| Columna     | Tipo                  | Restricciones              | Descripción                           |
|-------------|-----------------------|----------------------------|---------------------------------------|
| `id`        | `SERIAL`              | `PRIMARY KEY`              | Identificador único auto-incremental  |
| `name`      | `VARCHAR(100)`        | `NOT NULL UNIQUE`          | Nombre de la categoría                |
| `color`     | `VARCHAR(7)`          | `NULLABLE`                 | Color hexadecimal (ej: `#4f46e5`)     |
| `createdAt` | `TIMESTAMP`           | `NOT NULL DEFAULT NOW()`   | Fecha de creación                     |

```sql
CREATE TABLE category (
  id        SERIAL        PRIMARY KEY,
  name      VARCHAR(100)  NOT NULL UNIQUE,
  color     VARCHAR(7),
  "createdAt" TIMESTAMP   NOT NULL DEFAULT NOW()
);
```

#### Tabla: `note_categories_category`

| Columna      | Tipo      | Restricciones                               | Descripción                     |
|--------------|-----------|---------------------------------------------|---------------------------------|
| `noteId`     | `INTEGER` | `PRIMARY KEY`, `FK → note(id) ON DELETE CASCADE` | ID de la nota             |
| `categoryId` | `INTEGER` | `PRIMARY KEY`, `FK → category(id)`          | ID de la categoría              |

```sql
CREATE TABLE note_categories_category (
  "noteId"     INTEGER NOT NULL REFERENCES note(id) ON DELETE CASCADE,
  "categoryId" INTEGER NOT NULL REFERENCES category(id),
  PRIMARY KEY ("noteId", "categoryId")
);
```

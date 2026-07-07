# Stack Mindep

Aplicación de notas personales con categorías. Monorepo con backend NestJS + TypeORM/PostgreSQL y frontend Angular.

## Estructura

```
stack-mindep/
├── api/                  Backend NestJS (API REST)
├── ui/                   Frontend Angular
├── openspec/             Especificaciones del sistema (SDD)
│   ├── specs/            Specs activos
│   └── changes/archive/  Cambios archivados
└── .opencode/            Configuración de agente opencode
```

## Requisitos

- Node.js >= 18
- PostgreSQL corriendo
- npm

### Conexión a PostgreSQL

Configuración por defecto (via variables de entorno o hardcodeada):

| Variable      | Default    |
|---------------|------------|
| `DB_HOST`     | localhost  |
| `DB_PORT`     | 5432       |
| `DB_USER`     | elias      |
| `DB_PASSWORD` | postgres   |
| `DB_NAME`     | stack_mindep|

La base de datos debe existir. TypeORM sincroniza automáticamente las tablas.

## Cómo ejecutar

### 1. Backend (API)

```bash
cd api
npm install            # solo la primera vez o si cambian dependencias
nest build             # compilar TypeScript a JavaScript
node dist/main.js      # iniciar servidor
```

El backend arranca en `http://localhost:3000`.

**Modo desarrollo** (hot-reload):
```bash
cd api
nest start --watch
```

### 2. Frontend (UI)

```bash
cd ui
npm install            # solo la primera vez
ng serve               # servidor de desarrollo
```

El frontend arranca en `http://localhost:4200`.

El proxy configurado en `ui/proxy.conf.json` redirige las peticiones `/api/*` al backend.

### 3. Abrir en el navegador

| URL                          | Qué muestra               |
|------------------------------|---------------------------|
| `http://localhost:4200`      | App Angular (notas)       |
| `http://localhost:3000/api`  | Swagger UI (documentación API) |

---

## Funcionalidades

### Notas

Operaciones CRUD completas sobre notas personales.

**Listar notas**
- Navegar a `http://localhost:4200/notes`
- Muestra todas las notas ordenadas por fecha descendente
- Cada nota muestra título, contenido, categorías (si tiene) y fecha

**Filtrar notas por categoría**
- En la lista de notas, seleccionar una categoría en el desplegable
- Muestra solo las notas que pertenecen a esa categoría

**Crear nota**
- Hacer clic en "+ Nueva Nota"
- Llenar título (obligatorio) y contenido (opcional)
- Seleccionar categorías con los checkboxes
- Hacer clic en "Guardar"

**Editar nota**
- Hacer clic en "Editar" en la tarjeta de la nota
- Modificar los campos
- Cambiar categorías seleccionadas
- Hacer clic en "Guardar"

**Eliminar nota**
- Hacer clic en "Eliminar" en la tarjeta de la nota
- La nota se borra inmediatamente

### Categorías

Operaciones CRUD completas para categorías. Cada categoría tiene nombre y color opcional (hex).

**Listar categorías**
- Navegar a `http://localhost:4200/categories`
- También se accede desde el botón "Gestionar Categorías" en la lista de notas
- Muestra tabla con nombre, color y acciones

**Crear categoría**
- Hacer clic en "+ Nueva Categoría"
- Llenar nombre y color hexadecimal (opcional, ej: `#007bff`)
- El color se muestra como preview
- Hacer clic en "Guardar"

**Editar categoría**
- Hacer clic en "Editar" en la fila de la categoría
- Modificar nombre y/o color
- Hacer clic en "Guardar"

**Eliminar categoría**
- Hacer clic en "Eliminar" en la fila de la categoría
- La categoría se borra inmediatamente

---

## API REST

La API usa versionado por URI: `/api/v1/notes`, `/api/v1/categories`.

Swagger disponible en `http://localhost:3000/api`.

### Endpoints de Notas

| Método  | Ruta                     | Descripción                     | Cuerpo (JSON)                                       |
|---------|--------------------------|----------------------------------|------------------------------------------------------|
| `GET`   | `/api/v1/notes`          | Listar notas                    | `?categoryId=1` (opcional, filtrar por categoría)   |
| `GET`   | `/api/v1/notes/:id`      | Obtener nota por ID             | -                                                    |
| `POST`  | `/api/v1/notes`          | Crear nota                      | `{ "title": "...", "content": "...", "categoryIds": [1,2] }` |
| `PUT`   | `/api/v1/notes/:id`      | Actualizar nota                 | `{ "title": "...", "content": "...", "categoryIds": [1] }` |
| `DELETE`| `/api/v1/notes/:id`      | Eliminar nota                   | -                                                    |

### Endpoints de Categorías

| Método  | Ruta                         | Descripción             | Cuerpo (JSON)                           |
|---------|------------------------------|-------------------------|------------------------------------------|
| `GET`   | `/api/v1/categories`         | Listar categorías       | -                                        |
| `GET`   | `/api/v1/categories/:id`     | Obtener categoría por ID| -                                        |
| `POST`  | `/api/v1/categories`         | Crear categoría         | `{ "name": "...", "color": "#hex" }`     |
| `PUT`   | `/api/v1/categories/:id`     | Actualizar categoría    | `{ "name": "...", "color": "#hex" }`     |
| `DELETE`| `/api/v1/categories/:id`     | Eliminar categoría      | -                                        |

### Ejemplos con curl

```bash
# Crear categorías
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Trabajo","color":"#007bff"}'

curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Personal","color":"#28a745"}'

# Crear nota con categorías
curl -X POST http://localhost:3000/api/v1/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Comprar víveres","content":"Leche, pan, huevos","categoryIds":[1,2]}'

# Listar notas
curl -s http://localhost:3000/api/v1/notes

# Filtrar notas por categoría
curl -s "http://localhost:3000/api/v1/notes?categoryId=1"

# Actualizar nota
curl -X PUT http://localhost:3000/api/v1/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Nuevo título","content":"Nuevo contenido","categoryIds":[1]}'

# Eliminar nota
curl -X DELETE http://localhost:3000/api/v1/notes/1

# Listar categorías
curl -s http://localhost:3000/api/v1/categories

# Actualizar categoría
curl -X PUT http://localhost:3000/api/v1/categories/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Oficina","color":"#1a73e8"}'

# Eliminar categoría
curl -X DELETE http://localhost:3000/api/v1/categories/1
```

---

## Tecnologías

- **Backend**: NestJS 11, TypeORM 1.0, PostgreSQL, class-validator, @nestjs/swagger
- **Frontend**: Angular 21, standalone components, HttpClient, router
- **Base de datos**: PostgreSQL con TypeORM (synchronize: true — auto-crea tablas)
- **Versionado API**: URI versioning (`/api/v1/`), solo se incrementa en cambios rompientes

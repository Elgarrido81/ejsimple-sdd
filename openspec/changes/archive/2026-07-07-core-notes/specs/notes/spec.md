## ADDED Requirements

### Requisito: Usuario puede crear una nota
El sistema DEBE permitir crear una nota con título y contenido opcional.

#### Escenario: Crear nota con título y contenido
- **DADO** que el usuario envía POST /api/v1/notes con title "Mi nota" y content "Contenido de prueba"
- **ENTONCES** el sistema retorna 201 Created con la nota creada (id, title, content, createdAt, updatedAt)
- **Y** la nota se persiste en PostgreSQL

#### Escenario: Crear nota solo con título
- **DADO** que el usuario envía POST /api/v1/notes con title "Nota sin contenido"
- **ENTONCES** el sistema retorna 201 Created con la nota y content como null

#### Escenario: Crear nota sin título
- **DADO** que el usuario envía POST /api/v1/notes sin el campo title
- **ENTONCES** el sistema retorna 400 Bad Request con error de validación

### Requisito: Usuario puede listar todas las notas
El sistema DEBE permitir obtener todas las notas ordenadas por las más recientes primero.

#### Escenario: Listar notas cuando existen
- **DADO** que el usuario envía GET /api/v1/notes
- **ENTONCES** el sistema retorna 200 OK con un arreglo de notas ordenado por createdAt descendente

#### Escenario: Listar notas cuando no existen
- **DADO** que el usuario envía GET /api/v1/notes y no hay notas
- **ENTONCES** el sistema retorna 200 OK con un arreglo vacío

### Requisito: Usuario puede obtener una nota por ID
El sistema DEBE permitir obtener una nota específica por su ID.

#### Escenario: Obtener nota existente
- **DADO** que el usuario envía GET /api/v1/notes/1
- **ENTONCES** el sistema retorna 200 OK con la nota que coincide con id 1

#### Escenario: Obtener nota inexistente
- **DADO** que el usuario envía GET /api/v1/notes/9999
- **ENTONCES** el sistema retorna 404 Not Found

### Requisito: Usuario puede actualizar una nota
El sistema DEBE permitir actualizar el título y/o contenido de una nota existente.

#### Escenario: Actualizar título y contenido
- **DADO** que el usuario envía PUT /api/v1/notes/1 con title "Nuevo título" y content "Nuevo contenido"
- **ENTONCES** el sistema retorna 200 OK con la nota actualizada
- **Y** updatedAt refleja la hora de modificación

#### Escenario: Actualizar nota inexistente
- **DADO** que el usuario envía PUT /api/v1/notes/9999
- **ENTONCES** el sistema retorna 404 Not Found

### Requisito: Usuario puede eliminar una nota
El sistema DEBE permitir eliminar una nota existente.

#### Escenario: Eliminar nota existente
- **DADO** que el usuario envía DELETE /api/v1/notes/1
- **ENTONCES** el sistema retorna 204 No Content
- **Y** la nota se elimina de PostgreSQL

#### Escenario: Eliminar nota inexistente
- **DADO** que el usuario envía DELETE /api/v1/notes/9999
- **ENTONCES** el sistema retorna 404 Not Found

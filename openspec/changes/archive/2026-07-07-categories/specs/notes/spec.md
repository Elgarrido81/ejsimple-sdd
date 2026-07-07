## MODIFIED Requirements

### Requisito: Usuario puede crear una nota
El sistema DEBE permitir crear una nota con título, contenido opcional y categorías opcionales.

#### Escenario: Crear nota con categorías
- **DADO** que el usuario envía POST /api/v1/notes con title "Nota de trabajo", content "Importante" y categoryIds [1, 2]
- **ENTONCES** el sistema retorna 201 Created con la nota y su lista de categorías asociadas

### Requisito: Usuario puede listar todas las notas
El sistema DEBE permitir obtener todas las notas ordenadas por las más recientes primero, con opción de filtrar por categoría.

#### Escenario: Listar notas filtradas por categoría
- **DADO** que el usuario envía GET /api/v1/notes?categoryId=1
- **ENTONCES** el sistema retorna 200 OK solo con las notas que tienen la categoría con id 1

## ADDED Requirements

### Requisito: Las notas incluyen sus categorías al ser consultadas
El sistema DEBE incluir el arreglo de categorías en la respuesta de cada nota.

#### Escenario: Nota con categorías al obtenerla
- **DADO** que el usuario obtiene una nota con categorías asignadas
- **ENTONCES** el sistema retorna el campo categories con un arreglo de objetos Category dentro de la nota

#### Escenario: Nota sin categorías
- **DADO** que el usuario obtiene una nota sin categorías asignadas
- **ENTONCES** el sistema retorna categories como un arreglo vacío

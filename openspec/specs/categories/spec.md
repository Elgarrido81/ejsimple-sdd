## Purpose

Gestionar categorías para organizar notas personales. TBD.

## Requirements

### Requisito: Usuario puede crear una categoría
El sistema DEBE permitir crear una categoría con nombre y color opcional.

#### Escenario: Crear categoría con nombre
- **DADO** que el usuario envía POST /api/v1/categories con name "Trabajo"
- **ENTONCES** el sistema retorna 201 Created con la categoría creada (id, name, color, createdAt)

#### Escenario: Crear categoría con nombre y color
- **DADO** que el usuario envía POST /api/v1/categories con name "Personal" y color "#ff5733"
- **ENTONCES** el sistema retorna 201 Created con la categoría incluyendo el color

#### Escenario: Crear categoría sin nombre
- **DADO** que el usuario envía POST /api/v1/categories sin el campo name
- **ENTONCES** el sistema retorna 400 Bad Request con error de validación

### Requisito: Usuario puede listar todas las categorías
El sistema DEBE permitir obtener todas las categorías.

#### Escenario: Listar categorías
- **DADO** que el usuario envía GET /api/v1/categories
- **ENTONCES** el sistema retorna 200 OK con un arreglo de categorías

### Requisito: Usuario puede obtener una categoría por ID
El sistema DEBE permitir obtener una categoría específica por su ID.

#### Escenario: Obtener categoría existente
- **DADO** que el usuario envía GET /api/v1/categories/1
- **ENTONCES** el sistema retorna 200 OK con la categoría correspondiente

#### Escenario: Obtener categoría inexistente
- **DADO** que el usuario envía GET /api/v1/categories/999
- **ENTONCES** el sistema retorna 404 Not Found

### Requisito: Usuario puede actualizar una categoría
El sistema DEBE permitir actualizar el nombre y/o color de una categoría existente.

#### Escenario: Actualizar nombre y color
- **DADO** que el usuario envía PUT /api/v1/categories/1 con name "Oficina" y color "#1a73e8"
- **ENTONCES** el sistema retorna 200 OK con la categoría actualizada

### Requisito: Usuario puede eliminar una categoría
El sistema DEBE permitir eliminar una categoría existente.

#### Escenario: Eliminar categoría existente
- **DADO** que el usuario envía DELETE /api/v1/categories/1
- **ENTONCES** el sistema retorna 204 No Content
- **Y** la categoría se elimina de la base de datos

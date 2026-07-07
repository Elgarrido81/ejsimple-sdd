import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { Note } from './notes.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@ApiTags('notes')
@Controller({ path: 'notes', version: '1' })
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva nota' })
  @ApiResponse({ status: 201, description: 'Nota creada exitosamente' })
  create(@Body() dto: CreateNoteDto): Promise<Note> {
    return this.notesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las notas (opcional filtrar por categoría)' })
  @ApiResponse({ status: 200, description: 'Lista de notas' })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  findAll(@Query('categoryId', new ParseIntPipe({ optional: true })) categoryId?: number): Promise<Note[]> {
    return this.notesService.findAll(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una nota por ID' })
  @ApiResponse({ status: 200, description: 'Nota encontrada' })
  @ApiResponse({ status: 404, description: 'Nota no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Note> {
    return this.notesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una nota' })
  @ApiResponse({ status: 200, description: 'Nota actualizada' })
  @ApiResponse({ status: 404, description: 'Nota no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNoteDto,
  ): Promise<Note> {
    return this.notesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar una nota' })
  @ApiResponse({ status: 204, description: 'Nota eliminada' })
  @ApiResponse({ status: 404, description: 'Nota no encontrada' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.notesService.remove(id);
  }
}

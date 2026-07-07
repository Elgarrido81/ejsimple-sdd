import { IsString, IsOptional, MinLength, IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({ example: 'Mi nota', description: 'Título de la nota' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    example: 'Contenido de la nota',
    description: 'Contenido opcional',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    example: [1, 2],
    description: 'IDs de categorías opcionales',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];
}

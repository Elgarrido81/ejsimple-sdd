import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Trabajo', description: 'Nombre de la categoría' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    example: '#ff5733',
    description: 'Color opcional en hex',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;
}

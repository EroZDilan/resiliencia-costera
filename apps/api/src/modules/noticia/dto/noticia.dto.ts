import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateNoticiaDto {
  @IsString() @IsNotEmpty()
  titulo: string;

  @IsString() @IsNotEmpty()
  resumen: string;

  @IsDateString()
  fecha: string;

  @IsOptional() @IsInt()
  imagenId?: number;

  @IsOptional() @IsString()
  imagenUrl?: string;

  @IsString() @IsNotEmpty()
  url: string;
}

export class UpdateNoticiaDto extends CreateNoticiaDto {}

export class ScrapeNoticiaDto {
  @IsUrl()
  url: string;
}

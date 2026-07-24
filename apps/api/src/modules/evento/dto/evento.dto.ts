import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventoDto {
  @IsString() @IsNotEmpty()
  titulo: string;

  @IsOptional() @IsString()
  descripcion?: string;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFin: string;

  @IsDateString()
  fechaInicioPublicacion: string;

  @IsDateString()
  fechaFinPublicacion: string;

  @IsInt()
  imagenId: number;

  @IsString() @IsNotEmpty()
  web: string;

  @IsOptional() @IsString()
  palabrasClaves?: string;
}

export class UpdateEventoDto extends CreateEventoDto {}

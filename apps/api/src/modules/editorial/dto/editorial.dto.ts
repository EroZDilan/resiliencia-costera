import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEditorialDto {
  @IsString() @IsNotEmpty()
  titulo: string;

  @IsString() @IsNotEmpty()
  autores: string;

  @IsInt()
  adjuntoId: number;

  @IsDateString()
  fechaInicioPublicacion: string;

  @IsDateString()
  fechaFinPublicacion: string;

  @IsString() @IsNotEmpty()
  palabrasClaves: string;

  @IsString() @IsNotEmpty()
  textoCompleto: string;

  @IsOptional() @IsInt()
  imagenId?: number;
}

export class UpdateEditorialDto extends CreateEditorialDto {}

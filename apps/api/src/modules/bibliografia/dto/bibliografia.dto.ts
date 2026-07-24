import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBibliografiaDto {
  @IsString() @IsNotEmpty()
  titulo: string;

  @IsString() @IsNotEmpty()
  autores: string;

  @IsOptional() @IsString()
  isbn?: string;

  @IsOptional() @IsString()
  resumen?: string;

  @IsOptional() @IsString()
  web?: string;

  @IsOptional() @IsString()
  palabrasClaves?: string;

  @IsOptional() @IsInt()
  adjuntoId?: number;
}

export class UpdateBibliografiaDto extends CreateBibliografiaDto {}

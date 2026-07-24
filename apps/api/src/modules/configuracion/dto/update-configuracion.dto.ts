import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateConfiguracionDto {
  @IsString() @IsNotEmpty()
  nombre: string;

  @IsString() @IsNotEmpty()
  concepto: string;

  @IsString() @IsNotEmpty()
  objetivo: string;

  @IsString() @IsNotEmpty()
  respuestaAutomatica: string;

  @IsString() @IsNotEmpty()
  emailEmisor: string;

  @IsInt()
  logoId: number;

  @IsOptional() @IsInt()
  logoTextlessId?: number;

  @IsString() @IsNotEmpty()
  textoProyectos: string;

  @IsString() @IsNotEmpty()
  textoIniciativas: string;

  @IsOptional() @IsString()
  telefono?: string;

  @IsOptional() @IsString()
  facebook?: string;

  @IsOptional() @IsString()
  twitter?: string;

  @IsOptional() @IsString()
  instagram?: string;
}

import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganizacionDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsOptional() @IsString()
  email?: string;

  @IsOptional() @IsString()
  telefono?: string;

  @IsOptional() @IsString()
  facebook?: string;

  @IsOptional() @IsString()
  web?: string;

  @IsOptional() @IsString()
  instagram?: string;

  @IsOptional() @IsString()
  twitter?: string;

  // Required: mirrors OrganizacionController::comunCheckNullableConstrains
  // ("Debe indicar un logo para el proyecto."). References an Adjunto
  // already uploaded via POST /admin/adjuntos.
  @IsInt()
  logoId: number;
}

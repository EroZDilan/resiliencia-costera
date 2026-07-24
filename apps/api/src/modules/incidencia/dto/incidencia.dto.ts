import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Public creation, mirrors the "contactenos" front form (config/crud.yml:
// contactenos -> Incidencia, allowedCREATE: front).
export class CreateIncidenciaDto {
  @IsString() @IsNotEmpty()
  tipo: string;

  @IsString() @IsNotEmpty()
  descripcion: string;

  @IsOptional() @IsString()
  email?: string;

  @IsOptional() @IsString()
  telefono?: string;

  @IsString() @IsNotEmpty()
  nombre: string;

  @IsString() @IsNotEmpty()
  ocupacion: string;
}

export class ResponderIncidenciaDto {
  @IsString() @IsNotEmpty()
  respuesta: string;

  @IsOptional() @IsBoolean()
  enviarCerrar?: boolean;
}

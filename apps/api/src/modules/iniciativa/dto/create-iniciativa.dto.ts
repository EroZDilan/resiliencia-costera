import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIniciativaDto {
  @IsString() @IsNotEmpty()
  nombre: string;

  @IsString() @IsNotEmpty()
  descripcion: string;

  @IsOptional() @IsString()
  areaIntervencion?: string;

  @IsOptional() @IsString()
  email?: string;

  @IsOptional() @IsString()
  telefono?: string;

  @IsOptional() @IsString()
  facebook?: string;

  @IsOptional() @IsString()
  instagram?: string;

  @IsOptional() @IsString()
  twitter?: string;

  @IsOptional() @IsString()
  otrosLideres?: string;

  @IsOptional() @IsString()
  otrosParticipantes?: string;

  // Required: mirrors IniciativaController::comunCheckNullableConstrains.
  @IsInt()
  logoId: number;

  @IsOptional() @IsArray() @Type(() => Number)
  organizacionesLideresIds?: number[];

  @IsOptional() @IsArray() @Type(() => Number)
  organizacionesParticipantesIds?: number[];
}

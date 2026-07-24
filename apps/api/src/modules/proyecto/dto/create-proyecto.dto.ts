import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoProyecto } from '../../../common/enums/estado-proyecto.enum';

export class CreateProyectoDto {
  @IsString() @IsNotEmpty()
  nombreCorto: string;

  @IsString() @IsNotEmpty()
  nombreOficial: string;

  @IsOptional() @IsString()
  areaIntervencion?: string;

  @IsString() @IsNotEmpty()
  web: string;

  @IsEnum(EstadoProyecto)
  estado: EstadoProyecto;

  @IsDateString()
  fechaInicio: string;

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
  resultado?: string;

  @IsOptional() @IsString()
  otrosLideres?: string;

  @IsOptional() @IsString()
  otrosParticipantes?: string;

  // Required: mirrors ProyectoController::comunCheckNullableConstrains
  // ("Debe indicar un logo para el proyecto.").
  @IsInt()
  logoId: number;

  @IsOptional() @IsArray() @Type(() => Number)
  organizacionesLideresIds?: number[];

  @IsOptional() @IsArray() @Type(() => Number)
  organizacionesParticipantesIds?: number[];

  @IsOptional() @IsArray() @Type(() => Number)
  productosIds?: number[];
}

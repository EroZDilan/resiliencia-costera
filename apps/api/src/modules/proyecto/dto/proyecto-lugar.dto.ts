import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProyectoLugarDto {
  @IsString() @IsNotEmpty()
  nombre: string;

  // WKT text "POINT(lng lat)", matching the legacy column — not real geometry.
  @IsString() @IsNotEmpty()
  geometria: string;
}

export class UpdateProyectoLugarDto {
  @IsString() @IsNotEmpty()
  nombre: string;

  @IsString() @IsNotEmpty()
  geometria: string;
}

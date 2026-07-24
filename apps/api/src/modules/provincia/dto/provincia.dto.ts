import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateProvinciaDto {
  @IsString() @IsNotEmpty()
  nombre: string;

  @IsInt()
  dpa: number;
}

export class UpdateProvinciaDto extends CreateProvinciaDto {}

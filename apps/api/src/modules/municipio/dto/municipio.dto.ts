import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMunicipioDto {
  @IsString() @IsNotEmpty()
  nombre: string;

  @IsInt()
  dpa: number;

  @IsOptional() @IsInt()
  provinciaId?: number;
}

export class UpdateMunicipioDto extends CreateMunicipioDto {}

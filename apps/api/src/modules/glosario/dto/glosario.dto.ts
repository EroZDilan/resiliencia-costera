import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGlosarioDto {
  @IsString() @IsNotEmpty()
  termino: string;

  @IsString() @IsNotEmpty()
  significado: string;
}

export class UpdateGlosarioDto extends CreateGlosarioDto {}

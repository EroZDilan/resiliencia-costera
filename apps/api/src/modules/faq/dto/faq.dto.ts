import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFaqDto {
  @IsString() @IsNotEmpty()
  pregunta: string;

  @IsString() @IsNotEmpty()
  respuesta: string;
}

export class UpdateFaqDto extends CreateFaqDto {}

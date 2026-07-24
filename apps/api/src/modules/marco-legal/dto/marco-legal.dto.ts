import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TipoMarcoLegal } from '../../../common/enums/tipo-marco-legal.enum';

export class CreateMarcoLegalDto {
  @IsString() @IsNotEmpty()
  titulo: string;

  @IsEnum(TipoMarcoLegal)
  tipo: TipoMarcoLegal;

  @IsString() @IsNotEmpty()
  emisor: string;

  @IsInt()
  anno: number;

  @IsInt()
  numero: number;

  @IsOptional() @IsString()
  web?: string;

  @IsOptional() @IsString()
  palabrasClaves?: string;

  @IsOptional() @IsInt()
  adjuntoId?: number;
}

export class UpdateMarcoLegalDto extends CreateMarcoLegalDto {}

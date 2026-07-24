// Mirrors App\Enum\TipoMarcoLegalEnum
export enum TipoMarcoLegal {
  LEY = 'LEY',
  DECRETO = 'DECRETO',
  RESOLUCION = 'RESOLUCION',
}

export const TIPO_MARCO_LEGAL_READABLE: Record<TipoMarcoLegal, string> = {
  [TipoMarcoLegal.LEY]: 'Ley',
  [TipoMarcoLegal.DECRETO]: 'Decreto ley',
  [TipoMarcoLegal.RESOLUCION]: 'Resolución',
};

import { Adjunto } from '../../core/adjunto/adjunto.service';

export type TipoMarcoLegal = 'LEY' | 'DECRETO' | 'RESOLUCION';

export const TIPO_MARCO_LEGAL_OPTIONS = [
  { label: 'Ley', value: 'LEY' },
  { label: 'Decreto ley', value: 'DECRETO' },
  { label: 'Resolución', value: 'RESOLUCION' },
];

export interface MarcoLegal {
  id: number;
  titulo: string;
  slug: string | null;
  tipo: TipoMarcoLegal;
  emisor: string;
  anno: number;
  numero: number;
  web: string | null;
  palabrasClaves: string | null;
  adjunto: Adjunto | null;
}

export interface CreateMarcoLegalPayload {
  titulo: string;
  tipo: TipoMarcoLegal;
  emisor: string;
  anno: number;
  numero: number;
  web?: string;
  palabrasClaves?: string;
  adjuntoId?: number;
}

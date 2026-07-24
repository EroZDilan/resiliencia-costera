import { Adjunto } from '../../core/adjunto/adjunto.service';

export interface Bibliografia {
  id: number;
  titulo: string;
  slug: string | null;
  autores: string;
  isbn: string | null;
  resumen: string | null;
  web: string | null;
  palabrasClaves: string | null;
  adjunto: Adjunto | null;
}

export interface CreateBibliografiaPayload {
  titulo: string;
  autores: string;
  isbn?: string;
  resumen?: string;
  web?: string;
  palabrasClaves?: string;
  adjuntoId?: number;
}

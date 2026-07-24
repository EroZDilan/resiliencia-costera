import { Adjunto } from '../../core/adjunto/adjunto.service';

export interface Colaboracion {
  id: number;
  titulo: string;
  slug: string | null;
  autores: string;
  adjunto: Adjunto;
  fechaInicioPublicacion: string;
  fechaFinPublicacion: string;
  palabrasClaves: string;
  imagen: Adjunto | null;
  textoCompleto: string;
}

export interface CreateColaboracionPayload {
  titulo: string;
  autores: string;
  adjuntoId: number;
  fechaInicioPublicacion: string;
  fechaFinPublicacion: string;
  palabrasClaves: string;
  textoCompleto: string;
  imagenId?: number;
}

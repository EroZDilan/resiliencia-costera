import { Adjunto } from '../../core/adjunto/adjunto.service';

export interface Evento {
  id: number;
  titulo: string;
  slug: string | null;
  descripcion: string | null;
  fechaInicio: string;
  fechaFin: string;
  fechaInicioPublicacion: string;
  fechaFinPublicacion: string;
  imagen: Adjunto;
  web: string;
  palabrasClaves: string | null;
}

export interface CreateEventoPayload {
  titulo: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  fechaInicioPublicacion: string;
  fechaFinPublicacion: string;
  imagenId: number;
  web: string;
  palabrasClaves?: string;
}

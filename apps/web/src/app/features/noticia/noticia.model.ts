import { Adjunto } from '../../core/adjunto/adjunto.service';

export interface Noticia {
  id: number;
  titulo: string;
  slug: string | null;
  resumen: string;
  fecha: string;
  imagen: Adjunto | null;
  imagenUrl: string | null;
  url: string;
}

export interface CreateNoticiaPayload {
  titulo: string;
  resumen: string;
  fecha: string;
  imagenId?: number;
  imagenUrl?: string;
  url: string;
}

export interface ScrapedNoticia {
  ok: boolean;
  title?: string;
  description?: string;
  image?: string;
  fecha?: string;
  error?: string;
}

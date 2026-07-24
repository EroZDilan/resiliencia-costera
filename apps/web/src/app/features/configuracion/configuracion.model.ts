import { Adjunto } from '../../core/adjunto/adjunto.service';

export interface Configuracion {
  id: number;
  nombre: string;
  concepto: string;
  objetivo: string;
  respuestaAutomatica: string;
  emailEmisor: string;
  logo: Adjunto;
  logoTextless: Adjunto | null;
  textoProyectos: string;
  textoIniciativas: string;
  telefono: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
}

export interface UpdateConfiguracionPayload {
  nombre: string;
  concepto: string;
  objetivo: string;
  respuestaAutomatica: string;
  emailEmisor: string;
  logoId: number;
  logoTextlessId?: number;
  textoProyectos: string;
  textoIniciativas: string;
  telefono?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

import { Adjunto } from '../../core/adjunto/adjunto.service';
import { Organizacion } from '../organizacion/organizacion.model';

export type EstadoProyecto = 'EN_CURSO' | 'TERMINADO';

export interface ProyectoLugar {
  id: number;
  nombre: string;
  geometria: string; // "lat,lng"
}

export interface Proyecto {
  id: number;
  nombreCorto: string;
  slug: string | null;
  nombreOficial: string;
  areaIntervencion: string | null;
  otrosLideres: string | null;
  otrosParticipantes: string | null;
  email: string | null;
  telefono: string | null;
  facebook: string | null;
  web: string;
  estado: EstadoProyecto;
  resultado: string | null;
  instagram: string | null;
  twitter: string | null;
  fechaInicio: string;
  logo: Adjunto | null;
  organizacionesLideres: Organizacion[];
  organizacionesParticipantes: Organizacion[];
  productos: Adjunto[];
  lugares: ProyectoLugar[];
}

export interface CreateProyectoPayload {
  nombreCorto: string;
  nombreOficial: string;
  areaIntervencion?: string;
  web: string;
  estado: EstadoProyecto;
  fechaInicio: string;
  email?: string;
  telefono?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  resultado?: string;
  otrosLideres?: string;
  otrosParticipantes?: string;
  logoId: number;
  organizacionesLideresIds?: number[];
  organizacionesParticipantesIds?: number[];
  productosIds?: number[];
}

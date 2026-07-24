import { Adjunto } from '../../core/adjunto/adjunto.service';
import { Organizacion } from '../organizacion/organizacion.model';

export interface Iniciativa {
  id: number;
  nombre: string;
  slug: string | null;
  descripcion: string;
  areaIntervencion: string | null;
  otrosLideres: string | null;
  otrosParticipantes: string | null;
  email: string | null;
  telefono: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  logo: Adjunto | null;
  organizacionesLideres: Organizacion[];
  organizacionesParticipantes: Organizacion[];
}

export interface CreateIniciativaPayload {
  nombre: string;
  descripcion: string;
  areaIntervencion?: string;
  email?: string;
  telefono?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  otrosLideres?: string;
  otrosParticipantes?: string;
  logoId: number;
  organizacionesLideresIds?: number[];
  organizacionesParticipantesIds?: number[];
}

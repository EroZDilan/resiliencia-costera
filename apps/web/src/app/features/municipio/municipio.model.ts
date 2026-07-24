import { Provincia } from '../provincia/provincia.model';

export interface Municipio {
  id: number;
  nombre: string;
  dpa: number;
  provincia: Provincia | null;
}

export interface CreateMunicipioPayload {
  nombre: string;
  dpa: number;
  provinciaId?: number;
}

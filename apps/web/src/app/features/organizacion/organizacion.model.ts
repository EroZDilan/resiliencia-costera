import { Adjunto } from '../../core/adjunto/adjunto.service';

export interface Organizacion {
  id: number;
  nombre: string;
  slug: string | null;
  descripcion: string;
  email: string | null;
  telefono: string | null;
  facebook: string | null;
  web: string | null;
  instagram: string | null;
  twitter: string | null;
  logo: Adjunto | null;
}

export interface CreateOrganizacionPayload {
  nombre: string;
  descripcion: string;
  email?: string;
  telefono?: string;
  facebook?: string;
  web?: string;
  instagram?: string;
  twitter?: string;
  logoId: number;
}

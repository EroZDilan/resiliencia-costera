export type EstadoIncidencia = 'PENDIENTE' | 'EN_PROCESO' | 'CERRADO';

export const ESTADO_INCIDENCIA_LABEL: Record<EstadoIncidencia, string> = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En proceso',
  CERRADO: 'Cerrado',
};

export interface IncidenciaRespuesta {
  id: number;
  respondidaPorId: number;
  respuesta: string;
  fecha: string;
}

export interface IncidenciaHistoria {
  id: number;
  historia: string;
  fecha: string;
  hechoPorId: number | null;
  respuesta: IncidenciaRespuesta | null;
}

export interface Incidencia {
  id: number;
  tipo: string;
  descripcion: string;
  email: string | null;
  telefono: string | null;
  nombre: string;
  ocupacion: string;
  atendidaPorId: number | null;
  codigo: string;
  estado: EstadoIncidencia;
  fechaEstado: string;
  historias: IncidenciaHistoria[];
  respuestas: IncidenciaRespuesta[];
}

export interface IncidenciaGrouped {
  pendientes: Incidencia[];
  propias: Incidencia[];
  otras: Incidencia[];
}

export interface CreateIncidenciaPayload {
  tipo: string;
  descripcion: string;
  email?: string;
  telefono?: string;
  nombre: string;
  ocupacion: string;
}

export const TIPO_INCIDENCIA_OPTIONS = [
  { label: 'Pregunta o sugerencia', value: 'pregunta' },
  { label: 'Información sobre proyectos o iniciativas no registrados', value: 'informacion' },
  { label: 'Correcciones a la información registrada', value: 'correccion' },
  { label: 'Colaboraciones', value: 'colaboracion' },
];

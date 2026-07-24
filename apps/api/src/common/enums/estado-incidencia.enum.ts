// Mirrors Incidencia::getEstadoStr()
export enum EstadoIncidencia {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  CERRADO = 'CERRADO',
}

export const ESTADO_INCIDENCIA_READABLE: Record<EstadoIncidencia, string> = {
  [EstadoIncidencia.PENDIENTE]: 'Pendiente',
  [EstadoIncidencia.EN_PROCESO]: 'En proceso',
  [EstadoIncidencia.CERRADO]: 'Cerrado',
};

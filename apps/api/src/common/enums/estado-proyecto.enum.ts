// Mirrors App\Enum\EstadosProyectoEnum
export enum EstadoProyecto {
  EN_CURSO = 'EN_CURSO',
  TERMINADO = 'TERMINADO',
}

export const ESTADO_PROYECTO_READABLE: Record<EstadoProyecto, string> = {
  [EstadoProyecto.EN_CURSO]: 'En curso',
  [EstadoProyecto.TERMINADO]: 'Terminado',
};

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EstadoIncidencia } from '../../common/enums/estado-incidencia.enum';
import { IncidenciaHistoria } from './incidencia-historia.entity';
import { IncidenciaRespuesta } from './incidencia-respuesta.entity';

@Entity('incidencia')
export class Incidencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  tipo: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono: string | null;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  ocupacion: string;

  // Plain FK to seg_usuario (no SeguridadUsuario entity yet — auth is
  // deliberately deprioritized, see common/auth/noop-auth.guard.ts).
  @Column({ name: 'atendida_por', type: 'int', nullable: true })
  atendidaPorId: number | null;

  @Column({ type: 'varchar', length: 20 })
  codigo: string;

  @Column({ type: 'varchar', length: 15 })
  estado: EstadoIncidencia;

  @Column({ name: 'fecha_estado', type: 'datetime' })
  fechaEstado: Date;

  @OneToMany(() => IncidenciaHistoria, (h) => h.incidencia)
  historias: IncidenciaHistoria[];

  @OneToMany(() => IncidenciaRespuesta, (r) => r.incidencia)
  respuestas: IncidenciaRespuesta[];
}

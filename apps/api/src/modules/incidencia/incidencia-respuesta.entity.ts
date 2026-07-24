import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Incidencia } from './incidencia.entity';

@Entity('incidencia_respuesta')
export class IncidenciaRespuesta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Incidencia)
  @JoinColumn({ name: 'incidencia' })
  incidencia: Incidencia;

  @Column({ name: 'respondida_por', type: 'int' })
  respondidaPorId: number;

  @Column({ type: 'text' })
  respuesta: string;

  @Column({ type: 'datetime' })
  fecha: Date;
}

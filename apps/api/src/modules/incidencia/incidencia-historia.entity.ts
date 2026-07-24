import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Incidencia } from './incidencia.entity';
import { IncidenciaRespuesta } from './incidencia-respuesta.entity';

@Entity('incidencia_historia')
export class IncidenciaHistoria {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Incidencia)
  @JoinColumn({ name: 'incidencia' })
  incidencia: Incidencia;

  @Column({ type: 'text' })
  historia: string;

  @Column({ type: 'datetime' })
  fecha: Date;

  @Column({ name: 'hecho_por', type: 'int', nullable: true })
  hechoPorId: number | null;

  @ManyToOne(() => IncidenciaRespuesta, { nullable: true })
  @JoinColumn({ name: 'respuesta' })
  respuesta: IncidenciaRespuesta | null;
}

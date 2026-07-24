import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Proyecto } from './proyecto.entity';

@Entity('proyecto_lugar')
@Unique('constraint1', ['proyecto', 'nombre'])
export class ProyectoLugar {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.lugares, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'proyecto' })
  proyecto: Proyecto;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  // Stored as WKT text "POINT(lng lat)" (confirmed against real data), not a
  // spatial column — matches the legacy schema exactly.
  @Column({ type: 'varchar', length: 100, nullable: true })
  geometria: string;
}

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Provincia } from '../provincia/provincia.entity';

@Entity('municipio')
export class Municipio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @ManyToOne(() => Provincia, { nullable: true })
  @JoinColumn({ name: 'id_provincia' })
  provincia: Provincia | null;

  @Column({ type: 'int' })
  dpa: number;
}

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Adjunto } from '../adjunto/adjunto.entity';

@Entity('evento')
export class Evento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  slug: string | null;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ name: 'fecha_inicio', type: 'datetime' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'datetime' })
  fechaFin: Date;

  @Column({ name: 'fecha_inicio_publicacion', type: 'datetime' })
  fechaInicioPublicacion: Date;

  @Column({ name: 'fecha_fin_publicacion', type: 'datetime' })
  fechaFinPublicacion: Date;

  @ManyToOne(() => Adjunto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'imagen' })
  imagen: Adjunto;

  @Column({ type: 'varchar', length: 100 })
  web: string;

  @Column({ name: 'palabras_claves', type: 'text', nullable: true })
  palabrasClaves: string | null;
}

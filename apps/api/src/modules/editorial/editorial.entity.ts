import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Adjunto } from '../adjunto/adjunto.entity';

@Entity('editorial')
export class Editorial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  slug: string | null;

  @Column({ type: 'text' })
  autores: string;

  @ManyToOne(() => Adjunto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'adjunto' })
  adjunto: Adjunto;

  @Column({ name: 'fecha_inicio_publicacion', type: 'datetime' })
  fechaInicioPublicacion: Date;

  @Column({ name: 'fecha_fin_publicacion', type: 'datetime' })
  fechaFinPublicacion: Date;

  @Column({ name: 'palabras_claves', type: 'text' })
  palabrasClaves: string;

  @ManyToOne(() => Adjunto, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'imagen' })
  imagen: Adjunto | null;

  @Column({ name: 'texto_completo', type: 'text' })
  textoCompleto: string;
}

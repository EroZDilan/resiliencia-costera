import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Adjunto } from '../adjunto/adjunto.entity';

@Entity('bibliografia')
export class Bibliografia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  slug: string | null;

  @Column({ type: 'text' })
  autores: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  isbn: string | null;

  @Column({ type: 'text', nullable: true })
  resumen: string | null;

  @ManyToOne(() => Adjunto, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'adjunto' })
  adjunto: Adjunto | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  web: string | null;

  @Column({ name: 'palabras_claves', type: 'text', nullable: true })
  palabrasClaves: string | null;
}

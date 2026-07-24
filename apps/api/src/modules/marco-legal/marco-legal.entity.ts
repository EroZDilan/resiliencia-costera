import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Adjunto } from '../adjunto/adjunto.entity';
import { TipoMarcoLegal } from '../../common/enums/tipo-marco-legal.enum';

@Entity('marco_legal')
export class MarcoLegal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  slug: string | null;

  @Column({ type: 'varchar', length: 30 })
  tipo: TipoMarcoLegal;

  @Column({ type: 'varchar', length: 255 })
  emisor: string;

  @Column({ type: 'int' })
  anno: number;

  @Column({ type: 'int' })
  numero: number;

  @ManyToOne(() => Adjunto, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'adjunto' })
  adjunto: Adjunto | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  web: string | null;

  @Column({ name: 'palabras_claves', type: 'text', nullable: true })
  palabrasClaves: string | null;
}

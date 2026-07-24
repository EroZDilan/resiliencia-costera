import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Adjunto } from '../adjunto/adjunto.entity';

@Entity('noticia')
export class Noticia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  slug: string | null;

  @Column({ type: 'text' })
  resumen: string;

  @Column({ type: 'datetime' })
  fecha: Date;

  @ManyToOne(() => Adjunto, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'imagen' })
  imagen: Adjunto | null;

  // External (scraped) image URL, used when no local Adjunto was uploaded.
  @Column({ name: 'imagen_url', type: 'varchar', length: 512, nullable: true })
  imagenUrl: string | null;

  // Source URL of the news item (what getNoticiaFromUrlAction scrapes from).
  @Column({ type: 'varchar', length: 512 })
  url: string;
}

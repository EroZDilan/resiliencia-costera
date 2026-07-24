import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('adjunto')
export class Adjunto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  archivo: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ruta: string | null;

  @Column({ name: 'archivo_hash', type: 'varchar', length: 255, nullable: true })
  archivoHash: string | null;

  @Column({ type: 'int' })
  size: number;

  @Column({ name: 'mime_type', type: 'varchar', length: 255, nullable: true })
  mimeType: string | null;
}

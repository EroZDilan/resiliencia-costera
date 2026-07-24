import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('glosario')
export class Glosario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 512, unique: true })
  termino: string;

  @Column({ type: 'text' })
  significado: string;
}

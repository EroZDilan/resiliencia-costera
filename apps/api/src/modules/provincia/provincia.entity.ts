import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('provincia')
export class Provincia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  // DPA = código oficial de división político-administrativa cubana.
  @Column({ type: 'int' })
  dpa: number;
}

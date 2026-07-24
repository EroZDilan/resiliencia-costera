import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Adjunto } from '../adjunto/adjunto.entity';
import { Organizacion } from '../organizacion/organizacion.entity';

@Entity('iniciativa')
export class Iniciativa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  slug: string | null;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ name: 'area_intervencion', type: 'varchar', length: 100, nullable: true })
  areaIntervencion: string | null;

  @Column({ name: 'otros_lideres', type: 'varchar', length: 1024, nullable: true })
  otrosLideres: string | null;

  @Column({ name: 'otros_participantes', type: 'varchar', length: 1024, nullable: true })
  otrosParticipantes: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  facebook: string | null;

  @ManyToOne(() => Adjunto, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'logo' })
  logo: Adjunto | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  instagram: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  twitter: string | null;

  @ManyToMany(() => Organizacion)
  @JoinTable({
    name: 'iniciativa_organizacion_lider',
    joinColumn: { name: 'iniciativa', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'organizacion', referencedColumnName: 'id' },
  })
  organizacionesLideres: Organizacion[];

  @ManyToMany(() => Organizacion)
  @JoinTable({
    name: 'iniciativa_organizacion_participante',
    joinColumn: { name: 'iniciativa', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'organizacion', referencedColumnName: 'id' },
  })
  organizacionesParticipantes: Organizacion[];
}

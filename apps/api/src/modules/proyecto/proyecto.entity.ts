import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Adjunto } from '../adjunto/adjunto.entity';
import { Organizacion } from '../organizacion/organizacion.entity';
import { EstadoProyecto } from '../../common/enums/estado-proyecto.enum';
import { ProyectoLugar } from './proyecto-lugar.entity';

@Entity('proyecto')
export class Proyecto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_corto', type: 'varchar', length: 100, unique: true })
  nombreCorto: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  slug: string | null;

  @Column({ name: 'nombre_oficial', type: 'text' })
  nombreOficial: string;

  @Column({ name: 'area_intervencion', type: 'text', nullable: true })
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

  @Column({ type: 'varchar', length: 100 })
  web: string;

  @Column({ type: 'varchar', length: 20 })
  estado: EstadoProyecto;

  @Column({ type: 'text', nullable: true })
  resultado: string | null;

  // Legacy free-text field, superseded by ProyectoLugar rows; kept only for
  // schema parity, never populated by the new app.
  @Column({ type: 'text', nullable: true })
  ubicaciones: string | null;

  @ManyToOne(() => Adjunto, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'logo' })
  logo: Adjunto | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  instagram: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  twitter: string | null;

  // Doctrine declared this NOT NULL even though the live column allows NULL;
  // the DTO enforces the stricter (intended) rule, see plan §Arquitectura.
  @Column({ name: 'fecha_inicio', type: 'datetime', nullable: true })
  fechaInicio: Date | null;

  @ManyToMany(() => Organizacion)
  @JoinTable({
    name: 'proyecto_organizacion_lider',
    joinColumn: { name: 'proyecto', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'organizacion', referencedColumnName: 'id' },
  })
  organizacionesLideres: Organizacion[];

  @ManyToMany(() => Organizacion)
  @JoinTable({
    name: 'proyecto_organizacion_participante',
    joinColumn: { name: 'proyecto', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'organizacion', referencedColumnName: 'id' },
  })
  organizacionesParticipantes: Organizacion[];

  @ManyToMany(() => Adjunto)
  @JoinTable({
    name: 'proyecto_producto',
    joinColumn: { name: 'proyecto', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'producto', referencedColumnName: 'id' },
  })
  productos: Adjunto[];

  @OneToMany(() => ProyectoLugar, (lugar) => lugar.proyecto)
  lugares: ProyectoLugar[];
}

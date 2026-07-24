import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Adjunto } from '../adjunto/adjunto.entity';

// Singleton (always id=1) — site-wide settings shown on the public home/footer.
@Entity('configuracion')
export class Configuracion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text' })
  concepto: string;

  @Column({ type: 'text' })
  objetivo: string;

  @Column({ name: 'respuesta_automatica', type: 'text' })
  respuestaAutomatica: string;

  @Column({ name: 'email_emisor', type: 'varchar', length: 100 })
  emailEmisor: string;

  @ManyToOne(() => Adjunto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'logo' })
  logo: Adjunto;

  @ManyToOne(() => Adjunto, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'logo_textless' })
  logoTextless: Adjunto | null;

  @Column({ name: 'texto_proyectos', type: 'text' })
  textoProyectos: string;

  @Column({ name: 'texto_iniciativas', type: 'text' })
  textoIniciativas: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  telefono: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  facebook: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  twitter: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  instagram: string | null;
}

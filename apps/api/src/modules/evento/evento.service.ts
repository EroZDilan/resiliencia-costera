import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from './evento.entity';
import { CreateEventoDto, UpdateEventoDto } from './dto/evento.dto';
import { slugify } from '../../common/util/slugify';
import { absoluteUrl } from '../../common/util/absolute-url';
import { Adjunto } from '../adjunto/adjunto.entity';

@Injectable()
export class EventoService {
  constructor(@InjectRepository(Evento) private readonly repo: Repository<Evento>) {}

  findAll(): Promise<Evento[]> {
    return this.repo.find({ relations: { imagen: true }, order: { fechaInicio: 'DESC' } });
  }

  async findOne(id: number): Promise<Evento> {
    const entity = await this.repo.findOne({ where: { id }, relations: { imagen: true } });
    if (!entity) throw new NotFoundException(`Evento ${id} no encontrado`);
    return entity;
  }

  async findBySlug(slug: string): Promise<Evento> {
    const entity = await this.repo.findOne({ where: { slug }, relations: { imagen: true } });
    if (!entity) throw new NotFoundException(`Evento con slug "${slug}" no encontrado`);
    return entity;
  }

  create(dto: CreateEventoDto): Promise<Evento> {
    return this.repo.save(this.toEntity(dto));
  }

  async update(id: number, dto: UpdateEventoDto): Promise<Evento> {
    const entity = await this.findOne(id);
    Object.assign(entity, this.toEntity(dto));
    return this.repo.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
  }

  private toEntity(dto: CreateEventoDto): Partial<Evento> {
    return {
      titulo: dto.titulo,
      slug: slugify(dto.titulo),
      descripcion: dto.descripcion ?? null,
      fechaInicio: new Date(dto.fechaInicio),
      fechaFin: new Date(dto.fechaFin),
      fechaInicioPublicacion: new Date(dto.fechaInicioPublicacion),
      fechaFinPublicacion: new Date(dto.fechaFinPublicacion),
      imagen: { id: dto.imagenId } as Adjunto,
      web: absoluteUrl(dto.web)!,
      palabrasClaves: dto.palabrasClaves ?? null,
    };
  }
}

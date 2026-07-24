import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Colaboracion } from './colaboracion.entity';
import { CreateColaboracionDto, UpdateColaboracionDto } from './dto/colaboracion.dto';
import { slugify } from '../../common/util/slugify';
import { Adjunto } from '../adjunto/adjunto.entity';

const RELATIONS = { adjunto: true, imagen: true } as const;

@Injectable()
export class ColaboracionService {
  constructor(@InjectRepository(Colaboracion) private readonly repo: Repository<Colaboracion>) {}

  findAll(): Promise<Colaboracion[]> {
    return this.repo.find({ relations: RELATIONS, order: { fechaInicioPublicacion: 'DESC' } });
  }

  async findOne(id: number): Promise<Colaboracion> {
    const entity = await this.repo.findOne({ where: { id }, relations: RELATIONS });
    if (!entity) throw new NotFoundException(`Colaboracion ${id} no encontrado`);
    return entity;
  }

  async findBySlug(slug: string): Promise<Colaboracion> {
    const entity = await this.repo.findOne({ where: { slug }, relations: RELATIONS });
    if (!entity) throw new NotFoundException(`Colaboracion con slug "${slug}" no encontrado`);
    return entity;
  }

  create(dto: CreateColaboracionDto): Promise<Colaboracion> {
    return this.repo.save(this.toEntity(dto));
  }

  async update(id: number, dto: UpdateColaboracionDto): Promise<Colaboracion> {
    const entity = await this.findOne(id);
    Object.assign(entity, this.toEntity(dto));
    return this.repo.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
  }

  private toEntity(dto: CreateColaboracionDto): Partial<Colaboracion> {
    return {
      titulo: dto.titulo,
      slug: slugify(dto.titulo),
      autores: dto.autores,
      adjunto: { id: dto.adjuntoId } as Adjunto,
      fechaInicioPublicacion: new Date(dto.fechaInicioPublicacion),
      fechaFinPublicacion: new Date(dto.fechaFinPublicacion),
      palabrasClaves: dto.palabrasClaves,
      textoCompleto: dto.textoCompleto,
      imagen: dto.imagenId ? ({ id: dto.imagenId } as Adjunto) : null,
    };
  }
}

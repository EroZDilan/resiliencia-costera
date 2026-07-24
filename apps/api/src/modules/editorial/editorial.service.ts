import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Editorial } from './editorial.entity';
import { CreateEditorialDto, UpdateEditorialDto } from './dto/editorial.dto';
import { slugify } from '../../common/util/slugify';
import { Adjunto } from '../adjunto/adjunto.entity';

const RELATIONS = { adjunto: true, imagen: true } as const;

@Injectable()
export class EditorialService {
  constructor(@InjectRepository(Editorial) private readonly repo: Repository<Editorial>) {}

  findAll(): Promise<Editorial[]> {
    return this.repo.find({ relations: RELATIONS, order: { fechaInicioPublicacion: 'DESC' } });
  }

  async findOne(id: number): Promise<Editorial> {
    const entity = await this.repo.findOne({ where: { id }, relations: RELATIONS });
    if (!entity) throw new NotFoundException(`Editorial ${id} no encontrado`);
    return entity;
  }

  async findBySlug(slug: string): Promise<Editorial> {
    const entity = await this.repo.findOne({ where: { slug }, relations: RELATIONS });
    if (!entity) throw new NotFoundException(`Editorial con slug "${slug}" no encontrado`);
    return entity;
  }

  create(dto: CreateEditorialDto): Promise<Editorial> {
    return this.repo.save(this.toEntity(dto));
  }

  async update(id: number, dto: UpdateEditorialDto): Promise<Editorial> {
    const entity = await this.findOne(id);
    Object.assign(entity, this.toEntity(dto));
    return this.repo.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
  }

  private toEntity(dto: CreateEditorialDto): Partial<Editorial> {
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

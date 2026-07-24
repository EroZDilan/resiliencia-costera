import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bibliografia } from './bibliografia.entity';
import { CreateBibliografiaDto, UpdateBibliografiaDto } from './dto/bibliografia.dto';
import { slugify } from '../../common/util/slugify';
import { Adjunto } from '../adjunto/adjunto.entity';

@Injectable()
export class BibliografiaService {
  constructor(@InjectRepository(Bibliografia) private readonly repo: Repository<Bibliografia>) {}

  findAll(): Promise<Bibliografia[]> {
    return this.repo.find({ relations: { adjunto: true }, order: { titulo: 'ASC' } });
  }

  async findOne(id: number): Promise<Bibliografia> {
    const entity = await this.repo.findOne({ where: { id }, relations: { adjunto: true } });
    if (!entity) throw new NotFoundException(`Bibliografía ${id} no encontrada`);
    return entity;
  }

  async findBySlug(slug: string): Promise<Bibliografia> {
    const entity = await this.repo.findOne({ where: { slug }, relations: { adjunto: true } });
    if (!entity) throw new NotFoundException(`Bibliografía con slug "${slug}" no encontrada`);
    return entity;
  }

  create(dto: CreateBibliografiaDto): Promise<Bibliografia> {
    return this.repo.save(this.toEntity(dto));
  }

  async update(id: number, dto: UpdateBibliografiaDto): Promise<Bibliografia> {
    const entity = await this.findOne(id);
    Object.assign(entity, this.toEntity(dto));
    return this.repo.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
  }

  private toEntity(dto: CreateBibliografiaDto): Partial<Bibliografia> {
    return {
      titulo: dto.titulo,
      slug: slugify(dto.titulo),
      autores: dto.autores,
      isbn: dto.isbn ?? null,
      resumen: dto.resumen ?? null,
      web: dto.web ?? null,
      palabrasClaves: dto.palabrasClaves ?? null,
      adjunto: dto.adjuntoId ? ({ id: dto.adjuntoId } as Adjunto) : null,
    };
  }
}

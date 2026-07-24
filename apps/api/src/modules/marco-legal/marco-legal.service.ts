import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarcoLegal } from './marco-legal.entity';
import { CreateMarcoLegalDto, UpdateMarcoLegalDto } from './dto/marco-legal.dto';
import { slugify } from '../../common/util/slugify';
import { Adjunto } from '../adjunto/adjunto.entity';

@Injectable()
export class MarcoLegalService {
  constructor(@InjectRepository(MarcoLegal) private readonly repo: Repository<MarcoLegal>) {}

  findAll(): Promise<MarcoLegal[]> {
    return this.repo.find({ relations: { adjunto: true }, order: { titulo: 'ASC' } });
  }

  async findOne(id: number): Promise<MarcoLegal> {
    const entity = await this.repo.findOne({ where: { id }, relations: { adjunto: true } });
    if (!entity) throw new NotFoundException(`Marco legal ${id} no encontrado`);
    return entity;
  }

  async findBySlug(slug: string): Promise<MarcoLegal> {
    const entity = await this.repo.findOne({ where: { slug }, relations: { adjunto: true } });
    if (!entity) throw new NotFoundException(`Marco legal con slug "${slug}" no encontrado`);
    return entity;
  }

  create(dto: CreateMarcoLegalDto): Promise<MarcoLegal> {
    return this.repo.save(this.toEntity(dto));
  }

  async update(id: number, dto: UpdateMarcoLegalDto): Promise<MarcoLegal> {
    const entity = await this.findOne(id);
    Object.assign(entity, this.toEntity(dto));
    return this.repo.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
  }

  private toEntity(dto: CreateMarcoLegalDto): Partial<MarcoLegal> {
    return {
      titulo: dto.titulo,
      slug: slugify(dto.titulo),
      tipo: dto.tipo,
      emisor: dto.emisor,
      anno: dto.anno,
      numero: dto.numero,
      web: dto.web ?? null,
      palabrasClaves: dto.palabrasClaves ?? null,
      adjunto: dto.adjuntoId ? ({ id: dto.adjuntoId } as Adjunto) : null,
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Noticia } from './noticia.entity';
import { CreateNoticiaDto, UpdateNoticiaDto } from './dto/noticia.dto';
import { slugify } from '../../common/util/slugify';
import { Adjunto } from '../adjunto/adjunto.entity';

@Injectable()
export class NoticiaService {
  constructor(@InjectRepository(Noticia) private readonly repo: Repository<Noticia>) {}

  findAll(): Promise<Noticia[]> {
    return this.repo.find({ relations: { imagen: true }, order: { fecha: 'DESC' } });
  }

  async findOne(id: number): Promise<Noticia> {
    const entity = await this.repo.findOne({ where: { id }, relations: { imagen: true } });
    if (!entity) throw new NotFoundException(`Noticia ${id} no encontrada`);
    return entity;
  }

  async findBySlug(slug: string): Promise<Noticia> {
    const entity = await this.repo.findOne({ where: { slug }, relations: { imagen: true } });
    if (!entity) throw new NotFoundException(`Noticia con slug "${slug}" no encontrada`);
    return entity;
  }

  create(dto: CreateNoticiaDto): Promise<Noticia> {
    return this.repo.save(this.toEntity(dto));
  }

  async update(id: number, dto: UpdateNoticiaDto): Promise<Noticia> {
    const entity = await this.findOne(id);
    Object.assign(entity, this.toEntity(dto));
    return this.repo.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
  }

  private toEntity(dto: CreateNoticiaDto): Partial<Noticia> {
    return {
      titulo: dto.titulo,
      slug: slugify(dto.titulo),
      resumen: dto.resumen,
      fecha: new Date(dto.fecha),
      imagen: dto.imagenId ? ({ id: dto.imagenId } as Adjunto) : null,
      imagenUrl: dto.imagenUrl ?? null,
      url: dto.url,
    };
  }
}

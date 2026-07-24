import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provincia } from './provincia.entity';
import { CreateProvinciaDto, UpdateProvinciaDto } from './dto/provincia.dto';

@Injectable()
export class ProvinciaService {
  constructor(@InjectRepository(Provincia) private readonly repo: Repository<Provincia>) {}

  findAll(): Promise<Provincia[]> {
    return this.repo.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Provincia> {
    const provincia = await this.repo.findOneBy({ id });
    if (!provincia) throw new NotFoundException(`Provincia ${id} no encontrada`);
    return provincia;
  }

  create(dto: CreateProvinciaDto): Promise<Provincia> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateProvinciaDto): Promise<Provincia> {
    const provincia = await this.findOne(id);
    Object.assign(provincia, dto);
    return this.repo.save(provincia);
  }

  async remove(id: number): Promise<void> {
    const provincia = await this.findOne(id);
    await this.repo.remove(provincia);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Municipio } from './municipio.entity';
import { CreateMunicipioDto, UpdateMunicipioDto } from './dto/municipio.dto';
import { Provincia } from '../provincia/provincia.entity';

@Injectable()
export class MunicipioService {
  constructor(@InjectRepository(Municipio) private readonly repo: Repository<Municipio>) {}

  findAll(): Promise<Municipio[]> {
    return this.repo.find({ relations: { provincia: true }, order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Municipio> {
    const municipio = await this.repo.findOne({ where: { id }, relations: { provincia: true } });
    if (!municipio) throw new NotFoundException(`Municipio ${id} no encontrado`);
    return municipio;
  }

  create(dto: CreateMunicipioDto): Promise<Municipio> {
    return this.repo.save(this.toEntity(dto));
  }

  async update(id: number, dto: UpdateMunicipioDto): Promise<Municipio> {
    const municipio = await this.findOne(id);
    Object.assign(municipio, this.toEntity(dto));
    return this.repo.save(municipio);
  }

  async remove(id: number): Promise<void> {
    const municipio = await this.findOne(id);
    await this.repo.remove(municipio);
  }

  private toEntity(dto: CreateMunicipioDto): Partial<Municipio> {
    return {
      nombre: dto.nombre,
      dpa: dto.dpa,
      provincia: dto.provinciaId ? ({ id: dto.provinciaId } as Provincia) : null,
    };
  }
}

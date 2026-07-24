import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuracion } from './configuracion.entity';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';
import { Adjunto } from '../adjunto/adjunto.entity';

const RELATIONS = { logo: true, logoTextless: true } as const;

@Injectable()
export class ConfiguracionService {
  constructor(@InjectRepository(Configuracion) private readonly repo: Repository<Configuracion>) {}

  async get(): Promise<Configuracion> {
    const config = await this.repo.findOne({ where: { id: 1 }, relations: RELATIONS });
    if (!config) throw new NotFoundException('Configuración no encontrada');
    return config;
  }

  async update(dto: UpdateConfiguracionDto): Promise<Configuracion> {
    const config = await this.get();
    Object.assign(config, {
      ...dto,
      logo: { id: dto.logoId } as Adjunto,
      logoTextless: dto.logoTextlessId ? ({ id: dto.logoTextlessId } as Adjunto) : null,
    });
    await this.repo.save(config);
    return this.get();
  }
}

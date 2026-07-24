import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoLugar } from './proyecto-lugar.entity';
import { CreateProyectoLugarDto, UpdateProyectoLugarDto } from './dto/proyecto-lugar.dto';
import { ProyectoService } from './proyecto.service';

@Injectable()
export class ProyectoLugarService {
  constructor(
    @InjectRepository(ProyectoLugar) private readonly repo: Repository<ProyectoLugar>,
    private readonly proyectoService: ProyectoService,
  ) {}

  findAllByProyecto(proyectoId: number): Promise<ProyectoLugar[]> {
    return this.repo.find({ where: { proyecto: { id: proyectoId } }, order: { nombre: 'ASC' } });
  }

  async findOne(proyectoId: number, id: number): Promise<ProyectoLugar> {
    const lugar = await this.repo.findOne({ where: { id, proyecto: { id: proyectoId } } });
    if (!lugar) throw new NotFoundException(`Lugar ${id} no encontrado para el proyecto ${proyectoId}`);
    return lugar;
  }

  async create(proyectoId: number, dto: CreateProyectoLugarDto): Promise<ProyectoLugar> {
    const proyecto = await this.proyectoService.findOne(proyectoId);
    const lugar = this.repo.create({ ...dto, proyecto });
    return this.save(lugar);
  }

  async update(proyectoId: number, id: number, dto: UpdateProyectoLugarDto): Promise<ProyectoLugar> {
    const lugar = await this.findOne(proyectoId, id);
    Object.assign(lugar, dto);
    return this.save(lugar);
  }

  async remove(proyectoId: number, id: number): Promise<void> {
    const lugar = await this.findOne(proyectoId, id);
    await this.repo.remove(lugar);
  }

  private async save(lugar: ProyectoLugar): Promise<ProyectoLugar> {
    try {
      return await this.repo.save(lugar);
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Ya existe un lugar con ese nombre para este proyecto.');
      }
      throw err;
    }
  }
}

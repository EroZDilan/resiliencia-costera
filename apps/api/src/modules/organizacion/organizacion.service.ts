import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organizacion } from './organizacion.entity';
import { CreateOrganizacionDto } from './dto/create-organizacion.dto';
import { UpdateOrganizacionDto } from './dto/update-organizacion.dto';
import { slugify } from '../../common/util/slugify';

@Injectable()
export class OrganizacionService {
  constructor(
    @InjectRepository(Organizacion) private readonly repo: Repository<Organizacion>,
  ) {}

  findAll(): Promise<Organizacion[]> {
    return this.repo.find({ relations: { logo: true }, order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Organizacion> {
    const org = await this.repo.findOne({ where: { id }, relations: { logo: true } });
    if (!org) throw new NotFoundException(`Organizacion ${id} no encontrada`);
    return org;
  }

  async findBySlug(slug: string): Promise<Organizacion> {
    const org = await this.repo.findOne({ where: { slug }, relations: { logo: true } });
    if (!org) throw new NotFoundException(`Organizacion con slug "${slug}" no encontrada`);
    return org;
  }

  async create(dto: CreateOrganizacionDto): Promise<Organizacion> {
    const org = this.repo.create({
      ...dto,
      slug: slugify(dto.nombre),
      logo: { id: dto.logoId } as any,
    });
    return this.save(org);
  }

  async update(id: number, dto: UpdateOrganizacionDto): Promise<Organizacion> {
    const org = await this.findOne(id);
    Object.assign(org, dto);
    if (dto.nombre) org.slug = slugify(dto.nombre);
    if (dto.logoId) org.logo = { id: dto.logoId } as any;
    return this.save(org);
  }

  async remove(id: number): Promise<void> {
    const org = await this.findOne(id);
    await this.repo.remove(org);
  }

  // Mirrors OrganizacionController::comunCheckNullableConstrains: logo is
  // required (email/telefono requirement is commented out in the legacy code
  // and intentionally NOT enforced here).
  private async save(org: Organizacion): Promise<Organizacion> {
    if (!org.logo) {
      throw new BadRequestException('Debe indicar un logo para la organización.');
    }
    try {
      return await this.repo.save(org);
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Ya existe una organización con ese nombre.');
      }
      throw err;
    }
  }
}

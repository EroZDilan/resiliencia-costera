import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Iniciativa } from './iniciativa.entity';
import { CreateIniciativaDto } from './dto/create-iniciativa.dto';
import { UpdateIniciativaDto } from './dto/update-iniciativa.dto';
import { slugify } from '../../common/util/slugify';
import { Organizacion } from '../organizacion/organizacion.entity';
import { Adjunto } from '../adjunto/adjunto.entity';
import { ExcelExportService } from '../../common/excel/excel-export.service';

const RELATIONS = { logo: true, organizacionesLideres: true, organizacionesParticipantes: true } as const;

@Injectable()
export class IniciativaService {
  constructor(
    @InjectRepository(Iniciativa) private readonly repo: Repository<Iniciativa>,
    @InjectRepository(Organizacion) private readonly organizacionRepo: Repository<Organizacion>,
    private readonly excelExport: ExcelExportService,
  ) {}

  findAll(): Promise<Iniciativa[]> {
    return this.repo.find({ relations: RELATIONS, order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Iniciativa> {
    const entity = await this.repo.findOne({ where: { id }, relations: RELATIONS });
    if (!entity) throw new NotFoundException(`Iniciativa ${id} no encontrada`);
    return entity;
  }

  async findBySlug(slug: string): Promise<Iniciativa> {
    const entity = await this.repo.findOne({ where: { slug }, relations: RELATIONS });
    if (!entity) throw new NotFoundException(`Iniciativa con slug "${slug}" no encontrada`);
    return entity;
  }

  async create(dto: CreateIniciativaDto): Promise<Iniciativa> {
    const entity = this.repo.create(await this.dtoToEntity(dto));
    entity.slug = slugify(dto.nombre);
    return this.save(entity);
  }

  async update(id: number, dto: UpdateIniciativaDto): Promise<Iniciativa> {
    const entity = await this.findOne(id);
    Object.assign(entity, await this.dtoToEntity(dto, entity));
    if (dto.nombre) entity.slug = slugify(dto.nombre);
    return this.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
  }

  async exportExcel(): Promise<Buffer> {
    const items = await this.findAll();
    return this.excelExport.build(
      'Iniciativas',
      [
        { header: 'Nombre', key: 'nombre' },
        { header: 'Contacto', key: 'contacto' },
        { header: 'En la web', key: 'online' },
        { header: 'Líderes', key: 'lideres' },
        { header: 'Participantes', key: 'participantes' },
      ],
      items.map((i) => ({
        nombre: i.nombre,
        contacto: i.email ?? i.telefono ?? '',
        online: i.facebook ?? '',
        lideres: [...i.organizacionesLideres.map((o) => o.nombre), i.otrosLideres].filter(Boolean).join(', '),
        participantes: [...i.organizacionesParticipantes.map((o) => o.nombre), i.otrosParticipantes]
          .filter(Boolean)
          .join(', '),
      })),
    );
  }

  private async dtoToEntity(
    dto: Partial<CreateIniciativaDto>,
    base: Partial<Iniciativa> = {},
  ): Promise<Partial<Iniciativa>> {
    const entity: Partial<Iniciativa> = { ...base, ...dto } as Partial<Iniciativa>;
    if (dto.logoId !== undefined) entity.logo = { id: dto.logoId } as Adjunto;

    if (dto.organizacionesLideresIds !== undefined) {
      entity.organizacionesLideres = dto.organizacionesLideresIds.length
        ? await this.organizacionRepo.findBy({ id: In(dto.organizacionesLideresIds) })
        : [];
    }
    if (dto.organizacionesParticipantesIds !== undefined) {
      entity.organizacionesParticipantes = dto.organizacionesParticipantesIds.length
        ? await this.organizacionRepo.findBy({ id: In(dto.organizacionesParticipantesIds) })
        : [];
    }
    return entity;
  }

  // Mirrors IniciativaController::comunCheckNullableConstrains: logo
  // required, email-or-telefono required, and at least one líder (either an
  // Organizacion or free-text otrosLideres) required.
  private async save(entity: Iniciativa): Promise<Iniciativa> {
    if (!entity.logo) {
      throw new BadRequestException('Debe indicar un logo para la iniciativa.');
    }
    if (!entity.email && !entity.telefono) {
      throw new BadRequestException('Debe indicar un email o un teléfono de contacto.');
    }
    if ((entity.organizacionesLideres?.length ?? 0) === 0 && !entity.otrosLideres) {
      throw new BadRequestException('Debe indicar al menos un líder de la iniciativa.');
    }
    try {
      const saved = await this.repo.save(entity);
      return this.findOne(saved.id);
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Ya existe una iniciativa con ese nombre.');
      }
      throw err;
    }
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Proyecto } from './proyecto.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { slugify } from '../../common/util/slugify';
import { absoluteUrl } from '../../common/util/absolute-url';
import { Organizacion } from '../organizacion/organizacion.entity';
import { Adjunto } from '../adjunto/adjunto.entity';
import { EstadoProyecto } from '../../common/enums/estado-proyecto.enum';
import { ExcelExportService } from '../../common/excel/excel-export.service';

const RELATIONS = {
  logo: true,
  organizacionesLideres: true,
  organizacionesParticipantes: true,
  productos: true,
  lugares: true,
} as const;

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto) private readonly repo: Repository<Proyecto>,
    @InjectRepository(Organizacion) private readonly organizacionRepo: Repository<Organizacion>,
    @InjectRepository(Adjunto) private readonly adjuntoRepo: Repository<Adjunto>,
    private readonly excelExport: ExcelExportService,
  ) {}

  findAll(): Promise<Proyecto[]> {
    return this.repo.find({ relations: RELATIONS, order: { nombreCorto: 'ASC' } });
  }

  // Mirrors DefaultController::proyectosIndexAction(): defaults to EN_CURSO.
  findAllPublic(estado: EstadoProyecto = EstadoProyecto.EN_CURSO): Promise<Proyecto[]> {
    return this.repo.find({
      where: { estado },
      relations: RELATIONS,
      order: { nombreCorto: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Proyecto> {
    const proyecto = await this.repo.findOne({ where: { id }, relations: RELATIONS });
    if (!proyecto) throw new NotFoundException(`Proyecto ${id} no encontrado`);
    return proyecto;
  }

  async findBySlug(slug: string): Promise<Proyecto> {
    const proyecto = await this.repo.findOne({ where: { slug }, relations: RELATIONS });
    if (!proyecto) throw new NotFoundException(`Proyecto con slug "${slug}" no encontrado`);
    return proyecto;
  }

  async create(dto: CreateProyectoDto): Promise<Proyecto> {
    const proyecto = this.repo.create(await this.dtoToEntity(dto));
    proyecto.slug = slugify(dto.nombreCorto);
    return this.save(proyecto);
  }

  async update(id: number, dto: UpdateProyectoDto): Promise<Proyecto> {
    const proyecto = await this.findOne(id);
    Object.assign(proyecto, await this.dtoToEntity(dto, proyecto));
    if (dto.nombreCorto) proyecto.slug = slugify(dto.nombreCorto);
    return this.save(proyecto);
  }

  async remove(id: number): Promise<void> {
    const proyecto = await this.findOne(id);
    await this.repo.remove(proyecto);
  }

  // Mirrors ProyectoController::excelAction()'s field set (indexGetFields
  // renames: estado->estadoStr, email->contacto, facebook->online).
  async exportExcel(): Promise<Buffer> {
    const proyectos = await this.findAll();
    return this.excelExport.build(
      'Proyectos',
      [
        { header: 'Nombre corto', key: 'nombreCorto' },
        { header: 'Estado', key: 'estadoStr' },
        { header: 'Contacto', key: 'contacto' },
        { header: 'En la web', key: 'online' },
        { header: 'Líderes', key: 'lideres' },
        { header: 'Participantes', key: 'participantes' },
      ],
      proyectos.map((p) => ({
        nombreCorto: p.nombreCorto,
        estadoStr: p.estado === EstadoProyecto.EN_CURSO ? 'En curso' : 'Terminado',
        contacto: p.email ?? p.telefono ?? '',
        online: p.web ?? '',
        lideres: [...p.organizacionesLideres.map((o) => o.nombre), p.otrosLideres]
          .filter(Boolean)
          .join(', '),
        participantes: [...p.organizacionesParticipantes.map((o) => o.nombre), p.otrosParticipantes]
          .filter(Boolean)
          .join(', '),
      })),
    );
  }

  private async dtoToEntity(
    dto: Partial<CreateProyectoDto>,
    base: Partial<Proyecto> = {},
  ): Promise<Partial<Proyecto>> {
    const entity: Partial<Proyecto> = { ...base, ...dto } as Partial<Proyecto>;

    if (dto.web !== undefined) entity.web = absoluteUrl(dto.web)!;
    if (dto.facebook !== undefined) entity.facebook = absoluteUrl(dto.facebook);
    if (dto.instagram !== undefined) entity.instagram = absoluteUrl(dto.instagram);
    if (dto.twitter !== undefined) entity.twitter = absoluteUrl(dto.twitter);
    if (dto.fechaInicio !== undefined) entity.fechaInicio = new Date(dto.fechaInicio);
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
    if (dto.productosIds !== undefined) {
      entity.productos = dto.productosIds.length
        ? await this.adjuntoRepo.findBy({ id: In(dto.productosIds) })
        : [];
    }
    return entity;
  }

  // Mirrors ProyectoController::comunCheckNullableConstrains: logo is
  // required, and at least one of email/telefono must be set.
  private async save(proyecto: Proyecto): Promise<Proyecto> {
    if (!proyecto.logo) {
      throw new BadRequestException('Debe indicar un logo para el proyecto.');
    }
    if (!proyecto.email && !proyecto.telefono) {
      throw new BadRequestException('Debe indicar un email o un teléfono de contacto.');
    }
    try {
      const saved = await this.repo.save(proyecto);
      return this.findOne(saved.id);
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Ya existe un proyecto con ese nombre corto.');
      }
      throw err;
    }
  }
}

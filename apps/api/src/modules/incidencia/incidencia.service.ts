import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incidencia } from './incidencia.entity';
import { IncidenciaHistoria } from './incidencia-historia.entity';
import { IncidenciaRespuesta } from './incidencia-respuesta.entity';
import { CreateIncidenciaDto, ResponderIncidenciaDto } from './dto/incidencia.dto';
import { EstadoIncidencia, ESTADO_INCIDENCIA_READABLE } from '../../common/enums/estado-incidencia.enum';
import { CurrentUser } from '../../common/auth/current-user.decorator';

const RELATIONS = { historias: { respuesta: true }, respuestas: true } as const;

// Mirrors legacy uniqid(): opaque short hex tracking code shown to the citizen.
function uniqid(): string {
  return Date.now().toString(16) + Math.floor(Math.random() * 0xfffff).toString(16);
}

@Injectable()
export class IncidenciaService {
  constructor(
    @InjectRepository(Incidencia) private readonly repo: Repository<Incidencia>,
    @InjectRepository(IncidenciaHistoria) private readonly historiaRepo: Repository<IncidenciaHistoria>,
    @InjectRepository(IncidenciaRespuesta) private readonly respuestaRepo: Repository<IncidenciaRespuesta>,
  ) {}

  findAll(): Promise<Incidencia[]> {
    return this.repo.find({ relations: RELATIONS, order: { fechaEstado: 'DESC' } });
  }

  // Mirrors IncidenciaController::indexLoadEntities(): grouped by whether
  // it's unassigned, assigned to me, or assigned to someone else.
  async findAllGrouped(currentUserId: number) {
    const all = await this.findAll();
    const grouped: { pendientes: Incidencia[]; propias: Incidencia[]; otras: Incidencia[] } = {
      pendientes: [],
      propias: [],
      otras: [],
    };
    for (const inc of all) {
      if (!inc.atendidaPorId) grouped.pendientes.push(inc);
      else if (inc.atendidaPorId === currentUserId) grouped.propias.push(inc);
      else grouped.otras.push(inc);
    }
    return grouped;
  }

  async findOne(id: number): Promise<Incidencia> {
    const entity = await this.repo.findOne({ where: { id }, relations: RELATIONS });
    if (!entity) throw new NotFoundException(`Incidencia ${id} no encontrada`);
    return entity;
  }

  // Public creation via "contactenos". Mirrors setValuesAfterForm (CREATE)
  // + afterSave -> creaHistoria().
  async create(dto: CreateIncidenciaDto): Promise<Incidencia> {
    const now = new Date();
    const incidencia = await this.repo.save(
      this.repo.create({
        ...dto,
        estado: EstadoIncidencia.PENDIENTE,
        codigo: uniqid(),
        fechaEstado: now,
      }),
    );
    await this.historiaRepo.save(
      this.historiaRepo.create({
        incidencia,
        historia: `Incidencia creada. Estado cambiado a "${ESTADO_INCIDENCIA_READABLE[EstadoIncidencia.PENDIENTE]}"`,
        fecha: now,
      }),
    );
    return this.findOne(incidencia.id);
  }

  // Mirrors IncidenciaController::atenderAction()
  async atender(id: number, user: CurrentUser): Promise<Incidencia> {
    const incidencia = await this.findOne(id);
    if (incidencia.estado === EstadoIncidencia.PENDIENTE) {
      const now = new Date();
      await this.repo.update(id, {
        estado: EstadoIncidencia.EN_PROCESO,
        atendidaPorId: user.id,
        fechaEstado: now,
      });
      await this.registrarCambioEstado(id, EstadoIncidencia.EN_PROCESO, user.id, now);
    }
    return this.findOne(id);
  }

  // Mirrors IncidenciaController::cerrarAction()
  async cerrar(id: number, user: CurrentUser): Promise<Incidencia> {
    await this.findOne(id);
    const now = new Date();
    await this.repo.update(id, { estado: EstadoIncidencia.CERRADO, fechaEstado: now });
    await this.registrarCambioEstado(id, EstadoIncidencia.CERRADO, user.id, now);
    return this.findOne(id);
  }

  // Mirrors IncidenciaController::reabrirAction()
  async reabrir(id: number, user: CurrentUser): Promise<Incidencia> {
    await this.findOne(id);
    const now = new Date();
    await this.repo.update(id, { estado: EstadoIncidencia.EN_PROCESO, fechaEstado: now });
    await this.registrarCambioEstado(id, EstadoIncidencia.EN_PROCESO, user.id, now);
    return this.findOne(id);
  }

  // Mirrors IncidenciaController::responderAction()
  async responder(id: number, dto: ResponderIncidenciaDto, user: CurrentUser): Promise<Incidencia> {
    await this.findOne(id);
    const now = new Date();

    const respuesta = await this.respuestaRepo.save(
      this.respuestaRepo.create({
        incidencia: { id } as Incidencia,
        respondidaPorId: user.id,
        respuesta: dto.respuesta,
        fecha: now,
      }),
    );

    if (dto.enviarCerrar) {
      await this.repo.update(id, { estado: EstadoIncidencia.CERRADO, fechaEstado: now });
    }

    const historia = dto.enviarCerrar
      ? `Respuesta creada. Estado cambiado a "${ESTADO_INCIDENCIA_READABLE[EstadoIncidencia.CERRADO]}"`
      : 'Respuesta creada';

    await this.historiaRepo.save(
      this.historiaRepo.create({
        incidencia: { id } as Incidencia,
        historia,
        fecha: now,
        hechoPorId: user.id,
        respuesta,
      }),
    );

    return this.findOne(id);
  }

  // Mirrors IncidenciaController::creaHistoria() for the plain state-change
  // branch (no IncidenciaRespuesta involved).
  private async registrarCambioEstado(
    incidenciaId: number,
    nuevoEstado: EstadoIncidencia,
    userId: number,
    fecha: Date,
  ): Promise<void> {
    await this.historiaRepo.save(
      this.historiaRepo.create({
        incidencia: { id: incidenciaId } as Incidencia,
        historia: `Estado cambiado a "${ESTADO_INCIDENCIA_READABLE[nuevoEstado]}"`,
        fecha,
        hechoPorId: userId,
      }),
    );
  }
}

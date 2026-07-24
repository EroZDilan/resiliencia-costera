import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Glosario } from './glosario.entity';
import { CreateGlosarioDto, UpdateGlosarioDto } from './dto/glosario.dto';

@Injectable()
export class GlosarioService {
  constructor(@InjectRepository(Glosario) private readonly repo: Repository<Glosario>) {}

  findAll(): Promise<Glosario[]> {
    return this.repo.find({ order: { termino: 'ASC' } });
  }

  // Mirrors DefaultController::glosarioIndexAction(): grouped by first
  // letter, keeping the full entity (the legacy Twig template reads
  // termino.significado, not just the term name).
  async findAllGroupedByLetter(): Promise<Record<string, Glosario[]>> {
    const terminos = await this.repo.find({ order: { termino: 'ASC' } });
    const grouped: Record<string, Glosario[]> = {};
    for (const t of terminos) {
      const letter = t.termino.charAt(0).toUpperCase();
      (grouped[letter] ??= []).push(t);
    }
    return grouped;
  }

  async findOne(id: number): Promise<Glosario> {
    const glosario = await this.repo.findOneBy({ id });
    if (!glosario) throw new NotFoundException(`Término de glosario ${id} no encontrado`);
    return glosario;
  }

  create(dto: CreateGlosarioDto): Promise<Glosario> {
    return this.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateGlosarioDto): Promise<Glosario> {
    const glosario = await this.findOne(id);
    Object.assign(glosario, dto);
    return this.save(glosario);
  }

  async remove(id: number): Promise<void> {
    const glosario = await this.findOne(id);
    await this.repo.remove(glosario);
  }

  private async save(glosario: Glosario): Promise<Glosario> {
    try {
      return await this.repo.save(glosario);
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Ya existe ese término en el glosario.');
      }
      throw err;
    }
  }
}

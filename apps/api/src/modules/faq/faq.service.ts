import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './faq.entity';
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';

@Injectable()
export class FaqService {
  constructor(@InjectRepository(Faq) private readonly repo: Repository<Faq>) {}

  findAll(): Promise<Faq[]> {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Faq> {
    const faq = await this.repo.findOneBy({ id });
    if (!faq) throw new NotFoundException(`Faq ${id} no encontrada`);
    return faq;
  }

  create(dto: CreateFaqDto): Promise<Faq> {
    return this.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateFaqDto): Promise<Faq> {
    const faq = await this.findOne(id);
    Object.assign(faq, dto);
    return this.save(faq);
  }

  async remove(id: number): Promise<void> {
    const faq = await this.findOne(id);
    await this.repo.remove(faq);
  }

  private async save(faq: Faq): Promise<Faq> {
    try {
      return await this.repo.save(faq);
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Ya existe esa pregunta en la FAQ.');
      }
      throw err;
    }
  }
}

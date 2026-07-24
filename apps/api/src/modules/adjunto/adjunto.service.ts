import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { extname } from 'path';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { Adjunto } from './adjunto.entity';

const UPLOAD_SUBDIR = 'uploads';

@Injectable()
export class AdjuntoService {
  constructor(
    @InjectRepository(Adjunto) private readonly repo: Repository<Adjunto>,
    private readonly config: ConfigService,
  ) {}

  private uploadsDir(): string {
    return this.config.get<string>('UPLOADS_DIR')!;
  }

  // Mirrors legacy crudPlainController::comunUpload(): "<rand 1..99999999>.<ext>"
  async saveFile(file: Express.Multer.File): Promise<Adjunto> {
    const dir = this.uploadsDir();
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
    const ext = extname(file.originalname).replace('.', '') || 'bin';
    const fileName = `${Math.floor(Math.random() * 99999999) + 1}.${ext}`;
    await writeFile(`${dir}/${fileName}`, file.buffer);

    const adjunto = this.repo.create({
      archivo: file.originalname,
      ruta: UPLOAD_SUBDIR,
      archivoHash: fileName,
      size: file.size,
      mimeType: file.mimetype,
    });
    return this.repo.save(adjunto);
  }

  async findOne(id: number): Promise<Adjunto> {
    const adjunto = await this.repo.findOneBy({ id });
    if (!adjunto) throw new NotFoundException(`Adjunto ${id} no encontrado`);
    return adjunto;
  }

  async remove(id: number): Promise<void> {
    const adjunto = await this.findOne(id);
    const path = `${this.uploadsDir()}/${adjunto.archivoHash}`;
    if (existsSync(path)) {
      await unlink(path);
    }
    await this.repo.remove(adjunto);
  }
}

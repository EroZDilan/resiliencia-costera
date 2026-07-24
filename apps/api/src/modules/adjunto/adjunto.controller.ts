import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdjuntoService } from './adjunto.service';
import { Roles } from '../../common/auth/roles.decorator';

@Controller('admin/adjuntos')
export class AdjuntoController {
  constructor(private readonly service: AdjuntoService) {}

  @Post()
  @Roles('ROLE_ADMINISTRADOR')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new NotFoundException('No se recibió ningún archivo');
    return this.service.saveFile(file);
  }

  @Get(':id')
  @Roles('ROLE_ADMINISTRADOR')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @Roles('ROLE_ADMINISTRADOR')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { ok: true };
  }
}

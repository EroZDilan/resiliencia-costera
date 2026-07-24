import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { IniciativaService } from './iniciativa.service';
import { CreateIniciativaDto } from './dto/create-iniciativa.dto';
import { UpdateIniciativaDto } from './dto/update-iniciativa.dto';
import { Roles } from '../../common/auth/roles.decorator';

@Controller('admin/iniciativas')
@Roles('ROLE_ADMINISTRADOR')
export class IniciativaAdminController {
  constructor(private readonly service: IniciativaService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('export/excel')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="iniciativas.xlsx"')
  async exportExcel(@Res() res: Response) {
    res.send(await this.service.exportExcel());
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateIniciativaDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIniciativaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { ok: true };
  }
}

@Controller('public/iniciativas')
export class IniciativaPublicController {
  constructor(private readonly service: IniciativaService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }
}

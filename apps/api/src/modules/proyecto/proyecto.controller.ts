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
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Roles } from '../../common/auth/roles.decorator';
import { EstadoProyecto } from '../../common/enums/estado-proyecto.enum';

@Controller('admin/proyectos')
@Roles('ROLE_ADMINISTRADOR')
export class ProyectoAdminController {
  constructor(private readonly service: ProyectoService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('export/excel')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="proyectos.xlsx"')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.service.exportExcel();
    res.send(buffer);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProyectoDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProyectoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { ok: true };
  }
}

@Controller('public/proyectos')
export class ProyectoPublicController {
  constructor(private readonly service: ProyectoService) {}

  @Get()
  findAll(@Query('estado') estado?: EstadoProyecto) {
    return this.service.findAllPublic(estado);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }
}

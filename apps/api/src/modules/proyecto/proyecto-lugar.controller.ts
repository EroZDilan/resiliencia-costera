import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProyectoLugarService } from './proyecto-lugar.service';
import { CreateProyectoLugarDto, UpdateProyectoLugarDto } from './dto/proyecto-lugar.dto';
import { Roles } from '../../common/auth/roles.decorator';

@Controller('admin/proyectos/:proyectoId/lugares')
@Roles('ROLE_ADMINISTRADOR')
export class ProyectoLugarController {
  constructor(private readonly service: ProyectoLugarService) {}

  @Get()
  findAll(@Param('proyectoId', ParseIntPipe) proyectoId: number) {
    return this.service.findAllByProyecto(proyectoId);
  }

  @Post()
  create(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Body() dto: CreateProyectoLugarDto,
  ) {
    return this.service.create(proyectoId, dto);
  }

  @Patch(':id')
  update(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProyectoLugarDto,
  ) {
    return this.service.update(proyectoId, id, dto);
  }

  @Delete(':id')
  async remove(
    @Param('proyectoId', ParseIntPipe) proyectoId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.service.remove(proyectoId, id);
    return { ok: true };
  }
}

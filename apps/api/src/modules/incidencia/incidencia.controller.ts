import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { IncidenciaService } from './incidencia.service';
import { CreateIncidenciaDto, ResponderIncidenciaDto } from './dto/incidencia.dto';
import { Roles } from '../../common/auth/roles.decorator';
import { CurrentUser } from '../../common/auth/current-user.decorator';

@Controller('admin/incidencias')
@Roles('ROLE_ADMINISTRADOR')
export class IncidenciaAdminController {
  constructor(private readonly service: IncidenciaService) {}

  @Get()
  findAllGrouped(@CurrentUser() user: CurrentUser) {
    return this.service.findAllGrouped(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post(':id/atender')
  atender(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUser) {
    return this.service.atender(id, user);
  }

  @Post(':id/cerrar')
  cerrar(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUser) {
    return this.service.cerrar(id, user);
  }

  @Post(':id/reabrir')
  reabrir(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUser) {
    return this.service.reabrir(id, user);
  }

  @Post(':id/responder')
  responder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResponderIncidenciaDto,
    @CurrentUser() user: CurrentUser,
  ) {
    return this.service.responder(id, dto, user);
  }
}

// Public creation only, mirrors the "contactenos" front form.
@Controller('public/incidencias')
export class IncidenciaPublicController {
  constructor(private readonly service: IncidenciaService) {}

  @Post()
  create(@Body() dto: CreateIncidenciaDto) {
    return this.service.create(dto);
  }
}

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
import { ProvinciaService } from './provincia.service';
import { CreateProvinciaDto, UpdateProvinciaDto } from './dto/provincia.dto';
import { Roles } from '../../common/auth/roles.decorator';

// Admin-only reference data (config/crud.yml: allowedRol: admin, no front role).
@Controller('admin/provincias')
@Roles('ROLE_ADMINISTRADOR')
export class ProvinciaController {
  constructor(private readonly service: ProvinciaService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProvinciaDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProvinciaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { ok: true };
  }
}

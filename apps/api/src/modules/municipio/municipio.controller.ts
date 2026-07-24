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
import { MunicipioService } from './municipio.service';
import { CreateMunicipioDto, UpdateMunicipioDto } from './dto/municipio.dto';
import { Roles } from '../../common/auth/roles.decorator';

@Controller('admin/municipios')
@Roles('ROLE_ADMINISTRADOR')
export class MunicipioController {
  constructor(private readonly service: MunicipioService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateMunicipioDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMunicipioDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { ok: true };
  }
}

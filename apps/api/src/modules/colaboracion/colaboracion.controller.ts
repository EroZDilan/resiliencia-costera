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
import { ColaboracionService } from './colaboracion.service';
import { CreateColaboracionDto, UpdateColaboracionDto } from './dto/colaboracion.dto';
import { Roles } from '../../common/auth/roles.decorator';

@Controller('admin/colaboraciones')
@Roles('ROLE_ADMINISTRADOR')
export class ColaboracionAdminController {
  constructor(private readonly service: ColaboracionService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateColaboracionDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateColaboracionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { ok: true };
  }
}

@Controller('public/colaboraciones')
export class ColaboracionPublicController {
  constructor(private readonly service: ColaboracionService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }
}

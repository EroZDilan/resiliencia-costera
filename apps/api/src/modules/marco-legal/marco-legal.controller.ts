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
import { MarcoLegalService } from './marco-legal.service';
import { CreateMarcoLegalDto, UpdateMarcoLegalDto } from './dto/marco-legal.dto';
import { Roles } from '../../common/auth/roles.decorator';

@Controller('admin/marco-legal')
@Roles('ROLE_ADMINISTRADOR')
export class MarcoLegalAdminController {
  constructor(private readonly service: MarcoLegalService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateMarcoLegalDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMarcoLegalDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { ok: true };
  }
}

@Controller('public/marco-legal')
export class MarcoLegalPublicController {
  constructor(private readonly service: MarcoLegalService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }
}

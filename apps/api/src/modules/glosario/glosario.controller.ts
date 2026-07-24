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
import { GlosarioService } from './glosario.service';
import { CreateGlosarioDto, UpdateGlosarioDto } from './dto/glosario.dto';
import { Roles } from '../../common/auth/roles.decorator';

@Controller('admin/glosario')
@Roles('ROLE_ADMINISTRADOR')
export class GlosarioAdminController {
  constructor(private readonly service: GlosarioService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateGlosarioDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGlosarioDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { ok: true };
  }
}

@Controller('public/glosario')
export class GlosarioPublicController {
  constructor(private readonly service: GlosarioService) {}

  @Get()
  findAllGrouped() {
    return this.service.findAllGroupedByLetter();
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { NoticiaService } from './noticia.service';
import { CreateNoticiaDto, UpdateNoticiaDto } from './dto/noticia.dto';
import { NoticiaOpenGraphService } from './noticia-opengraph.service';
import { Roles } from '../../common/auth/roles.decorator';

@Controller('admin/noticias')
@Roles('ROLE_ADMINISTRADOR')
export class NoticiaAdminController {
  constructor(
    private readonly service: NoticiaService,
    private readonly openGraph: NoticiaOpenGraphService,
  ) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  // Mirrors get_noticia_from_url (NoticiaController::getNoticiaFromUrlAction).
  @Get('scrape')
  scrape(@Query('url') url: string) {
    return this.openGraph.scrape(url);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateNoticiaDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNoticiaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { ok: true };
  }
}

@Controller('public/noticias')
export class NoticiaPublicController {
  constructor(private readonly service: NoticiaService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }
}

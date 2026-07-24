import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Noticia } from './noticia.entity';
import { NoticiaService } from './noticia.service';
import { NoticiaOpenGraphService } from './noticia-opengraph.service';
import { NoticiaAdminController, NoticiaPublicController } from './noticia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Noticia])],
  controllers: [NoticiaAdminController, NoticiaPublicController],
  providers: [NoticiaService, NoticiaOpenGraphService],
  exports: [NoticiaService, TypeOrmModule],
})
export class NoticiaModule {}

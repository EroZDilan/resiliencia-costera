import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bibliografia } from './bibliografia.entity';
import { BibliografiaService } from './bibliografia.service';
import { BibliografiaAdminController, BibliografiaPublicController } from './bibliografia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bibliografia])],
  controllers: [BibliografiaAdminController, BibliografiaPublicController],
  providers: [BibliografiaService],
  exports: [BibliografiaService, TypeOrmModule],
})
export class BibliografiaModule {}

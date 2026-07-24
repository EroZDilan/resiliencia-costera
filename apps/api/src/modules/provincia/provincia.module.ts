import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provincia } from './provincia.entity';
import { ProvinciaService } from './provincia.service';
import { ProvinciaController } from './provincia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Provincia])],
  controllers: [ProvinciaController],
  providers: [ProvinciaService],
  exports: [ProvinciaService, TypeOrmModule],
})
export class ProvinciaModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Colaboracion } from './colaboracion.entity';
import { ColaboracionService } from './colaboracion.service';
import { ColaboracionAdminController, ColaboracionPublicController } from './colaboracion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Colaboracion])],
  controllers: [ColaboracionAdminController, ColaboracionPublicController],
  providers: [ColaboracionService],
  exports: [ColaboracionService, TypeOrmModule],
})
export class ColaboracionModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Iniciativa } from './iniciativa.entity';
import { IniciativaService } from './iniciativa.service';
import { IniciativaAdminController, IniciativaPublicController } from './iniciativa.controller';
import { OrganizacionModule } from '../organizacion/organizacion.module';
import { ExcelExportModule } from '../../common/excel/excel-export.module';

@Module({
  imports: [TypeOrmModule.forFeature([Iniciativa]), OrganizacionModule, ExcelExportModule],
  controllers: [IniciativaAdminController, IniciativaPublicController],
  providers: [IniciativaService],
  exports: [IniciativaService],
})
export class IniciativaModule {}

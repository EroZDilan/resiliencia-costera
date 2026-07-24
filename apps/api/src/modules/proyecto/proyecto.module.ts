import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from './proyecto.entity';
import { ProyectoLugar } from './proyecto-lugar.entity';
import { ProyectoService } from './proyecto.service';
import { ProyectoLugarService } from './proyecto-lugar.service';
import { ProyectoAdminController, ProyectoPublicController } from './proyecto.controller';
import { ProyectoLugarController } from './proyecto-lugar.controller';
import { OrganizacionModule } from '../organizacion/organizacion.module';
import { AdjuntoModule } from '../adjunto/adjunto.module';
import { ExcelExportModule } from '../../common/excel/excel-export.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proyecto, ProyectoLugar]),
    OrganizacionModule,
    AdjuntoModule,
    ExcelExportModule,
  ],
  controllers: [ProyectoAdminController, ProyectoPublicController, ProyectoLugarController],
  providers: [ProyectoService, ProyectoLugarService],
  exports: [ProyectoService],
})
export class ProyectoModule {}

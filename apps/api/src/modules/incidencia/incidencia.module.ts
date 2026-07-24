import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incidencia } from './incidencia.entity';
import { IncidenciaHistoria } from './incidencia-historia.entity';
import { IncidenciaRespuesta } from './incidencia-respuesta.entity';
import { IncidenciaService } from './incidencia.service';
import { IncidenciaAdminController, IncidenciaPublicController } from './incidencia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Incidencia, IncidenciaHistoria, IncidenciaRespuesta])],
  controllers: [IncidenciaAdminController, IncidenciaPublicController],
  providers: [IncidenciaService],
  exports: [IncidenciaService],
})
export class IncidenciaModule {}

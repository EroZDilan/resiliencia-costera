import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from './evento.entity';
import { EventoService } from './evento.service';
import { EventoAdminController, EventoPublicController } from './evento.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Evento])],
  controllers: [EventoAdminController, EventoPublicController],
  providers: [EventoService],
  exports: [EventoService, TypeOrmModule],
})
export class EventoModule {}

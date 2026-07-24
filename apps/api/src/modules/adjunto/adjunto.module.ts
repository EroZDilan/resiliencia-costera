import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Adjunto } from './adjunto.entity';
import { AdjuntoService } from './adjunto.service';
import { AdjuntoController } from './adjunto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Adjunto])],
  controllers: [AdjuntoController],
  providers: [AdjuntoService],
  exports: [AdjuntoService, TypeOrmModule],
})
export class AdjuntoModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuracion } from './configuracion.entity';
import { ConfiguracionService } from './configuracion.service';
import { ConfiguracionAdminController, ConfiguracionPublicController } from './configuracion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Configuracion])],
  controllers: [ConfiguracionAdminController, ConfiguracionPublicController],
  providers: [ConfiguracionService],
  exports: [ConfiguracionService],
})
export class ConfiguracionModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizacion } from './organizacion.entity';
import { OrganizacionService } from './organizacion.service';
import {
  OrganizacionAdminController,
  OrganizacionPublicController,
} from './organizacion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organizacion])],
  controllers: [OrganizacionAdminController, OrganizacionPublicController],
  providers: [OrganizacionService],
  exports: [OrganizacionService, TypeOrmModule],
})
export class OrganizacionModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcoLegal } from './marco-legal.entity';
import { MarcoLegalService } from './marco-legal.service';
import { MarcoLegalAdminController, MarcoLegalPublicController } from './marco-legal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MarcoLegal])],
  controllers: [MarcoLegalAdminController, MarcoLegalPublicController],
  providers: [MarcoLegalService],
  exports: [MarcoLegalService, TypeOrmModule],
})
export class MarcoLegalModule {}

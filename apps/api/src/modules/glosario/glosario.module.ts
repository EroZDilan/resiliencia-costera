import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Glosario } from './glosario.entity';
import { GlosarioService } from './glosario.service';
import { GlosarioAdminController, GlosarioPublicController } from './glosario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Glosario])],
  controllers: [GlosarioAdminController, GlosarioPublicController],
  providers: [GlosarioService],
  exports: [GlosarioService, TypeOrmModule],
})
export class GlosarioModule {}

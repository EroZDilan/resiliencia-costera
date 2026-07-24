import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Editorial } from './editorial.entity';
import { EditorialService } from './editorial.service';
import { EditorialAdminController, EditorialPublicController } from './editorial.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Editorial])],
  controllers: [EditorialAdminController, EditorialPublicController],
  providers: [EditorialService],
  exports: [EditorialService, TypeOrmModule],
})
export class EditorialModule {}

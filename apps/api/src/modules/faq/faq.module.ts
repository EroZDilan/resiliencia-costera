import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from './faq.entity';
import { FaqService } from './faq.service';
import { FaqAdminController, FaqPublicController } from './faq.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Faq])],
  controllers: [FaqAdminController, FaqPublicController],
  providers: [FaqService],
  exports: [FaqService],
})
export class FaqModule {}

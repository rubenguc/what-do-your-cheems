import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramContributionService } from './telegram-contribution.service';
import {
  TelegramContribution,
  TelegramContributionSchema,
} from './telegram-contribution.entity';
import { TelegramContributionController } from './telegram-contribution.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TelegramContribution.name, schema: TelegramContributionSchema },
    ]),
  ],
  exports: [TelegramContributionService],
  providers: [TelegramContributionService],
  controllers: [TelegramContributionController],
})
export class TelegramContributionModule {}

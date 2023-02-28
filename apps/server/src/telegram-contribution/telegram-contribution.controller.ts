import { Controller, Get, Query } from '@nestjs/common';
import { TelegramContributionService } from './telegram-contribution.service';

@Controller('telegram-contribution')
export class TelegramContributionController {
  constructor(
    private readonly telegramContributionService: TelegramContributionService,
  ) {}

  @Get('/')
  public async getByUsername(@Query('username') username: string) {
    return await this.telegramContributionService.getByUsername(username);
  }
}

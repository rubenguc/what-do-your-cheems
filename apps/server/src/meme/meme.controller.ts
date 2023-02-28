import { Controller, Get } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { MemeService } from './meme.service';

@Controller('meme')
export class MemeController {
  constructor(
    private readonly memeService: MemeService,
    private readonly envService: EnvService
  ) {}

  @Get('/')
  public async getAll() {
    if (this.envService.NODE_ENV === 'development') {
      return this.memeService.get();
    }
    return {
      msg: 'Anda paya bobo',
    };
  }
}

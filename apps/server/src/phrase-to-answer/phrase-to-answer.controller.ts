import { Controller, Get } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { PhraseToAnswerService } from './phrase-to-answer.service';

@Controller('phrase-to-answer')
export class PhraseToAnswerController {
  constructor(
    private readonly phraseToAnswerService: PhraseToAnswerService,
    private readonly envService: EnvService
  ) {}

  @Get('/')
  public async getAll() {
    if (this.envService.NODE_ENV === 'development') {
      return this.phraseToAnswerService.get();
    }
    return {
      msg: 'Anda paya bobo',
    };
  }
}

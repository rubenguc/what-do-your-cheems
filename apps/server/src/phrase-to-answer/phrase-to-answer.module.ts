import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhraseToAnswerService } from './phrase-to-answer.service';
import {
  PhraseToAnswer,
  PhraseToAnswerSchema,
} from './phrase-to-answer.entity';
import { PhraseToAnswerController } from './phrase-to-answer.controller';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhraseToAnswer.name, schema: PhraseToAnswerSchema },
    ]),
    EnvModule,
  ],
  exports: [PhraseToAnswerService],
  providers: [PhraseToAnswerService],
  controllers: [PhraseToAnswerController],
})
export class PhraseToAnswerModule {}

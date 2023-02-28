import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { EnvModule } from './env/env.module';
import { EnvService } from './env/env.service';
import { GameModule } from './game/game.module';
import { MemeModule } from './meme/meme.module';
import { PhraseToAnswerModule } from './phrase-to-answer/phrase-to-answer.module';
import { PhraseToCompleteModule } from './phrase-to-complete/phrase-to-complete.module';
import { PendingToAproveModule } from './pending-to-aprove/pending-to-aprove.module';
import { UploadModule } from './upload/upload.module';
import { TelegramContributionModule } from './telegram-contribution/telegram-contribution.module';

@Module({
  imports: [
    EnvModule,
    LoggerModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (env: EnvService) => env.getPinoConfig(),
    }),
    MongooseModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (env: EnvService) => env.getDatabaseConfig(),
    }),
    SentryModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (env: EnvService) => ({
        dsn: env.SENTRY_DSN,
        debug: env.isDevelopment(),
        environment: env.NODE_ENV,
      }),
    }),
    GameModule,
    MemeModule,
    PhraseToAnswerModule,
    PhraseToCompleteModule,
    PendingToAproveModule,
    UploadModule,
    TelegramContributionModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new SentryInterceptor(),
    },
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvModule } from './env/env.module';
import { LoggerModule } from 'nestjs-pino';
import { EnvService } from './env/env.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SentryInterceptor, SentryModule } from '@travelerdev/nestjs-sentry';
import { APP_INTERCEPTOR } from '@nestjs/core';

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
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new SentryInterceptor(),
    },
  ],
})
export class AppModule {}

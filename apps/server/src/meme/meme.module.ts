import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Meme, MemeSchema } from './meme.entity';
import { MemeService } from './meme.service';
import { MemeController } from './meme.controller';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meme.name, schema: MemeSchema }]),
    EnvModule,
  ],
  exports: [MemeService],
  providers: [MemeService],
  controllers: [MemeController],
})
export class MemeModule {}

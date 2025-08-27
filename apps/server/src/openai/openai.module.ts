import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from 'src/config/config.module';

import { OpenaiService } from './openai.service';

@Module({
  imports: [ConfigModule],
  providers: [OpenaiService, ConfigService],
  exports: [OpenaiService],
})
export class OpenaiModule {}

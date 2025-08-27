import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from 'src/config/config.module';

import { WeaviateService } from './weaviate.service';

@Module({
  imports: [ConfigModule],
  providers: [WeaviateService, ConfigService],
  exports: [WeaviateService],
})
export class WeaviateModule {}

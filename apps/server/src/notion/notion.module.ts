import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from 'src/config/config.module';
import { MongooseModule } from 'src/mongoose/mongoose.module';
import { RedisModule } from 'src/redis/redis.module';
import { WeaviateModule } from 'src/weaviate/weaviate.module';

import { NotionService } from './notion.service';

@Module({
  imports: [MongooseModule, NotionModule, ConfigModule, RedisModule, WeaviateModule],
  providers: [NotionService, ConfigService],
  exports: [NotionService],
})
export class NotionModule {}

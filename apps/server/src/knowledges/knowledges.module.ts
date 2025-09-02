import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from 'src/config/config.module';
import { MongooseModule } from 'src/mongoose/mongoose.module';
import { NotionModule } from 'src/notion/notion.module';
import { RedisModule } from 'src/redis/redis.module';
import { WeaviateModule } from 'src/weaviate/weaviate.module';

import { KnowledgesController } from './knowledges.controller';
import { KnowledgesService } from './knowledges.service';

@Module({
  imports: [MongooseModule, NotionModule, RedisModule, WeaviateModule, ConfigModule],
  controllers: [KnowledgesController],
  providers: [KnowledgesService, ConfigService],
  exports: [KnowledgesService],
})
export class KnowledgesModule {}

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConversationsModule } from './conversations/conversations.module';
import { HealthModule } from './health/health.module';
import { KnowledgesModule } from './knowledges/knowledges.module';
import { MongooseModule } from './mongoose/mongoose.module';
import { NavigationModule } from './navigation/navigation.module';
import { NotionModule } from './notion/notion.module';
import { OpenaiModule } from './openai/openai.module';
import { RedisModule } from './redis/redis.module';
import { WeaviateModule } from './weaviate/weaviate.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TerminusModule,
    HttpModule,
    RedisModule,
    MongooseModule,
    WeaviateModule,
    NotionModule,
    OpenaiModule,
    NavigationModule,
    HealthModule,
    ConfigModule,
    KnowledgesModule,
    ConversationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

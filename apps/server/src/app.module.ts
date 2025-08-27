import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ChatHistoriesModule } from './chat-histories/chat-histories.module';
import { ConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';
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
    ChatModule,
    OpenaiModule,
    ChatHistoriesModule,
    NavigationModule,
    HealthModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { ChatHistoriesController } from './chat-histories/chat-histories.controller';
import { ChatHistoriesService } from './chat-histories/chat-histories.service';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { ChatHistory, ChatHistorySchema } from './mongoose/schemas/chat-history.schema';
import { NotionSyncHistory, NotionSyncHistorySchema } from './mongoose/schemas/notion-sync-history.schema';
import { NavigationController } from './navigation/navigation.controller';
import { NavigationService } from './navigation/navigation.service';
import { NotionController } from './notion/notion.controller';
import { NotionService } from './notion/notion.service';
import { OpenaiService } from './openai/openai.service';
import { WeaviateService } from './weaviate/weaviate.service';

let envFileName = '.env.development';

if (process.env.NODE_ENV === 'production') envFileName = '.env.production';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFileName,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_HOST),
    MongooseModule.forFeature([
      { schema: NotionSyncHistorySchema, name: NotionSyncHistory.name },
      { schema: ChatHistorySchema, name: ChatHistory.name },
    ]),
    TerminusModule,
    HttpModule,
  ],
  controllers: [
    AppController,
    NotionController,
    HealthController,
    ChatController,
    ChatHistoriesController,
    NavigationController,
  ],
  providers: [
    AppService,
    NotionService,
    HealthService,
    WeaviateService,
    ChatService,
    OpenaiService,
    ChatHistoriesService,
    NavigationService,
  ],
})
export class AppModule {}

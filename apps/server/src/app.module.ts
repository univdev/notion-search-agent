import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { NotionController } from './notion/notion.controller';
import { NotionService } from './notion/notion.service';
import { NotionSyncHistory, NotionSyncHistorySchema } from './mongoose/schemas/notion-sync-history.schema';
import { WeaviateService } from './weaviate/weaviate.service';

let envFileName = '.env.development';

if (process.env.NODE_ENV === 'production') envFileName = '.env.production';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFileName,
    }),
    MongooseModule.forRoot(process.env.MONGODB_HOST),
    MongooseModule.forFeature([{ schema: NotionSyncHistorySchema, name: NotionSyncHistory.name }]),
    TerminusModule,
    HttpModule,
  ],
  controllers: [AppController, NotionController, HealthController],
  providers: [AppService, NotionService, HealthService, WeaviateService],
})
export class AppModule {}

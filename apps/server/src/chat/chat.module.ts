import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from 'src/config/config.module';
import { MongooseModule } from 'src/mongoose/mongoose.module';
import { NotionModule } from 'src/notion/notion.module';
import { OpenaiModule } from 'src/openai/openai.module';
import { WeaviateModule } from 'src/weaviate/weaviate.module';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [MongooseModule, NotionModule, ConfigModule, OpenaiModule, WeaviateModule],
  controllers: [ChatController],
  providers: [ChatService, ConfigService],
})
export class ChatModule {}

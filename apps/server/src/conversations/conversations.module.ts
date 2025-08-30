import { Module } from '@nestjs/common';
import { MongooseModule } from 'src/mongoose/mongoose.module';
import { NotionModule } from 'src/notion/notion.module';
import { OpenaiModule } from 'src/openai/openai.module';
import { WeaviateModule } from 'src/weaviate/weaviate.module';

import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';

@Module({
  imports: [MongooseModule, NotionModule, WeaviateModule, OpenaiModule],
  controllers: [ConversationsController],
  providers: [ConversationsService],
})
export class ConversationsModule {}

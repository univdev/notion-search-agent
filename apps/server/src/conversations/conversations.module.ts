import { Module } from '@nestjs/common';
import { KnowledgesModule } from 'src/knowledges/knowledges.module';
import { MongooseModule } from 'src/mongoose/mongoose.module';
import { NotionModule } from 'src/notion/notion.module';
import { OpenaiModule } from 'src/openai/openai.module';
import { WeaviateModule } from 'src/weaviate/weaviate.module';

import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';

@Module({
  imports: [MongooseModule, NotionModule, WeaviateModule, OpenaiModule, KnowledgesModule],
  controllers: [ConversationsController],
  providers: [ConversationsService],
})
export class ConversationsModule {}

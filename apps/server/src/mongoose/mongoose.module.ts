import { Module } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';

import { Conversation, ConversationSchema } from './schemas/converstation.schema';
import { NotionSyncHistory, NotionSyncHistorySchema } from './schemas/notion-sync-history.schema';

@Module({
  imports: [
    NestMongooseModule.forRoot(process.env.MONGODB_HOST),
    NestMongooseModule.forFeature([
      { schema: NotionSyncHistorySchema, name: NotionSyncHistory.name },
      { schema: ConversationSchema, name: Conversation.name },
    ]),
  ],
  exports: [NestMongooseModule],
})
export class MongooseModule {}

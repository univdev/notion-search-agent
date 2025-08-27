import { Module } from '@nestjs/common';
import { MongooseModule } from 'src/mongoose/mongoose.module';

import { ChatHistoriesController } from './chat-histories.controller';
import { ChatHistoriesService } from './chat-histories.service';

@Module({
  imports: [MongooseModule],
  controllers: [ChatHistoriesController],
  providers: [ChatHistoriesService],
})
export class ChatHistoriesModule {}

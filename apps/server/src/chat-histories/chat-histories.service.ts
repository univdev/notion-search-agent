import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatHistory } from 'src/mongoose/schemas/chat-history.schema';

import { GetChatHistoriesPayload } from './chat-histories.type';

@Injectable()
export class ChatHistoriesService {
  constructor(
    @InjectModel(ChatHistory.name)
    private readonly chatHistoryModel: Model<ChatHistory>,
  ) {}

  async getChatHistories(payload: GetChatHistoriesPayload) {
    return this.chatHistoryModel.find().skip(payload.offset).limit(payload.limit).sort({ createdAt: -1 });
  }
}

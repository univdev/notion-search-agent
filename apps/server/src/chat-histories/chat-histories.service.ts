import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ChatHistory } from 'src/mongoose/schemas/chat-history.schema';

import { GetChatHistoriesPayload } from './chat-histories.type';

@Injectable()
export class ChatHistoriesService {
  constructor(
    @InjectModel(ChatHistory.name)
    private readonly chatHistoryModel: Model<ChatHistory>,
  ) {}

  async getChatHistories(payload: GetChatHistoriesPayload) {
    return await this.chatHistoryModel.find().skip(payload.offset).limit(payload.limit).sort({ createdAt: -1 });
  }

  async getChatHistoryById(id: string) {
    return this.chatHistoryModel
      .findById(id)
      .select('_id summary messages createdAt updatedAt')
      .catch((error) => {
        if (error instanceof mongoose.Error) {
          const isNotFoundError = error.message.includes('Cast to ObjectId failed');

          if (isNotFoundError) throw new NotFoundException('Chat history not found');
          else throw new InternalServerErrorException('Internal server error');
        }
      });
  }
}

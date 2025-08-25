import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatHistory } from 'src/mongoose/schemas/chat-history.schema';

@Injectable()
export class NavigationService {
  constructor(
    @InjectModel(ChatHistory.name)
    private readonly chatHistoryModel: Model<ChatHistory>,
  ) {}

  async getChatHistories() {
    return this.chatHistoryModel.find().select('_id summary').sort({ createdAt: -1 });
  }
}

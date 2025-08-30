import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from 'src/mongoose/schemas/converstation.schema';

@Injectable()
export class NavigationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationsModel: Model<Conversation>,
  ) {}

  async getConversations() {
    return this.conversationsModel.find().select('_id summary').sort({ createdAt: 'desc' });
  }
}

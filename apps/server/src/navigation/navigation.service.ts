import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from 'src/mongoose/schemas/converstation.schema';

import { GetConversationsParams } from './navigation.type';

@Injectable()
export class NavigationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationsModel: Model<Conversation>,
  ) {}

  async getConversations(params: GetConversationsParams) {
    const items = await this.conversationsModel
      .find()
      .select('_id summary')
      .sort({ createdAt: 'desc' })
      .skip(params.offset)
      .limit(params.limit);

    return items;
  }
}

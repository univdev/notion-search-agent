import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export enum ChatHistoryMessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

@Schema({
  collection: 'chat-history',
  timestamps: true,
})
export class ChatHistory {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ requred: true })
  summary: string;

  @Prop({ required: true })
  messages: {
    role: ChatHistoryMessageRole;
    content: string;
    createdAt: Date;
  }[];

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export enum ConversationMessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

@Schema({
  collection: 'converstation',
  timestamps: true,
})
export class Conversation {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ requred: true })
  summary: string;

  @Prop({ required: true })
  messages: {
    role: ConversationMessageRole;
    content: string;
    senderIp?: string;
    createdAt: Date;
  }[];

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export enum NotionSyncHistoryStatus {
  SYNCING = 'SYNCING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Schema({
  collection: 'notion-sync-history',
  timestamps: true,
})
export class NotionSyncHistory {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true })
  status: NotionSyncHistoryStatus;

  @Prop({ required: true })
  ip: string;

  @Prop({ default: new Date() })
  startedAt: Date;

  @Prop()
  completedAt: Date;

  @Prop()
  failedAt: Date;

  @Prop({ default: 0 })
  succeedPages: number;

  @Prop({ default: 0 })
  failedPages: number;

  @Prop({ default: 0 })
  totalPages: number;

  @Prop({ default: 0 })
  usedTokens: number;

  @Prop()
  errorReason: string;
}

export const NotionSyncHistorySchema = SchemaFactory.createForClass(NotionSyncHistory);

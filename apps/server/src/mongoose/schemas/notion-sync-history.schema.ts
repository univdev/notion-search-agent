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

  @Prop({ required: true })
  status: NotionSyncHistoryStatus;

  @Prop({ required: true })
  ip: string;

  @Prop({ default: 0 })
  totalPages: number;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;
}

export const NotionSyncHistorySchema = SchemaFactory.createForClass(NotionSyncHistory);

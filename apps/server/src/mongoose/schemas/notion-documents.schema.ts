import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({
  collection: 'notion-documents',
  timestamps: true,
})
export class NotionDocument {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  historyId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  documentCreatedAt: Date;

  @Prop({ required: true })
  documentUpdatedAt: Date;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({})
  updatedAt: Date;
}

export const NotionDocumentSchema = SchemaFactory.createForClass(NotionDocument);

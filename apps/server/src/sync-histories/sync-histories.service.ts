import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotionDocument } from 'src/mongoose/schemas/notion-documents.schema';
import { NotionSyncHistory } from 'src/mongoose/schemas/notion-sync-history.schema';

import { GetNotionSyncHistoriesPayload } from './sync-histories.types';

@Injectable()
export class SyncHistoriesService {
  constructor(
    @InjectModel(NotionSyncHistory.name) private readonly notionSyncHistoryModel: Model<NotionSyncHistory>,
    @InjectModel(NotionDocument.name) private readonly notionDocumentModel: Model<NotionDocument>,
  ) {}

  async getNotionSyncHistories(payload: GetNotionSyncHistoriesPayload) {
    const { offset = 0, limit = 10 } = payload;
    const histories = await this.notionSyncHistoryModel.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: offset },
      { $limit: limit },
      { $lookup: { from: 'notion-documents', localField: '_id', foreignField: 'historyId', as: 'documents' } },
    ]);

    return histories;
  }
}

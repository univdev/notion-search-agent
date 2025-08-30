import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Client, ListBlockChildrenResponse } from '@notionhq/client';
import { Model } from 'mongoose';
import { HttpExceptionData } from 'src/http-exception/http-exception-data';
import { NotionSyncHistory, NotionSyncHistoryStatus } from 'src/mongoose/schemas/notion-sync-history.schema';

import { GetNotionSyncHistoriesPayload, Sentence } from './notion.type';

@Injectable()
export class NotionService {
  private readonly notion: Client;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(NotionSyncHistory.name)
    private readonly notionInitializeHistoryModel: Model<NotionSyncHistory>,
  ) {
    try {
      this.notion = new Client({
        auth: this.configService.get('NOTION_TOKEN'),
      });
    } catch {
      throw new InternalServerErrorException(new HttpExceptionData('sync-notion-documents.failed-connect-notion'));
    }
  }

  getClient() {
    return this.notion;
  }

  async getNotionSyncHistories(payload: GetNotionSyncHistoriesPayload) {
    const { offset, limit } = payload;
    const notionSyncHistories = await this.notionInitializeHistoryModel.find().skip(offset).limit(limit);
    return {
      data: notionSyncHistories,
      pagination: {
        offset,
        limit,
        loadedCount: notionSyncHistories.length,
      },
    };
  }

  async getLastCompletedNotionSyncHistory() {
    const lastCompletedNotionSyncHistory = await this.notionInitializeHistoryModel
      .findOne({
        status: NotionSyncHistoryStatus.COMPLETED,
      })
      .sort({ createdAt: 'desc' });

    return {
      data: lastCompletedNotionSyncHistory,
    };
  }

  async getSentences(blocks: ListBlockChildrenResponse): Promise<Sentence[]> {
    const validTypes = [
      'paragraph',
      'heading_1',
      'heading_2',
      'heading_3',
      'bulleted_list_item',
      'child_page',
      'code',
      'quote',
      'toggle',
    ] as const;
    const sentences: Sentence[] = [];

    for (const result of blocks.results) {
      const typeIndex = validTypes.findIndex((type) => type in result);
      const type = validTypes[typeIndex];

      if (type in result && result[type]?.rich_text?.length > 0) {
        let language: string = undefined;

        if ('language' in result[type]) language = result[type].language;

        sentences.push({
          blockId: result.id,
          value: result[type].rich_text.map((text) => text.plain_text).join(''),
          type,
          language,
        });
      }

      if ('has_children' in result && result.has_children) {
        const blockId = result.id;
        this.getPageBlocks(blockId).then(async (children) => {
          sentences.push(...(await this.getSentences(children)));
        });
      }
    }

    sentences.filter(Boolean);

    return sentences;
  }

  async getPageMetadata(pageId: string) {
    const page = await this.notion.pages.retrieve({
      page_id: pageId,
    });

    return page;
  }

  async getPageBlocks(pageId: string) {
    const blocks = await this.notion.blocks.children.list({
      block_id: pageId,
    });

    return blocks;
  }
}

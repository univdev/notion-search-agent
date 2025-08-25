import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Client, ListBlockChildrenResponse } from '@notionhq/client';
import { Model } from 'mongoose';
import { CONFIGS } from 'src/configs/configs';
import { NotionSyncHistory, NotionSyncHistoryStatus } from 'src/mongoose/schemas/notion-sync-history.schema';
import { WeaviateService } from 'src/weaviate/weaviate.service';

import { GetNotionSyncHistoriesPayload, PatchNotionSyncPayload, Sentence } from './notion.type';

@Injectable()
export class NotionService {
  private readonly notion: Client;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(NotionSyncHistory.name)
    private readonly notionInitializeHistoryModel: Model<NotionSyncHistory>,
    private readonly vectorStore: WeaviateService,
  ) {
    try {
      this.notion = new Client({
        auth: this.configService.get('NOTION_TOKEN'),
      });
    } catch {
      throw new Error('Failed to initialize Notion client');
    }
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

  // 10분 간격으로 SYNCING 상태에 머무르는 동기화 데이터 제거
  @Cron('* */10 * * * *')
  async deleteSyncingNotionSyncHistory() {
    await this.notionInitializeHistoryModel.deleteMany({
      status: NotionSyncHistoryStatus.SYNCING,
      // 생성 후 일정 시간동안 SYNCING 상태에 머무르는 데이터 제거
      createdAt: {
        $lt: new Date(Date.now() - CONFIGS.NOTION_SENTENCES.SYNC_DATA_MAX_LIFETIME),
      },
    });

    return true;
  }

  async sync(payload: PatchNotionSyncPayload) {
    try {
      const lastNotionSyncHistory = await this.notionInitializeHistoryModel
        .findOne({
          status: NotionSyncHistoryStatus.COMPLETED,
        })
        .sort({ createdAt: -1 });

      if (
        lastNotionSyncHistory &&
        Date.now() - lastNotionSyncHistory.createdAt.getTime() < CONFIGS.NOTION_SENTENCES.SYNC_MAX_WAIT_TIME
      ) {
        throw new BadRequestException('Already synced within 2 minutes');
      }

      await this.deleteAllSentenceFromVectorStore();

      console.log('deleteAllSentenceFromVectorStore');

      const notionSyncHistoryModel = await this.notionInitializeHistoryModel.create({
        ip: payload.ip,
        status: NotionSyncHistoryStatus.SYNCING,
      });

      const newNotionSyncHistory = await notionSyncHistoryModel.save();

      try {
        const startNotionPageId = this.configService.get('NOTION_PAGE_ID');

        const blocks = await this.getPageBlocks(startNotionPageId);
        const sentences = await this.getSentences(blocks);

        await this.insertSentenceToVectorStore(sentences);

        await this.notionInitializeHistoryModel.updateOne(
          { _id: newNotionSyncHistory._id },
          { status: NotionSyncHistoryStatus.COMPLETED },
        );

        return sentences;
      } catch (error) {
        await this.notionInitializeHistoryModel.updateOne(
          { _id: newNotionSyncHistory._id },
          { status: NotionSyncHistoryStatus.FAILED },
        );

        if (error instanceof HttpException) throw error;
        throw new InternalServerErrorException(error);
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(error);
    }
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

  async insertSentenceToVectorStore(sentences: Sentence[]) {
    try {
      const store = this.vectorStore.getInstance();
      const collection = await store.collections.use(CONFIGS.WEAVIATE.COLLECTIONS.SENTENCES);
      await collection.data.insertMany(sentences);

      return true;
    } catch {
      throw new InternalServerErrorException('Failed to insert sentences to vector store');
    }
  }

  async deleteAllSentenceFromVectorStore() {
    try {
      const store = this.vectorStore.getInstance();
      const collection = await store.collections.use(CONFIGS.WEAVIATE.COLLECTIONS.SENTENCES);
      await collection.data.deleteMany(collection.filter.byProperty('blockId').like('*'));

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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

  async getSentencesByQuestion(question: string) {
    const store = this.vectorStore.getInstance();
    const collection = await store.collections.use(CONFIGS.WEAVIATE.COLLECTIONS.SENTENCES);

    return collection.query.nearText(question, {
      limit: CONFIGS.NOTION_SENTENCES.SEARCH_LIMIT,
      returnMetadata: ['distance'],
    });
  }
}

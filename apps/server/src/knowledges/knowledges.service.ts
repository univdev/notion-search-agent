import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Config } from 'src/config/config';
import { HttpExceptionData } from 'src/http-exception/http-exception-data';
import { NotionSyncHistory, NotionSyncHistoryStatus } from 'src/mongoose/schemas/notion-sync-history.schema';
import { NotionService } from 'src/notion/notion.service';
import { PatchNotionSyncPayload } from 'src/notion/notion.type';
import { RedisService } from 'src/redis/redis.service';
import { WeaviateService } from 'src/weaviate/weaviate.service';

import { Sentence } from './knowledges.type';

@Injectable()
export class KnowledgesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly notionService: NotionService,
    private readonly weaviateService: WeaviateService,
    @InjectModel(NotionSyncHistory.name) private readonly notionInitializeHistoryModel: Model<NotionSyncHistory>,
    private readonly redisService: RedisService,
  ) {}

  @Cron('* */10 * * * *')
  async deleteSyncingNotionSyncHistory() {
    await this.notionInitializeHistoryModel.deleteMany({
      status: NotionSyncHistoryStatus.SYNCING,
      // 생성 후 일정 시간동안 SYNCING 상태에 머무르는 데이터 제거
      createdAt: {
        $lt: new Date(Date.now() - Config.NOTION_SENTENCES.SYNC_DATA_MAX_LIFETIME),
      },
    });

    return true;
  }

  async syncNotionDocuments(payload: PatchNotionSyncPayload) {
    const REDIS_KEY = 'notion-syncing';

    try {
      const isSyncing = await this.redisService.get(REDIS_KEY);

      if (isSyncing) throw new BadRequestException(new HttpExceptionData('sync-notion-documents.already-syncing'));

      await this.redisService.set(REDIS_KEY, 'true', 60 * 10);
      const lastNotionSyncHistory = await this.notionInitializeHistoryModel
        .findOne({
          status: NotionSyncHistoryStatus.COMPLETED,
        })
        .sort({ createdAt: -1 });

      if (
        lastNotionSyncHistory &&
        Date.now() - lastNotionSyncHistory.createdAt.getTime() < Config.NOTION_SENTENCES.SYNC_MAX_WAIT_TIME
      ) {
        throw new BadRequestException(
          new HttpExceptionData('sync-notion-documents.already-synced', {
            cooldown: Config.NOTION_SENTENCES.SYNC_MAX_WAIT_TIME,
          }),
        );
      }

      await this.deleteAllSentenceFromVectorStore();

      const notionSyncHistoryModel = await this.notionInitializeHistoryModel.create({
        ip: payload.ip,
        status: NotionSyncHistoryStatus.SYNCING,
      });

      const newNotionSyncHistory = await notionSyncHistoryModel.save();

      try {
        const startNotionPageId = this.configService.get('NOTION_PAGE_ID');

        const blocks = await this.notionService.getPageBlocks(startNotionPageId);
        const sentences = await this.notionService.getSentences(blocks);

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
        throw new InternalServerErrorException(new HttpExceptionData('sync-notion-documents.unknown-error'));
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(new HttpExceptionData('sync-notion-documents.unknown-error'));
    } finally {
      await this.redisService.del(REDIS_KEY);
    }
  }

  async insertSentenceToVectorStore(sentences: Sentence[]) {
    try {
      const store = this.weaviateService.getInstance();
      const collection = await store.collections.use(Config.WEAVIATE.COLLECTIONS.SENTENCES);
      await collection.data.insertMany(sentences);

      return true;
    } catch {
      throw new InternalServerErrorException(new HttpExceptionData('sync-notion-documents.failed-save-sentences'));
    }
  }

  async deleteAllSentenceFromVectorStore() {
    try {
      const store = this.weaviateService.getInstance();
      const collection = await store.collections.use(Config.WEAVIATE.COLLECTIONS.SENTENCES);
      await collection.data.deleteMany(collection.filter.byProperty('blockId').like('*'));

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

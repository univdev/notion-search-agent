import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { HttpExceptionData } from 'src/http-exception/http-exception-data';
import { NotionSyncHistory, NotionSyncHistoryStatus } from 'src/mongoose/schemas/notion-sync-history.schema';
import { NotionService } from 'src/notion/notion.service';
import { RedisService } from 'src/redis/redis.service';
import { WeaviateService } from 'src/weaviate/weaviate.service';
import { vectors } from 'weaviate-client';

@Injectable()
export class KnowledgesService {
  private readonly NOTION_DOCUMENT_COLLECTION_NAME = 'NotionDocuments';
  private readonly EMBEDDING_MODEL = 'text-embedding-3-small';
  private readonly EMBEDDING_DIMENSIONS = 1536;

  private readonly SYNC_DATA_MAX_LIFETIME = 1000 * 60 * 60;

  private readonly REDIS_SCHEDULE_KEY = 'knowledges:sync-notion-documents';

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
        $lt: new Date(Date.now() - this.SYNC_DATA_MAX_LIFETIME),
      },
    });

    return true;
  }

  async createNotionDocumentCollection() {
    const client = this.weaviateService.getInstance();

    return client.collections.create({
      name: this.NOTION_DOCUMENT_COLLECTION_NAME,
      properties: [
        { name: 'pageId', dataType: 'text' },
        { name: 'title', dataType: 'text' },
        { name: 'content', dataType: 'text' },
        { name: 'documentUrl', dataType: 'text' },
        { name: 'createdAt', dataType: 'date' },
        { name: 'updatedAt', dataType: 'date' },
      ],
      vectorizers: vectors.text2VecOpenAI({
        model: this.EMBEDDING_MODEL,
        dimensions: this.EMBEDDING_DIMENSIONS,
      }),
    });
  }

  async hasNotionDocumentCollection() {
    return this.weaviateService.getInstance().collections.exists(this.NOTION_DOCUMENT_COLLECTION_NAME);
  }

  async deleteNotionDocumentCollection() {
    return this.weaviateService.getInstance().collections.delete(this.NOTION_DOCUMENT_COLLECTION_NAME);
  }

  async getNotionDocumentCollection() {
    return this.weaviateService.getInstance().collections.use(this.NOTION_DOCUMENT_COLLECTION_NAME);
  }

  async syncNotionDocuments(senderIp: string) {
    try {
      const isExistCollection = await this.hasNotionDocumentCollection();
      if (isExistCollection === false) await this.createNotionDocumentCollection();
      else {
        await this.deleteNotionDocumentCollection();
        await this.createNotionDocumentCollection();
      }

      const isSyncing = await this.redisService.get(this.REDIS_SCHEDULE_KEY);
      if (isSyncing === 'true')
        throw new BadRequestException(new HttpExceptionData('sync-notion-documents.already-syncing'));

      await this.redisService.set(this.REDIS_SCHEDULE_KEY, 'true', 1000 * 60 * 10);

      const collection = await this.getNotionDocumentCollection();
      const documents = await this.notionService.getAllNotionDocuments(this.configService.get('NOTION_PAGE_ID'));
      const data = [];

      for (const key of documents.keys()) {
        const document = documents.get(key);

        data.push({
          pageId: key,
          title: document.title,
          content: document.content,
          documentUrl: document.documentUrl,
          createdAt: new Date(document.createdAt),
          updatedAt: new Date(document.updatedAt),
        });
      }

      await collection.data.insertMany(data);
      await this.redisService.del(this.REDIS_SCHEDULE_KEY);

      await this.notionInitializeHistoryModel.create({
        status: NotionSyncHistoryStatus.COMPLETED,
        ip: senderIp,
        totalPages: data.length,
        completedAt: new Date(),
      });

      return true;
    } catch (error) {
      await this.deleteNotionDocumentCollection();
      await this.notionInitializeHistoryModel.create({
        status: NotionSyncHistoryStatus.FAILED,
        ip: senderIp,
        totalPages: 0,
        failedAt: new Date(),
      });

      throw error;
    }
  }
}

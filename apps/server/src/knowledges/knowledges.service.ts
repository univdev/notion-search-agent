import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Response } from 'express';
import { Model } from 'mongoose';
import { NotionDocument } from 'src/mongoose/schemas/notion-documents.schema';
import { NotionSyncHistory, NotionSyncHistoryStatus } from 'src/mongoose/schemas/notion-sync-history.schema';
import { NotionService } from 'src/notion/notion.service';
import { NotionDocumentGeneratorResponse } from 'src/notion/notion.type';
import { RedisService } from 'src/redis/redis.service';
import streamFactory from 'src/stream/factory/StreamFactory';
import { WeaviateService } from 'src/weaviate/weaviate.service';
import { vectors } from 'weaviate-client';

import { AddNotionDocumentPayload, ExportedNotionDocument } from './knowledges.types';

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
    @InjectModel(NotionDocument.name) private readonly notionDocumentModel: Model<NotionDocument>,
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

  async addScheduleSyncNotionDocuments() {
    return this.redisService.set(this.REDIS_SCHEDULE_KEY, 'true', 1000 * 60 * 10);
  }

  async hasScheduleSyncNotionDocuments() {
    return this.redisService.get(this.REDIS_SCHEDULE_KEY);
  }

  async removeScheduleSyncNotionDocuments() {
    return this.redisService.del(this.REDIS_SCHEDULE_KEY);
  }

  async checkSyncNotionDocumentsSchedule() {
    const isSyncing = (await this.hasScheduleSyncNotionDocuments()) === 'true';
    if (isSyncing) {
      throw new Error('already-syncing');
    } else {
      await this.addScheduleSyncNotionDocuments();
    }
  }

  async clearNotionCollection() {
    const isExistCollection = await this.hasNotionDocumentCollection();

    if (isExistCollection === false) {
      return await this.createNotionDocumentCollection();
    } else {
      await this.deleteNotionDocumentCollection();
      return await this.createNotionDocumentCollection();
    }
  }

  async getNotionDocumentCollection() {
    const isExistCollection = await this.hasNotionDocumentCollection();

    if (isExistCollection === false) {
      throw new Error('not-exist-collection');
    } else {
      return await this.weaviateService.getInstance().collections.get(this.NOTION_DOCUMENT_COLLECTION_NAME);
    }
  }

  async syncNotionDocuments(response: Response, senderIp: string) {
    response.setHeader('Content-Type', 'text/event-stream');

    let createdHistoryId: string | null = null;

    try {
      // 현재 실행 되고 있는 스케줄이 있는지 확인하고 없으면 생성합니다.
      // 있으면 에러를 발생시킵니다.
      await this.checkSyncNotionDocumentsSchedule();

      const createdHistory = await this.notionInitializeHistoryModel.create({
        status: NotionSyncHistoryStatus.SYNCING,
        ip: senderIp,
        createdAt: new Date(),
      });
      createdHistoryId = createdHistory._id.toString();

      const notionDocumentsGenerator = await this.notionService.notionDocumentGenerator(
        this.configService.get('NOTION_PAGE_ID'),
      );
      const notionDocuments: Map<string, ExportedNotionDocument> = new Map();
      let notionDocumentsGeneratorResult = await notionDocumentsGenerator.next();

      let completedPageCount = 0;
      let errorPageCount = 0;

      response.write(
        streamFactory('data', {
          completedPageCount,
          errorPageCount,
          ok: false,
        }),
      );

      while (!notionDocumentsGeneratorResult.done) {
        const result = notionDocumentsGeneratorResult.value as NotionDocumentGeneratorResponse;

        if (result.status?.success === false) {
          errorPageCount += 1;

          response.write(
            streamFactory('data', {
              completedPageCount,
              errorPageCount,
              ok: false,
            }),
          );
        } else if (result.result) {
          const { blockId, pageId, pageTitle, content, documentUrl, createdAt, updatedAt } = result.result;
          const previousContent = notionDocuments.get(pageId)?.content ?? '';
          const newContent = `${previousContent}\n${content}`;
          const isExistDocument = notionDocuments.has(pageId);
          const isExistRequireFields = Boolean(pageId && pageTitle && documentUrl && createdAt && updatedAt);

          if (isExistRequireFields === false) {
            if (isExistDocument === false) errorPageCount += 1;

            response.write(
              streamFactory('data', {
                errorPageCount,
                errorItem: {
                  pageId: pageId ?? '',
                  blockId: blockId ?? '',
                  content: content ?? '',
                  createdAt: createdAt ?? '',
                  updatedAt: updatedAt ?? '',
                },
                ok: false,
              }),
            );

            notionDocumentsGeneratorResult = await notionDocumentsGenerator.next();
            continue;
          }

          if (isExistDocument === false) {
            completedPageCount += 1;

            response.write(
              streamFactory('data', {
                completedPageCount,
                errorPageCount,
                ok: false,
              }),
            );
          }

          notionDocuments.set(pageId, {
            pageId,
            title: pageTitle,
            content: newContent,
            documentUrl,
            createdAt,
            updatedAt,
          });
        }

        notionDocumentsGeneratorResult = await notionDocumentsGenerator.next();
      }

      await Promise.all([
        this.insertNotionDocumentsToVectorStore(Array.from(notionDocuments.values())),
        this.insertNotionDocumentsToMongoDB(createdHistoryId, Array.from(notionDocuments.values())),
      ]);

      await this.notionInitializeHistoryModel.updateOne(
        { _id: createdHistoryId },
        { status: NotionSyncHistoryStatus.COMPLETED, totalPages: notionDocuments.size },
      );

      response.write(
        streamFactory('data', {
          completedPageCount,
          errorPageCount,
          ok: true,
        }),
      );

      response.end();
    } catch (error) {
      if (createdHistoryId) {
        await this.notionInitializeHistoryModel.updateOne(
          { _id: createdHistoryId },
          { status: NotionSyncHistoryStatus.FAILED },
        );
      }

      await this.deleteNotionDocumentCollection();

      if (error instanceof Error) response.write(streamFactory('data', { error: error.message }));
      else response.write(streamFactory('data', { error: 'unknown-error' }));
      response.end();
    } finally {
      await this.removeScheduleSyncNotionDocuments();
    }
  }

  async insertNotionDocumentsToVectorStore(documents: ExportedNotionDocument[]) {
    try {
      const collection = await this.clearNotionCollection();
      const allNotionDocuments: ExportedNotionDocument[] = Array.from(documents.values()).map((document) => {
        return {
          title: document.title,
          content: document.content,
          documentUrl: document.documentUrl,
          createdAt: document.createdAt,
          updatedAt: document.updatedAt,
          pageId: document.pageId,
        };
      });
      await collection.data.insertMany(allNotionDocuments);
    } catch (error) {
      console.error('failed-to-insert-vector-store', error);
      throw new Error('failed-to-insert-vector-store');
    }
  }

  async insertNotionDocumentsToMongoDB(historyId: string, documents: ExportedNotionDocument[]) {
    try {
      const validDocuments = documents.map((document) => {
        return {
          content: document.content || '', // 빈 문자열로 기본값 설정
          title: document.title,
          url: document.documentUrl,
          documentCreatedAt: document.createdAt,
          documentUpdatedAt: document.updatedAt,
          historyId,
        };
      });

      await this.notionDocumentModel.insertMany(validDocuments);
    } catch (error) {
      console.error('failed-to-insert-mongodb', error);
      throw new Error('failed-to-insert-mongodb');
    }
  }

  async addNotionDocument(payload: AddNotionDocumentPayload) {
    return this.notionDocumentModel.create({
      title: payload.title,
      content: payload.content,
      url: payload.url,
      documentCreatedAt: payload.createdAt,
      documentUpdatedAt: payload.updatedAt,
      historyId: payload.historyId,
    });
  }
}

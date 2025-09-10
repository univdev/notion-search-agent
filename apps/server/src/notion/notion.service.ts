import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { BlockObjectResponse, Client, ListBlockChildrenResponse } from '@notionhq/client';
import { ImageBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { Model } from 'mongoose';
import { HttpExceptionData } from 'src/http-exception/http-exception-data';
import { NotionSyncHistory, NotionSyncHistoryStatus } from 'src/mongoose/schemas/notion-sync-history.schema';

import {
  GetNotionSyncHistoriesPayload,
  NotionMetadata,
  RichTextAnnotation,
  SearchedNotionDocument,
} from './notion.type';

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

  async getNotionDocument(blockId: string) {
    return this.notion.blocks.children.list({
      block_id: blockId,
    });
  }

  async getNotionMetadata(pageId: string): Promise<NotionMetadata> {
    return this.notion.pages.retrieve({
      page_id: pageId,
    }) as unknown as NotionMetadata;
  }

  async getAllNotionDocuments(
    blockId: string,
    parentPageId?: string,
    previousResult = new Map<string, SearchedNotionDocument>(),
    depth: number = 0,
  ) {
    const pageId = parentPageId || blockId;
    const result: Map<string, SearchedNotionDocument> = previousResult;

    let document: ListBlockChildrenResponse;
    let metadata: NotionMetadata;

    try {
      document = await this.getNotionDocument(blockId);
      metadata = await this.getNotionMetadata(pageId);
    } catch {
      return result;
    }
    const contentPropertyKeys = [
      'heading_1',
      'heading_2',
      'heading_3',
      'paragraph',
      'bulleted_list_item',
      'numbered_list_item',
      'callout',
      'quote',
      'code',
      'image',
    ];

    const nextPagePropertyKeys = ['child_page'];
    const pageTitle = metadata.properties.title.title.map((o) => o.plain_text).join('');
    const pageCreatedAt = metadata.created_time;
    const pageUpdatedAt = metadata.last_edited_time;
    const pageDocumentUrl = metadata.url;

    for (let i = 0; i < document.results.length; i += 1) {
      const block = document.results[i] as BlockObjectResponse;
      if (result.has(pageId) === false)
        result.set(pageId, {
          title: pageTitle,
          content: '',
          createdAt: pageCreatedAt,
          updatedAt: pageUpdatedAt,
          documentUrl: pageDocumentUrl,
        });

      const blockType = block.type;
      const hasChildren = 'has_children' in block ? block['has_children'] : false;

      if (nextPagePropertyKeys.includes(blockType)) {
        const nextPageId = block.id;
        await this.getAllNotionDocuments(block.id, nextPageId, result, depth + 1);
      }

      for (const contentPropertyKey of contentPropertyKeys) {
        if (contentPropertyKey in block) {
          const richText = block[contentPropertyKey].rich_text ?? [];

          if (blockType === 'image') {
            const imageBlock = block as ImageBlockObjectResponse;
            if (imageBlock.image.type === 'file') {
              const url = imageBlock.image.file.url;
              const markdownImage = this.factoryNotionContent(blockType, url, depth);

              result.set(pageId, {
                ...result.get(pageId),
                content: `${result.get(pageId).content}${markdownImage}\n`,
              });
            }
          } else if (Array.isArray(richText)) {
            const longText = [];

            for (const richTextItem of richText) {
              const plainText = richTextItem?.plain_text;
              const annotation = richTextItem?.annotations as RichTextAnnotation;
              const formattedText = this.factoryTextAnnotation(annotation, plainText);

              longText.push(formattedText);
            }

            const formattedLongText = this.factoryNotionContent(blockType, longText.join(''), depth);

            result.set(pageId, {
              ...result.get(pageId),
              content: `${result.get(pageId).content}${formattedLongText}\n`,
            });
          }

          if (hasChildren) await this.getAllNotionDocuments(block.id, pageId, result, depth + 1);
        }
      }
    }

    return result;
  }

  factoryNotionContent(type: BlockObjectResponse['type'], content: string, depth: number = 0) {
    const prefix = ' '.repeat(depth * 2);

    switch (type) {
      case 'heading_1':
        return `${prefix}# ${content}`;
      case 'heading_2':
        return `${prefix}## ${content}`;
      case 'heading_3':
        return `${prefix}### ${content}`;
      case 'paragraph':
        return `${prefix}${content}`;
      case 'bulleted_list_item':
        return `${prefix}- ${content}`;
      case 'numbered_list_item':
        return `${prefix}- ${content}`;
      case 'callout':
        return `${prefix}> ${content}`;
      case 'quote':
        return `${prefix}> ${content}`;
      case 'code':
        return `
${prefix}\`\`\`
${prefix}${content}
${prefix}\`\`\`
`;
      case 'image':
        return `${prefix}![](${content})`;
      default:
        return content;
    }
  }

  factoryTextAnnotation(annotation: RichTextAnnotation, text: string) {
    let result = text;

    if (annotation.bold) result = `**${result}**`;
    if (annotation.italic) result = `*${result}*`;
    if (annotation.strikethrough) result = `~${result}~`;
    if (annotation.underline) result = `_${result}_`;
    if (annotation.code) result = `\`${result}\``;

    return result;
  }
}

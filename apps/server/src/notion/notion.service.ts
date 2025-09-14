import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { BlockObjectResponse, Client, ListBlockChildrenResponse } from '@notionhq/client';
import { Model } from 'mongoose';
import { HttpExceptionData } from 'src/http-exception/http-exception-data';
import { NotionSyncHistory, NotionSyncHistoryStatus } from 'src/mongoose/schemas/notion-sync-history.schema';

import {
  GetNotionSyncHistoriesPayload,
  NotionDocumentGenerator,
  NotionMetadata,
  RichTextAnnotation,
} from './notion.type';

@Injectable()
export class NotionService {
  private readonly notion: Client;
  private readonly searchBlockTypes: BlockObjectResponse['type'][] = [
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
    'toggle',
    'bookmark',
    'breadcrumb',
    'audio',
    'bookmark',
    'breadcrumb',
    'callout',
    'link_preview',
    'link_to_page',
    'table',
    'table_of_contents',
    'quote',
    'divider',
    'template',
    'synced_block',
    'file',
    'image',
  ];
  private readonly nextPagePropertyKeys = ['child_page'];

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

  async *notionDocumentGenerator(
    blockId: string,
    parent: { pageId: string; title: string; documentUrl: string; createdAt: Date; updatedAt: Date } | null = null,
  ): NotionDocumentGenerator {
    let document: ListBlockChildrenResponse;
    let pageId: string | null = parent?.pageId ?? null;
    let pageTitle: string | null = parent?.title ?? null;
    let documentUrl: string | null = parent?.documentUrl ?? null;
    let createdAt: Date | null = parent?.createdAt ?? null;
    let updatedAt: Date | null = parent?.updatedAt ?? null;

    try {
      document = await this.getNotionDocument(blockId);

      if (parent === null) {
        const metadata = await this.getNotionMetadata(blockId);
        pageId = metadata.id;
        pageTitle = metadata.properties.title.title.map((title) => title.plain_text).join('');
        documentUrl = metadata.url;
        createdAt = new Date(metadata.created_time);
        updatedAt = new Date(metadata.last_edited_time);
      }
    } catch (error) {
      if ('code' in error) {
        yield {
          status: { success: false, error: error.code },
          result: null,
          done: true,
        };
      }
      yield {
        status: { success: false, error: 'unknown-error' },
        result: null,
        done: true,
      };
    }

    for (let i = 0; i < document.results.length; i += 1) {
      const block = document.results[i];
      const blockObj = block as BlockObjectResponse;
      const type = blockObj.type;
      const hasChildren = 'has_children' in blockObj ? blockObj.has_children : false;

      if (this.nextPagePropertyKeys.includes(type)) {
        const notionDocumentGenerator = await this.notionDocumentGenerator(blockObj.id);
        let notionDocumentGeneratorResult = await notionDocumentGenerator.next();

        while (!notionDocumentGeneratorResult.done) {
          yield notionDocumentGeneratorResult.value;
          notionDocumentGeneratorResult = await notionDocumentGenerator.next();
        }
      } else if (this.searchBlockTypes.includes(type)) {
        if (hasChildren === false) {
          const richTextArray = block[type].rich_text ?? [];
          let richTextContent = '';

          for (const richText of richTextArray) {
            richTextContent += this.factoryTextAnnotation(richText.annotations, richText.plain_text);
          }

          yield {
            result: {
              blockId: blockId,
              pageId,
              pageTitle,
              documentUrl,
              content: richTextContent,
              createdAt,
              updatedAt,
            },
            status: { success: true },
          };
        } else {
          const notionDocumentGenerator = await this.notionDocumentGenerator(blockObj.id, {
            pageId,
            title: pageTitle,
            documentUrl,
            createdAt,
            updatedAt,
          });
          let notionDocumentGeneratorResult = await notionDocumentGenerator.next();

          while (!notionDocumentGeneratorResult.done) {
            yield notionDocumentGeneratorResult.value;
            notionDocumentGeneratorResult = await notionDocumentGenerator.next();
          }
        }
      }

      yield {
        result: null,
        status: null,
        done: true,
      };
    }
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

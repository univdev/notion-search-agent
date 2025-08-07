import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@notionhq/client';

@Injectable()
export class NotionService {
  private readonly notion: Client;

  constructor(private readonly configService: ConfigService) {
    try {
      this.notion = new Client({
        auth: this.configService.get('NOTION_TOKEN'),
      });
    } catch {
      throw new Error('Failed to initialize Notion client');
    }
  }

  getClient() {
    return this.notion;
  }
}

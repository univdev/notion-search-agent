import { Controller, DefaultValuePipe, Get, Ip, ParseIntPipe, Patch, Query } from '@nestjs/common';

import { NotionService } from './notion.service';

@Controller('notion')
export class NotionController {
  constructor(private readonly notionService: NotionService) {}

  @Get('sync-histories')
  async getSyncHistories(
    @Query('offset', new DefaultValuePipe(0), new ParseIntPipe()) offset: number,
    @Query('limit', new DefaultValuePipe(10), new ParseIntPipe()) limit: number,
  ) {
    return await this.notionService.getNotionSyncHistories({
      offset,
      limit,
    });
  }

  @Patch('sync')
  async notionSync(@Ip() ip: string) {
    return await this.notionService.sync({
      ip,
    });
  }

  @Get('search')
  async search(@Query('q') question: string) {
    return await this.notionService.getSentencesByQuestion(question);
  }
}

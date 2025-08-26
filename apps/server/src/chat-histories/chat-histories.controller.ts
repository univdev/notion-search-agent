import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';

import { ChatHistoriesService } from './chat-histories.service';

@Controller('chat-histories')
export class ChatHistoriesController {
  constructor(private readonly chatHistoriesService: ChatHistoriesService) {}

  @Get()
  async getChatHistories(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const items = await this.chatHistoriesService.getChatHistories({
      offset,
      limit,
    });

    return {
      data: items,
      pagination: {
        offset,
        limit,
        loadedCount: items.length,
      },
    };
  }

  @Get(':id')
  async getChatHistoryById(@Param('id') id: string) {
    return await this.chatHistoriesService.getChatHistoryById(id);
  }
}

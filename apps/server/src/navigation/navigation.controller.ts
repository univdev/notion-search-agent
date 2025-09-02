import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';

import { NavigationService } from './navigation.service';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get('conversations')
  async getConversations(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const items = await this.navigationService.getConversations({ offset, limit });

    return {
      data: items,
      pagination: {
        offset,
        limit,
        loadedCount: items.length,
      },
    };
  }
}

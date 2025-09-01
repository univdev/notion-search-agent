import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';

import { SyncHistoriesService } from './sync-histories.service';

@Controller('sync-histories')
export class SyncHistoriesController {
  constructor(private readonly syncHistoriesService: SyncHistoriesService) {}

  @Get('/notion')
  async getNotionSyncHistories(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const items = await this.syncHistoriesService.getNotionSyncHistories({ offset, limit });

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

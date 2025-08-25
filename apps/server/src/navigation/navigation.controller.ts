import { Controller, Get } from '@nestjs/common';

import { NavigationService } from './navigation.service';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get('chat-histories')
  async getChatHistories() {
    const items = await this.navigationService.getChatHistories();

    return {
      data: items,
    };
  }
}

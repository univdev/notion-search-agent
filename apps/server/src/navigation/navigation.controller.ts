import { Controller, Get } from '@nestjs/common';

import { NavigationService } from './navigation.service';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get('conversations')
  async getConversations() {
    const items = await this.navigationService.getConversations();

    return {
      data: items,
    };
  }
}

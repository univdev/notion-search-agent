import { Controller, Ip, Post } from '@nestjs/common';

import { KnowledgesService } from './knowledges.service';

@Controller('knowledges')
export class KnowledgesController {
  constructor(private readonly knowledgesService: KnowledgesService) {}

  @Post('/notion/documents')
  async syncNotionDocuments(@Ip() ip: string) {
    return this.knowledgesService.syncNotionDocuments({
      ip,
    });
  }
}

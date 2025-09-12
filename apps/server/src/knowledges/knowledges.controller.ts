import { Controller, Ip, Post, Response } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';

import { KnowledgesService } from './knowledges.service';

@Controller('knowledges')
export class KnowledgesController {
  constructor(private readonly knowledgesService: KnowledgesService) {}

  @Post('/notion/documents')
  async syncNotionDocuments(@Response() response: ExpressResponse, @Ip() senderIp: string) {
    return this.knowledgesService.syncNotionDocuments(response, senderIp);
  }
}
